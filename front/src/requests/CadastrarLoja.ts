import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function cadastrarLoja(
  nomeLoja: string,
  cpf: string,
  endereco: string,
  horario: string,
  telefone: string,
  email: string,
  senha: string
): Promise<boolean> {
  try {
    const response = await fetch('http://192.168.69.96:3000/cadastroLoja', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nomeLoja,
        cpf,
        endereco,
        horario,
        telefone,
        email,
        senha
      }),
    });

    const dados = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem('userType', 'loja');
      Alert.alert('Sucesso', 'Loja cadastrada com sucesso!');
      return true;
    } else {
      Alert.alert('Erro', dados.message || 'Falha no Cadastro');
      return false;
    }
  } catch (error) {
    console.error('Erro:', error);
    Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    return false;
  }
}
