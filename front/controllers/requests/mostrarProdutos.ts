import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from "./api.url";

export const buscarProdutosLoja = async () => {
    try {
        const loja = await AsyncStorage.getItem('lojaData');
        if (loja) {
            const lojaId = JSON.parse(loja).id;
            if (!lojaId) {
                throw new Error('ID da loja não encontrado');
            }
            
            const response = await fetch(`${API_URL}/showProduto/${lojaId}`);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos');
            }
    
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
};
