import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PerfilLogado from '../screens/cliente/perfilLogado';
import Perfil from '../screens/cliente/perfil';
import Carrinho from '../screens/cliente/carrinho';
import Buscar from '../screens/cliente/buscar';
import Home from '../screens/cliente/home';
import { ActivityIndicator, View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function ClientNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCliente, setIsCliente] = useState<boolean | null>(null);

  useEffect(() => {
    const verificarPerfil = async () => {
      try {
        const userType = await AsyncStorage.getItem('userType');
        setIsCliente(userType === 'cliente');
      } catch (error) {
        console.error('Erro ao verificar tipo de usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verificarPerfil();
  }, []);

  if (isLoading || isCliente === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Buscar" component={Buscar} />
      <Tab.Screen name="Carrinho" component={Carrinho} />
      <Tab.Screen name="Perfil" component={isCliente ? PerfilLogado : Perfil} />
    </Tab.Navigator>
  );
}
