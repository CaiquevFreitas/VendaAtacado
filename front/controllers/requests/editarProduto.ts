import API_URL from "./api.url";
import { Alert } from "react-native";


export async function editarProduto(idProduto: number, formData: FormData) {
    const response = await fetch(`${API_URL}/editProduto/${idProduto}`, {
        method: 'PUT',
        body: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Erro ao editar produto');
    }
    Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
    return data;
}
