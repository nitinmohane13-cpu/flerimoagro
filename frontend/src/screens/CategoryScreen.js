// ─── CategoryScreen ───────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ProductCard from '../components/ProductCard'
import { productApi } from '../api/client'

export default function CategoryScreen({ route, navigation }) {
  const { slug, name } = route.params
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await productApi.list({ category: slug })
        setProducts(res.data)
      } catch (err) {
        console.error('CategoryScreen fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [slug])

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
        <View style={{ width: 22 }} />
      </View>
      <FlatList
        data={products}
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#f8faf8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  title:  { fontSize: 17, fontWeight: '700', color: '#1a1a1a' },
})
