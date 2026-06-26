import React, { useState, useEffect } from 'react'
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ProductCard from '../components/ProductCard'
import { productApi } from '../api/client'

const PRIMARY = '#2d6a4f'

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length === 0) {
      setResults([])
      return
    }
    async function search() {
      try {
        setLoading(true)
        const res = await productApi.list({ search: query })
        setResults(res.data)
      } catch (err) {
        console.error('SearchScreen fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    search()
  }, [query])

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.inputRow}>
          <Ionicons name="search-outline" size={18} color="#888" />
          <TextInput
            style={styles.input}
            placeholder="Search fruits, veggies, groceries..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyText}>Search for fresh produce, dairy, pantry staples...</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>😕</Text>
          <Text style={styles.emptyText}>No results for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
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
  safe:      { flex: 1, backgroundColor: '#f8faf8' },
  header:    { backgroundColor: '#fff', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  inputRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  input:     { flex: 1, fontSize: 14, color: '#1a1a1a' },
  empty:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji:{ fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#888', textAlign: 'center' },
})
