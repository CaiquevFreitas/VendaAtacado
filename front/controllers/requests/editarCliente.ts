import { Alert } from "react-native";
import API_URL from "./api.url";

interface EditarClienteParams {
    id: string;
    campos: {
        email?: string;
        telefone?: string;
        senha?: string;
    };
}

export async function editarCliente(params: EditarClienteParams) {
    try {
        const response = await fetch(`${API_URL}/editCliente/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params.campos)
        });

        const dados = await response.json();

        if (response.ok) {
            Alert.alert('Sucesso', dados.message || 'Informações atualizadas com sucesso!');
            return dados;
        } else {
            Alert.alert('Erro', dados.error || 'Falha ao atualizar as informações');
            throw new Error(dados.error);
        }
    } catch (error) {
        console.error('Erro:', error);
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
        throw error;
    }
}
