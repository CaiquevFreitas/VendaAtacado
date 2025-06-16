import AsyncStorage from '@react-native-async-storage/async-storage';


export const buscarProdutosLoja = async () => {
    try {
        const loja = await AsyncStorage.getItem('lojaData');
        if (loja) {
            const lojaId = JSON.parse(loja).id;
            if (!lojaId) {
                throw new Error('ID da loja não encontrado');
            }
            
            const response = await fetch(`http://localhost:3000/showProduto/${lojaId}`);
            
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
