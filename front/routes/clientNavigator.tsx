import React from 'react'
import { createBottomTabNavigator } from  '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import Perfil from '@/app/screens/cliente/perfil'
import Carrinho from '@/app/screens/cliente/carrinho'
import Buscar from '@/app/screens/cliente/buscar'
import Home from '@/app/screens/cliente/home'

const Tab = createBottomTabNavigator();

export default function ClientNavigator(){
  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let iconName: keyof typeof Ionicons.glyphMap; 

      switch (route.name) {
        case 'Home':
          iconName = 'home-outline';
          break;
        case 'Buscar':
          iconName = 'search-outline';
          break;
        case 'Carrinho':
          iconName = 'cart-outline';
          break;
        case 'Perfil':
          iconName = 'person-outline';
          break;
        default:
          iconName = 'help-circle-outline'; 
      }
      return <Ionicons name={iconName} size={size} color={color} />;
    },
  })}>
        <Tab.Screen name='Home' component={Home} />
        <Tab.Screen name="Perfil" component={Perfil} />
        <Tab.Screen name='Buscar' component={Buscar} />
        <Tab.Screen name='Carrinho' component={Carrinho} />
    </Tab.Navigator>
  )
}