import React from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useStore } from '../store'

const PRIMARY    = '#2d6a4f'
const FREE_OVER  = 299
const DELIVERY   = 40

// Mock products cache — in production, fetch from API and cache in Zustand
const PRODUCTS_CACHE = require('../data/products').PRODUCTS

function getProduct(id) {
  return PRODUCTS_CACHE.find(p => p.id === id)
}

function finalPrice(product) {
  if (!product.discount) return product.price
  return +(product.price * (1 - product.discount / 100)).toFixed(0)
}

export default function CartScreen({ navigation }) {
  const cart          = useStore(s => s.cart)
  const setQty        = useStore(s => s.setQty)
  const removeFromCart = useStore(s => s.removeFromCart)
  const subtotal      = cart.reduce((sum, i) => {
    const p = getProduct(i.id)
    return p ? sum + finalPrice(p) * i.qty : sum
  }, 0)
  const deliveryFee   = subtotal === 0 || subtotal >= FREE_OVER ? 0 : DELIVERY
  const total         = subtotal + deliveryFee

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}><Text style={styles.title}>My Cart</Text></View>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some farm-fresh goodies!</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Text style={styles.title}>My Cart</Text></View>

      <FlatList
        data={cart}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 14 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => {
          const product = getProduct(item.id)
          if (!product) return null
          const price = finalPrice(product)
          return (
            <View style={styles.cartItem}>
              <View style={styles.itemEmoji}>
                <Text style={{ fontSize: 36 }}>
                  {product.category === 'fruits' ? '🍎' : product.category === 'dairy-eggs' ? '🥛' : product.category === 'pantry' ? '🍯' : '🥦'}
                </Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{product.name}</Text>
                <Text style={styles.itemUnit}>{product.unit}</Text>
                <View style={styles.itemBottom}>
                  <Text style={styles.itemPrice}>₹{(price * item.qty).toFixed(0)}</Text>
                  <View style={styles.qtyControl}>
                    <TouchableOpacity onPress={() => setQty(item.id, item.qty - 1)} style={styles.qtyBtn}>
                      <Ionicons name="remove" size={16} color={PRIMARY} />
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.qty}</Text>
                    <TouchableOpacity onPress={() => setQty(item.id, item.qty + 1)} style={styles.qtyBtn}>
                      <Ionicons name="add" size={16} color={PRIMARY} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={18} color="#e63946" />
              </TouchableOpacity>
            </View>
          )
        }}
        ListFooterComponent={() => (
          <View style={styles.summary}>
            <Row label="Subtotal" value={`₹${subtotal.toFixed(0)}`} />
            <Row label="Delivery" value={deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`} />
            {subtotal < FREE_OVER && subtotal > 0 && (
              <Text style={styles.freeDeliveryHint}>
                Add ₹{FREE_OVER - subtotal} more for free delivery
              </Text>
            )}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(0)}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout · ₹{total.toFixed(0)}</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  header:          { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  title:           { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  empty:           { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji:      { fontSize: 56, marginBottom: 12 },
  emptyTitle:      { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 6 },
  emptySubtitle:   { fontSize: 13, color: '#888', marginBottom: 20 },
  shopBtn:         { backgroundColor: PRIMARY, borderRadius: 20, paddingHorizontal: 24, paddingVertical: 12 },
  shopBtnText:     { color: '#fff', fontWeight: '700' },
  cartItem:        { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  itemEmoji:       { width: 60, height: 60, backgroundColor: '#f0f7f4', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemInfo:        { flex: 1 },
  itemName:        { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  itemUnit:        { fontSize: 11, color: '#888', marginBottom: 8 },
  itemBottom:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemPrice:       { fontSize: 15, fontWeight: '700', color: PRIMARY },
  qtyControl:      { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  qtyBtn:          { padding: 2 },
  qtyValue:        { fontSize: 14, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  deleteBtn:       { padding: 8, marginLeft: 8 },
  summary:         { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginTop: 12, marginBottom: 100 },
  summaryRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel:    { fontSize: 14, color: '#888' },
  summaryValue:    { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  freeDeliveryHint:{ fontSize: 12, color: '#888', marginBottom: 8 },
  divider:         { height: 1, backgroundColor: '#f0f0f0', marginVertical: 10 },
  totalRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel:      { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  totalValue:      { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  footer:          { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  checkoutBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 16 },
  checkoutBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
