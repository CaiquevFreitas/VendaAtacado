import { Alert } from "react-native";
import API_URL from "./api.url";

export async function cadastrarProduto(formData:FormData){
    const response = await fetch(`${API_URL}/cadastrarProduto`, {
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