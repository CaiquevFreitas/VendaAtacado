import { Alert } from "react-native";
import API_URL from "./api.url";

export async function deletarProduto(id: number) {
    try {
        const response = await fetch(`${API_URL}/deletarProduto/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao deletar produto');
        }

        Alert.alert('Sucesso', 'Produto deletado com sucesso!');
        return data;
    } catch (error: any) {
        Alert.alert('Erro', error.message || 'Não foi possível deletar o produto');
        throw error;
    }
}

