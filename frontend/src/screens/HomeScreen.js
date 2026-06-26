import React, { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, FlatList, SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ProductCard from '../components/ProductCard'
import { useStore } from '../store'
import { productApi } from '../api/client'

const PRIMARY = '#2d6a4f'

export default function HomeScreen({ navigation }) {
  const user = useStore(s => s.user)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productApi.list(),
          productApi.categories(),
        ])
        setProducts(productsRes.data)
        setCategories(categoriesRes.data)
      } catch (err) {
        console.error('HomeScreen fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const popular = products.filter(p => p.rating >= 4.7).slice(0, 6)
  const deals   = products.filter(p => p.discount)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.name?.split(' ')[0] || 'Guest'} 👋
            </Text>
            <Text style={styles.subtitle}>What are you looking for today?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Account')}>
            <Ionicons name="person-circle-outline" size={36} color={PRIMARY} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search-outline" size={18} color="#888" />
          <Text style={styles.searchText}>Search fruits, veggies, groceries...</Text>
        </TouchableOpacity>

        {/* Promo banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTag}>FREE DELIVERY OVER ₹299</Text>
          <Text style={styles.bannerTitle}>Farm-fresh produce,{'\n'}picked today</Text>
          <TouchableOpacity
            style={styles.bannerBtn}
            onPress={() => navigation.navigate('Category', { slug: 'vegetables', name: 'Vegetables' })}
          >
            <Text style={styles.bannerBtnText}>Shop now →</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.slug}
                style={styles.catChip}
                onPress={() => navigation.navigate('Category', { slug: cat.slug, name: cat.name })}
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text style={styles.catName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Deals */}
        {deals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Deals</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
              {deals.map(p => (
                <View key={p.id} style={{ width: 160 }}>
                  <ProductCard
                    product={p}
                    onPress={() => navigation.navigate('Product', { id: p.id })}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Popular */}
        <View style={[styles.section, { marginBottom: 20 }]}>
          <Text style={styles.sectionTitle}>Popular This Week</Text>
          <View style={styles.grid}>
            {popular.map(p => (
              <View key={p.id} style={styles.gridItem}>
                <ProductCard
                  product={p}
                  onPress={() => navigation.navigate('Product', { id: p.id })}
                />
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#f8faf8' },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  greeting:     { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  subtitle:     { fontSize: 13, color: '#888', marginTop: 2 },
  searchBar:    { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  searchText:   { color: '#aaa', fontSize: 14 },
  banner:       { marginHorizontal: 16, backgroundColor: PRIMARY, borderRadius: 18, padding: 20, marginBottom: 20 },
  bannerTag:    { fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: '600', letterSpacing: 0.5, marginBottom: 6 },
  bannerTitle:  { fontSize: 20, fontWeight: '700', color: '#fff', lineHeight: 26, marginBottom: 14 },
  bannerBtn:    { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start' },
  bannerBtnText:{ fontSize: 13, fontWeight: '600', color: PRIMARY },
  section:      { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  catChip:      { alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginRight: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  catEmoji:     { fontSize: 24, marginBottom: 4 },
  catName:      { fontSize: 12, fontWeight: '600', color: '#444' },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginHorizontal: -6 },
  gridItem:     { width: '50%' },
})
