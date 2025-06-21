import API_URL from './api.url';
export async function cadastrarEndereco(endereco: {
    estado: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    numero: string;
    cep: string;
    fk_idLoja: number;
}) {
    try {
        const response = await fetch(`${API_URL}/cadastrarEndereco`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(endereco),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao cadastrar endereço');
        }
        return data;
    } catch (error: any) {
        throw new Error(error.message || 'Erro ao cadastrar endereço');
    }
}
