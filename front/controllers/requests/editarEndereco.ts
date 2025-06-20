import API_URL from './api.url';

export async function editarEndereco(idEndereco: number, endereco: {
    estado: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    numero: string;
    cep: string;
}) {
    try {
        const response = await fetch(`${API_URL}/editEndereco/${idEndereco}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(endereco),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao editar endereço');
        }
        return data;
    } catch (error: any) {
        throw new Error(error.message || 'Erro ao editar endereço');
    }
}
