import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import { useStore } from '../store'
import ProductCard from '../components/ProductCard'

const PRIMARY = '#2d6a4f'

// Mock products cache — in production, fetch from API and cache in Zustand
const PRODUCTS_CACHE = require('../data/products').PRODUCTS

function getProduct(id) {
  return PRODUCTS_CACHE.find(p => p.id === id)
}

export default function WishlistScreen({ navigation }) {
  const wishlist = useStore(s => s.wishlist)
  const items    = wishlist.map(id => getProduct(id)).filter(Boolean)

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Items</Text>
        {items.length > 0 && (
          <Text style={styles.count}>{items.length} item{items.length !== 1 ? 's' : ''}</Text>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🤍</Text>
          <Text style={styles.emptyTitle}>No saved items yet</Text>
          <Text style={styles.emptySubtitle}>Tap the heart on any product to save it here.</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopBtnText}>Discover Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={p => p.id}
          numColumns={2}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('Product', { id: item.id })}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#f8faf8' },
  header:       { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  title:        { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  count:        { fontSize: 13, color: '#888', marginTop: 2 },
  empty:        { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji:   { fontSize: 56, marginBottom: 12 },
  emptyTitle:   { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 6 },
  emptySubtitle:{ fontSize: 13, color: '#888', marginBottom: 20, textAlign: 'center' },
  shopBtn:      { backgroundColor: PRIMARY, borderRadius: 20, paddingHorizontal: 24, paddingVertical: 12 },
  shopBtnText:  { color: '#fff', fontWeight: '700' },
})
