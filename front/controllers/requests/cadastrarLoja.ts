import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from "./api.url";

export async function cadastrarLoja(
  nomeLoja: string,
  nomeVendedor: string,
  cnpj: string,
  dataNascimento: Date,
  horarioAbertura: Date,
  horarioFechamento: Date,
  telefone: string,
  email: string,
  senha: string
){
  try {
    const response = await fetch(`${API_URL}/cadastroLoja`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nomeLoja,
        nomeVendedor,
        dataNascimento,
        cnpj,
        horarioAbertura,
        horarioFechamento,
        telefone,
        email,
        senha
      }),
    });

    const dados = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem('userType', 'loja');
      Alert.alert('Sucesso', 'Loja cadastrada com sucesso!');
    } else {
      Alert.alert('Erro', dados.message || 'Falha no Cadastro');
    }
  } catch (error) {
    console.error('Erro:', error);
    Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
  }
}