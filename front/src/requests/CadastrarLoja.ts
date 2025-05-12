import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function cadastrarLoja(
  nomeVendedor: string,
  nomeLoja: string,
  cpf: string,
  telefone: string,
  email: string,
  senha: string,
  dataNascimento: string,
  confirmarSenha: string,
  horario: string,
  logo: string,
  cep: string,          // Adicionando o parâmetro cep
  rua: string,          // Adicionando o parâmetro rua
  bairro: string,       // Adicionando o parâmetro bairro
  cidade: string,       // Adicionando o parâmetro cidade
  estado: string        // Adicionando o parâmetro estado
): Promise<boolean> {
  try {
    const response = await fetch('http://192.168.69.96:3000/cadastroLoja', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nomeVendedor,
        nomeLoja,
        cpf,
        telefone,
        email,
        senha,
        dataNascimento,
        confirmarSenha,
        horario,
        logo,
        cep,           // Enviando o parâmetro cep
        rua,           // Enviando o parâmetro rua
        bairro,        // Enviando o parâmetro bairro
        cidade,        // Enviando o parâmetro cidade
        estado         // Enviando o parâmetro estado
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
