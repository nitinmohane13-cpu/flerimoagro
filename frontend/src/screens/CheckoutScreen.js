import React, { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useStore } from '../store'

const PRIMARY   = '#2d6a4f'
const FREE_OVER = 299
const DELIVERY  = 40

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: 'card-outline' },
  { id: 'upi',  label: 'UPI',                 icon: 'phone-portrait-outline' },
  { id: 'cod',  label: 'Cash on Delivery',    icon: 'cash-outline' },
]

export default function CheckoutScreen({ navigation }) {
  const cart      = useStore(s => s.cart)
  const clearCart = useStore(s => s.clearCart)
  const user      = useStore(s => s.user)
  const subtotal  = useStore(s => s.cartSubtotal)

  const [payment, setPayment] = useState('upi')
  const [placed, setPlaced]   = useState(false)
  const [form, setForm]       = useState({
    name: user?.name || '', phone: '', address: '', city: '', note: '',
  })

  const deliveryFee = subtotal >= FREE_OVER ? 0 : DELIVERY
  const total       = subtotal + deliveryFee

  function placeOrder() {
    setPlaced(true)
    clearCart()
  }

  if (placed) {
    return (
      <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={64} color={PRIMARY} />
        </View>
        <Text style={styles.successTitle}>Order Confirmed! 🎉</Text>
        <Text style={styles.successSubtitle}>
          Thank you{form.name ? `, ${form.name.split(' ')[0]}` : ''}!{'\n'}
          Your fresh groceries are on the way and will arrive within 2 hours.
        </Text>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => { navigation.navigate('Home') }}
        >
          <Text style={styles.continueBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Delivery details */}
        <Text style={styles.sectionTitle}>Delivery Details</Text>
        <View style={styles.card}>
          <Field label="Full Name"      value={form.name}    onChangeText={v => setForm({...form, name: v})}    placeholder="Jane Appleseed" />
          <Field label="Phone Number"   value={form.phone}   onChangeText={v => setForm({...form, phone: v})}   placeholder="+91 98765 43210" keyboardType="phone-pad" />
          <Field label="Street Address" value={form.address} onChangeText={v => setForm({...form, address: v})} placeholder="123 Farm Lane" />
          <Field label="City / PIN"     value={form.city}    onChangeText={v => setForm({...form, city: v})}    placeholder="Mumbai, 400001" />
          <Field label="Delivery Note (optional)" value={form.note} onChangeText={v => setForm({...form, note: v})} placeholder="Leave at door" />
        </View>

        {/* Payment */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.card}>
          {PAYMENT_METHODS.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[styles.payOption, payment === p.id && styles.payOptionActive]}
              onPress={() => setPayment(p.id)}
            >
              <Ionicons name={p.icon} size={22} color={payment === p.id ? PRIMARY : '#888'} />
              <Text style={[styles.payLabel, payment === p.id && { color: PRIMARY }]}>{p.label}</Text>
              <View style={[styles.radio, payment === p.id && styles.radioActive]}>
                {payment === p.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.card}>
          <Row label="Subtotal"  value={`₹${subtotal.toFixed(0)}`} />
          <Row label="Delivery"  value={deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`} />
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(0)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place order */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeBtn, (!form.name || !form.phone || !form.address) && styles.placeBtnDisabled]}
          onPress={placeOrder}
          disabled={!form.name || !form.phone || !form.address}
        >
          <Text style={styles.placeBtnText}>Place Order · ₹{total.toFixed(0)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

function Field({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        keyboardType={keyboardType || 'default'}
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}

function Row({ label, value }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: '#f8faf8' },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  title:           { fontSize: 17, fontWeight: '700', color: '#1a1a1a' },
  sectionTitle:    { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 10, marginTop: 16 },
  card:            { backgroundColor: '#fff', borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  field:           { marginBottom: 12 },
  fieldLabel:      { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: 5 },
  fieldInput:      { borderWidth: 1, borderColor: '#e8e8e8', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#1a1a1a' },
  payOption:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  payOptionActive: { },
  payLabel:        { flex: 1, fontSize: 14, color: '#444' },
  radio:           { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  radioActive:     { borderColor: PRIMARY },
  radioDot:        { width: 10, height: 10, borderRadius: 5, backgroundColor: PRIMARY },
  summaryRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel:    { fontSize: 14, color: '#888' },
  summaryValue:    { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  divider:         { height: 1, backgroundColor: '#f0f0f0', marginVertical: 10 },
  totalRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel:      { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  totalValue:      { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  footer:          { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  placeBtn:        { backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  placeBtnDisabled:{ backgroundColor: '#aaa' },
  placeBtnText:    { color: '#fff', fontWeight: '700', fontSize: 15 },
  successIcon:     { marginBottom: 20 },
  successTitle:    { fontSize: 26, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  successSubtitle: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 22, marginBottom: 30, paddingHorizontal: 30 },
  continueBtn:     { backgroundColor: PRIMARY, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14 },
  continueBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
