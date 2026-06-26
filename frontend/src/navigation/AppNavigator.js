import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { Ionicons } from '@expo/vector-icons'

import HomeScreen      from '../screens/HomeScreen'
import SearchScreen    from '../screens/SearchScreen'
import CartScreen      from '../screens/CartScreen'
import WishlistScreen  from '../screens/WishlistScreen'
import AccountScreen   from '../screens/AccountScreen'
import ProductScreen   from '../screens/ProductScreen'
import CategoryScreen  from '../screens/CategoryScreen'
import CheckoutScreen  from '../screens/CheckoutScreen'

import { useStore } from '../store'

const Tab   = createBottomTabNavigator()
const Stack = createStackNavigator()

const PRIMARY = '#2d6a4f'

function HomeTabs() {
  const cart = useStore(s => s.cart)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { paddingBottom: 6, height: 60 },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            Home:     focused ? 'home'          : 'home-outline',
            Search:   focused ? 'search'        : 'search-outline',
            Cart:     focused ? 'cart'          : 'cart-outline',
            Wishlist: focused ? 'heart'         : 'heart-outline',
            Account:  focused ? 'person'        : 'person-outline',
          }
          return <Ionicons name={icons[route.name]} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen} />
      <Tab.Screen name="Search"   component={SearchScreen} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarBadge: cartCount > 0 ? cartCount : undefined }}
      />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Account"  component={AccountScreen} />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs"     component={HomeTabs} />
        <Stack.Screen name="Product"  component={ProductScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
