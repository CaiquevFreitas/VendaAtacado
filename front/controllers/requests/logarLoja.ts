import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from "./api.url";
import { mostrarEndereco } from './mostrarEndereco';

export async function logarLoja(email: string, senha: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/loginLoja`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem('userType', 'loja');
      const lojaData: {
        id: number;
        nomeLoja: string;
        nomeVendedor: string;
        horarioAbertura: string;
        horarioFechamento: string;
        telefone: string;
        senha: string;
        endereco?: any;
      } = {
        id: dados.loja.id,
        nomeLoja: dados.loja.nomeLoja,
        nomeVendedor: dados.loja.nomeVendedor,
        horarioAbertura: dados.loja.horarioAbertura,
        horarioFechamento: dados.loja.horarioFechamento,
        telefone: dados.loja.telefone,
        senha: dados.loja.senha
      };
      try {
        const endereco = await mostrarEndereco(lojaData.id);
        lojaData.endereco = endereco;
      } catch (e) {
        // Se não encontrar endereço, apenas ignora
      }
      await AsyncStorage.setItem('lojaData', JSON.stringify(lojaData));
      Alert.alert('Sucesso', 'Login da loja realizado!');
      return true;
    } else {
      Alert.alert('Erro', dados.message || 'Falha no Login');
      return false;
    }
  } catch (error) {
    console.error('Erro:', error);
    Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    return false;
  }
}