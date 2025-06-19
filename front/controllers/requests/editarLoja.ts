import { Alert } from "react-native";
import API_URL from "./api.url";

interface EditarLojaParams {
    id: string;
    campos: {
        nome?: string;
        horarioAbertura?: Date;
        horarioFechamento?: Date;
        telefone?: string;
        senha?: string;
    };
}

export async function editarLoja(params: EditarLojaParams) {
    try {
        const response = await fetch(`${API_URL}/editLoja/${params.id}`, {
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