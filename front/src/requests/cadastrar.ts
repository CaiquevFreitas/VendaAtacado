import { Alert } from "react-native";

export async function cadastrar(nome:string, data:Date, cpf:string, email:string, senha:string){
    try {
        const response = await fetch('http://localhost:3000/cadastroCliente', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome,
            data,
            cpf,
            email,
            senha
          }),
        });
  
        const dados = await response.json();
  
        if (response.ok) {
          Alert.alert('Sucesso', 'Login realizado!');
          console.log('Token ou dados:', data);
        } else {
          Alert.alert('Erro', dados.message || 'Falha no login');
        }
      } catch (error) {
        console.error('Erro:', error);
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
}