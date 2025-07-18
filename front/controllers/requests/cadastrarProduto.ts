import { Alert } from "react-native";
import API_URL from "./api.url";

export async function cadastrarProduto(formData:FormData){
    const response = await fetch(`${API_URL}/cadastrarProduto`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar produto');
    }
    Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
}