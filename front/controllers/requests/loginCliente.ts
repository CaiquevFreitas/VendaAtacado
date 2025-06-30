import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from "./api.url";

export async function logarCliente(email: string, senha: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/loginCliente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem('userType', 'cliente');
      const clienteData: {
        id: number;
        nome: string;
        email: string;
        telefone: string;
        dataNascimento: string;
        senha: string;
        idCarrinho: number;
      } = {
        id: dados.user.id,
        nome: dados.user.nome,
        email: dados.user.email,
        telefone: dados.user.telefone,
        dataNascimento: dados.user.dataNascimento,
        senha: dados.user.senha,
        idCarrinho: dados.user.idCarrinho
      };
      await AsyncStorage.setItem('clienteData', JSON.stringify(clienteData));
      await AsyncStorage.setItem('idCarrinho', String(dados.user.idCarrinho));
      Alert.alert('Sucesso', 'Login realizado!');
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
