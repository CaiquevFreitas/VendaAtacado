import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ClientNavigator from './routes/clientNavigator';
import LojaNavigator from './routes/lojaNavigator';

export default function App() {
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkUserType = async () => {
      try {
        const storedType = await AsyncStorage.getItem('userType');
        setUserType(storedType ?? 'cliente'); // Define 'cliente' como padrão caso seja null
      } catch (error) {
        console.error('Erro ao recuperar userType:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUserType();
  }, []);
  
    if (loading) return null; // Evita erro ao carregar o AsyncStorage
  
    return (
      <NavigationContainer>
  <ClientNavigator />
</NavigationContainer>

    );
  }