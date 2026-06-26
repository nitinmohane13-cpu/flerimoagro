import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, TextInput,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useStore } from '../store'

const PRIMARY = '#2d6a4f'

const MENU = [
  { label: 'My Orders',           icon: 'bag-outline' },
  { label: 'Delivery Addresses',  icon: 'location-outline' },
  { label: 'Payment Methods',     icon: 'card-outline' },
  { label: 'Notifications',       icon: 'notifications-outline' },
  { label: 'Help & Support',      icon: 'help-circle-outline' },
]

export default function AccountScreen({ navigation }) {
  const user     = useStore(s => s.user)
  const signIn   = useStore(s => s.signIn)
  const signOut  = useStore(s => s.signOut)
  const wishlist = useStore(s => s.wishlist)
  const cart     = useStore(s => s.cart)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  if (!user) return <AuthForm onSignIn={signIn} />

  const initials = user.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Stat label="Orders"  value="12" />
          <Stat label="Saved"   value={String(wishlist.length)} />
          <Stat label="In Cart" value={String(cartCount)} />
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU.map(item => (
            <TouchableOpacity key={item.label} style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={20} color={PRIMARY} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Ionicons name="log-out-outline" size={18} color="#e63946" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

function AuthForm({ onSignIn }) {
  const [mode, setMode]         = useState('signin')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  function submit() {
    const finalName = mode === 'signup' ? name : (email.split('@')[0] || 'Guest')
    onSignIn({ name: finalName, email }, null) // null token — swap with real JWT later
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.authContainer}>
        <View style={styles.authIcon}>
          <Ionicons name="leaf" size={32} color="#fff" />
        </View>
        <Text style={styles.authTitle}>
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </Text>
        <Text style={styles.authSubtitle}>
          {mode === 'signin' ? 'Sign in to track your orders.' : 'Join FlerimoAgro for fresh produce delivered fast.'}
        </Text>

        {mode === 'signup' && (
          <Field label="Full Name" value={name} onChangeText={setName} placeholder="Jane Appleseed" />
        )}
        <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
        <Field label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />

        <TouchableOpacity style={styles.authBtn} onPress={submit}>
          <Text style={styles.authBtnText}>
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          <Text style={styles.switchText}>
            {mode === 'signin' ? "Don't have an account? " : 'Already a member? '}
            <Text style={{ color: PRIMARY, fontWeight: '700' }}>
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
        autoCapitalize="none"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: '#f8faf8' },
  profileHeader:  { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: PRIMARY, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  avatar:         { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarText:     { color: '#fff', fontSize: 20, fontWeight: '700' },
  userName:       { color: '#fff', fontSize: 17, fontWeight: '700' },
  userEmail:      { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  statsRow:       { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: -14, marginBottom: 16 },
  stat:           { flex: 1, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', paddingVertical: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  statValue:      { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  statLabel:      { fontSize: 11, color: '#888', marginTop: 2 },
  menu:           { backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 16, marginBottom: 14, overflow: 'hidden' },
  menuItem:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuIcon:       { width: 36, height: 36, backgroundColor: '#f0f7f4', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel:      { flex: 1, fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
  signOutBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#ffd6d8', backgroundColor: '#fff4f4', marginBottom: 30 },
  signOutText:    { color: '#e63946', fontWeight: '600', fontSize: 14 },
  // Auth form
  authContainer:  { padding: 24, paddingTop: 60, alignItems: 'center' },
  authIcon:       { width: 64, height: 64, borderRadius: 18, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  authTitle:      { fontSize: 24, fontWeight: '700', color: '#1a1a1a', marginBottom: 6 },
  authSubtitle:   { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 28 },
  field:          { width: '100%', marginBottom: 14 },
  fieldLabel:     { fontSize: 13, fontWeight: '600', color: '#1a1a1a', marginBottom: 6 },
  fieldInput:     { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1a1a1a', backgroundColor: '#fff' },
  authBtn:        { width: '100%', backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 6, marginBottom: 16 },
  authBtnText:    { color: '#fff', fontWeight: '700', fontSize: 15 },
  switchText:     { fontSize: 13, color: '#888', textAlign: 'center' },
})
