import { Alert } from "react-native";
import API_URL from "./api.url";

export async function cadastrar(nome:string, data:Date, cpf:string, email:string, senha:string, telefone:string){
  const dataFormatada = data ? data.toISOString().split('T')[0] : '';
    try {
        const response = await fetch(`${API_URL}/cadastroCliente`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome,
            dataFormatada,
            cpf,
            email,
            senha,
            telefone
          }),
        });
  
        const dados = await response.json();
  
        if (response.ok) {
          Alert.alert('Sucesso', 'Cadastro realizado!');
          console.log('Token ou dados:', data);
        } else {
          Alert.alert('Erro', dados.message || 'Falha no Cadastro');
        }
      } catch (error) {
        console.error('Erro:', error);
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
}
