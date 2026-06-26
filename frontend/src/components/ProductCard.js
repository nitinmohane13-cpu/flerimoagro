import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useStore } from '../store'
import { finalPrice } from '../data/products'

const PRIMARY = '#2d6a4f'

export default function ProductCard({ product, onPress }) {
  const addToCart     = useStore(s => s.addToCart)
  const toggleWishlist = useStore(s => s.toggleWishlist)
  const isWishlisted  = useStore(s => s.isWishlisted(product.id))
  const price         = finalPrice(product)

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Wishlist */}
      <TouchableOpacity
        style={styles.heartBtn}
        onPress={() => toggleWishlist(product.id)}
      >
        <Ionicons
          name={isWishlisted ? 'heart' : 'heart-outline'}
          size={18}
          color={isWishlisted ? '#e63946' : '#aaa'}
        />
      </TouchableOpacity>

      {/* Discount badge */}
      {product.discount ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{product.discount}% off</Text>
        </View>
      ) : null}

      {/* Image placeholder */}
      <View style={styles.imagePlaceholder}>
        <Text style={styles.emoji}>
          {product.category === 'fruits' ? '🍎'
            : product.category === 'dairy-eggs' ? '🥛'
            : product.category === 'pantry' ? '🍯'
            : '🥦'}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.unit}>{product.unit}</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.price}>₹{price}</Text>
            {product.discount ? (
              <Text style={styles.originalPrice}>₹{product.price}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={[styles.addBtn, !product.inStock && styles.addBtnDisabled]}
            onPress={() => product.inStock && addToCart(product.id)}
            disabled={!product.inStock}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {!product.inStock && (
          <Text style={styles.outOfStock}>Out of stock</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    margin: 6,
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  heartBtn: {
    position: 'absolute', top: 8, right: 8, zIndex: 1,
  },
  badge: {
    position: 'absolute', top: 8, left: 8, zIndex: 1,
    backgroundColor: '#e63946', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  imagePlaceholder: {
    backgroundColor: '#f0f7f4', borderRadius: 10,
    height: 90, alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: { fontSize: 40 },
  info: { gap: 2 },
  name: { fontSize: 13, fontWeight: '600', color: '#1a1a1a' },
  unit: { fontSize: 11, color: '#888', marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 15, fontWeight: '700', color: PRIMARY },
  originalPrice: { fontSize: 11, color: '#aaa', textDecorationLine: 'line-through' },
  addBtn: {
    backgroundColor: PRIMARY, borderRadius: 8,
    width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
  },
  addBtnDisabled: { backgroundColor: '#ccc' },
  outOfStock: { fontSize: 10, color: '#e63946', marginTop: 2 },
})
