import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function logarCliente(email: string, senha: string): Promise<boolean> {
  try {
    const response = await fetch('http://192.168.69.96:3000/loginCliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem('userType', 'cliente');
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
