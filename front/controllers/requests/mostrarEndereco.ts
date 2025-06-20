import API_URL from './api.url';

export async function mostrarEndereco(fk_idLoja: number) {
    try {
        const response = await fetch(`${API_URL}/endereco/${fk_idLoja}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao buscar endereço');
        }
        return data.endereco;
    } catch (error: any) {
        throw new Error(error.message || 'Erro ao buscar endereço');
    }
} 