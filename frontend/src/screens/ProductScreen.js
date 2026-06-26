import React, { useState, useEffect } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useStore } from '../store'
import { productApi } from '../api/client'

const PRIMARY = '#2d6a4f'

function finalPrice(product) {
  if (!product.discount) return product.price
  return +(product.price * (1 - product.discount / 100)).toFixed(0)
}

export default function ProductScreen({ route, navigation }) {
  const { id } = route.params
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty]   = useState(1)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await productApi.detail(id)
        setProduct(res.data)
      } catch (err) {
        console.error('ProductScreen fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const addToCart      = useStore(s => s.addToCart)
  const toggleWishlist = useStore(s => s.toggleWishlist)
  const isWishlisted   = useStore(s => s.isWishlisted(id))

  if (!product) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Product not found</Text>
      </View>
    )
  }

  const price = finalPrice(product)

  return (
    <SafeAreaView style={styles.safe}>
      {/* Back + wishlist header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleWishlist(id)} style={styles.iconBtn}>
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={22}
            color={isWishlisted ? '#e63946' : '#1a1a1a'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image area */}
        <View style={styles.imageArea}>
          <Text style={styles.bigEmoji}>
            {product.category === 'fruits' ? '🍎'
              : product.category === 'dairy-eggs' ? '🥛'
              : product.category === 'pantry' ? '🍯'
              : '🥦'}
          </Text>
          {product.discount && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.discount}% OFF</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          {/* Name & unit */}
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.unit}>{product.unit}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#f4a261" />
            <Text style={styles.ratingText}>{product.rating} ({product.reviews} reviews)</Text>
          </View>

          {/* Tags */}
          <View style={styles.tags}>
            {product.tags.map(t => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.desc}>{product.description}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{price}</Text>
            {product.discount && (
              <Text style={styles.originalPrice}>₹{product.price}</Text>
            )}
          </View>

          {/* Qty selector */}
          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(q => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={18} color={PRIMARY} />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty(q => q + 1)}
              >
                <Ionicons name="add" size={18} color={PRIMARY} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to cart CTA */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>₹{(price * qty).toFixed(0)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, !product.inStock && styles.addBtnDisabled]}
          onPress={() => {
            if (product.inStock) {
              addToCart(id, qty)
              navigation.navigate('Cart')
            }
          }}
          disabled={!product.inStock}
        >
          <Ionicons name="cart-outline" size={18} color="#fff" />
          <Text style={styles.addBtnText}>
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#fff' },
  topBar:        { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  iconBtn:       { padding: 8, backgroundColor: '#f5f5f5', borderRadius: 10 },
  imageArea:     { backgroundColor: '#f0f7f4', alignItems: 'center', justifyContent: 'center', height: 220, margin: 16, borderRadius: 20, position: 'relative' },
  bigEmoji:      { fontSize: 100 },
  badge:         { position: 'absolute', top: 12, left: 12, backgroundColor: '#e63946', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:     { color: '#fff', fontWeight: '700', fontSize: 12 },
  body:          { paddingHorizontal: 16, paddingBottom: 100 },
  name:          { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  unit:          { fontSize: 13, color: '#888', marginBottom: 8 },
  ratingRow:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  ratingText:    { fontSize: 13, color: '#555' },
  tags:          { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  tag:           { backgroundColor: '#e8f5e9', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText:       { fontSize: 11, color: PRIMARY, fontWeight: '600' },
  desc:          { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 16 },
  priceRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  price:         { fontSize: 26, fontWeight: '700', color: PRIMARY },
  originalPrice: { fontSize: 16, color: '#aaa', textDecorationLine: 'line-through' },
  qtyRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyLabel:      { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  qtyControl:    { flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  qtyBtn:        { padding: 2 },
  qtyValue:      { fontSize: 16, fontWeight: '700', color: '#1a1a1a', minWidth: 24, textAlign: 'center' },
  footer:        { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#f0f0f0', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 8 },
  totalLabel:    { fontSize: 12, color: '#888' },
  totalPrice:    { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  addBtn:        { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: PRIMARY, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14 },
  addBtnDisabled:{ backgroundColor: '#ccc' },
  addBtnText:    { color: '#fff', fontWeight: '700', fontSize: 15 },
})
