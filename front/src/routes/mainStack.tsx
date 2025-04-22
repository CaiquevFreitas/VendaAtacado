import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types'; 
import ClientNavigator from './clientNavigator';
import LojaNavigator from './lojaNavigator';
import Login from '../screens/cliente/login';
import Cadastro from '../screens/cliente/cadastro';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStackNavigator({ userType }: { userType: string | null }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Rota principal do app */}
      {userType === 'cliente' ? (
        <Stack.Screen name="ClienteTabs" component={ClientNavigator} />
      ) : userType === 'lojista' ? (
        <Stack.Screen name="LojaTabs" component={LojaNavigator} />
      ) : (
        <Stack.Screen name="ClienteTabs" component={ClientNavigator} />
      )}

      {/* Telas acessível de qualquer lugar */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name='Cadastro' component={Cadastro} />
    </Stack.Navigator>
  );
}
