import { Alert } from "react-native";
import API_URL from "./api.url";

export type Loja = {
    id: number;
    nomeLoja: string;
    nomeVendedor: string;
    logo: string | null;
    nota: number;
};

export async function mostrarLojas(): Promise<Loja[]> {
    try {
        const response = await fetch(`${API_URL}/showLojas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const dados = await response.json();

        if (response.ok) {
            return dados.lojas;
        } else {
            Alert.alert('Erro', dados.message || 'Falha ao carregar lojas');
            return [];
        }
    } catch (error) {
        console.error('Erro:', error);
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
        return [];
    }
}
