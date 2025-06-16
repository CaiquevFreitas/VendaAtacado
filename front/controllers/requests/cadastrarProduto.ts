import { Alert } from "react-native";

export async function cadastrarProduto(formData:FormData){
    const response = await fetch('http://192.168.176.214:3000/cadastrarProduto', {
        method: 'POST',
        body: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    const data = await response.json();
    Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
    if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar produto');
    }
}