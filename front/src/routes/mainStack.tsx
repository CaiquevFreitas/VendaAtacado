import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types'; 
import ClientNavigator from './clientNavigator';
import LojaNavigator from './lojaNavigator';
import Login from '../screens/cliente/login';
import Cadastro from '../screens/cliente/cadastro';
import CadastroLoja from '../screens/loja/cadastro';
import LoginLoja from '../screens/loja/login';
import ConfiguracoesLoja from '../screens/loja/configuracoes';
import AlterarInformacoesLoja from '../screens/loja/alterarInformacoesLoja';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStackNavigator({ userType }: { userType: string | null }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Rota principal do app */}
      {userType === 'cliente' ? (
        <Stack.Screen name="ClienteTabs" component={ClientNavigator} />
      ) : userType === 'loja' ? (
        <Stack.Screen name="LojaTabs" component={LojaNavigator} />
      ) : (
        <Stack.Screen name="ClienteTabs" component={ClientNavigator} />
      )}

      {/* Telas acessível de qualquer lugar */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="LoginLoja" component={LoginLoja} />
      <Stack.Screen name='Cadastro' component={Cadastro} />
      <Stack.Screen name='CadastroLoja' component={CadastroLoja} />
      <Stack.Screen name='ConfiguracoesLoja' component={ConfiguracoesLoja} />
      <Stack.Screen name='AlterarInformacoesLoja' component={AlterarInformacoesLoja} />
    </Stack.Navigator>
  );
}
