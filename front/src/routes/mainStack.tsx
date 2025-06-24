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
import AlterarEndereco from '../screens/loja/alterarEndereco';
import AlterarLogo from '../screens/loja/alterarLogo';
import ConfiguracoesCliente from '../screens/cliente/configuracoes';
import AlterarFotoCliente from '../screens/cliente/alterarFotoCliente';
import AlterarInformacoesCliente from '../screens/cliente/alterarInformacoesCliente';
import PageLoja from '../components/pageLoja/index';
import PageProduto from '../components/pageProduto/index';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStackNavigator({ userType }: { userType: string | null }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClienteTabs" component={ClientNavigator} />
      <Stack.Screen name="LojaTabs" component={LojaNavigator} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="LoginLoja" component={LoginLoja} />
      <Stack.Screen name='Cadastro' component={Cadastro} />
      <Stack.Screen name='CadastroLoja' component={CadastroLoja} />
      <Stack.Screen name='ConfiguracoesLoja' component={ConfiguracoesLoja} />
      <Stack.Screen name='AlterarInformacoesLoja' component={AlterarInformacoesLoja} />
      <Stack.Screen name='AlterarEndereco' component={AlterarEndereco} />
      <Stack.Screen name='AlterarLogo' component={AlterarLogo} />
      <Stack.Screen name='ConfiguracoesCliente' component={ConfiguracoesCliente} />
      <Stack.Screen name='AlterarFotoCliente' component={AlterarFotoCliente} />
      <Stack.Screen name='AlterarInformacoesCliente' component={AlterarInformacoesCliente} />
      <Stack.Screen name='PageLoja' component={PageLoja} />
      <Stack.Screen name='PageProduto' component={PageProduto} />
    </Stack.Navigator>
  );
}
