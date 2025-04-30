import { Alert } from "react-native";

export async function logar(email:string, senha:string){
    try {
        const response = await fetch('http://localhost:3000/loginCliente', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            senha
          }),
        });
  
        const dados = await response.json();
  
        if (response.ok) {
          Alert.alert('Sucesso', 'Login realizado!');
        } else {
          Alert.alert('Erro', dados.message || 'Falha no Login');
        }
      } catch (error) {
        console.error('Erro:', error);
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
}