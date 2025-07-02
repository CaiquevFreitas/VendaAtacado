import API_URL from './api.url';

export interface AvaliacaoRequest {
    fk_idCliente: number;
    fk_idLoja?: number;
    fk_idProduto?: number;
    nota: number;
    comentario: string;
}

export interface AvaliacaoResponse {
    success: boolean;
    message: string;
}

export const enviarAvaliacao = async (dados: AvaliacaoRequest): Promise<AvaliacaoResponse> => {
    try {
        const response = await fetch(`${API_URL}/avaliacoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao enviar avaliação');
        }
        return data;
    } catch (error) {
        console.error('Erro ao enviar avaliação:', error);
        throw error;
    }
};

