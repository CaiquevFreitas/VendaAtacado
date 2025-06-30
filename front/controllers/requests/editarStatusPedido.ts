import API_URL from './api.url';

export interface EditarStatusRequest {
    idPedido: number;
    novoStatus: string;
}

export interface EditarStatusResponse {
    success: boolean;
    message: string;
    pedido?: {
        idPedido: number;
        statusAnterior: string;
        novoStatus: string;
    };
}

export const editarStatusPedido = async (
    idPedido: number, 
    novoStatus: string
): Promise<EditarStatusResponse> => {
    try {
        const response = await fetch(`${API_URL}/editar-status-pedido`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idPedido,
                novoStatus
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao alterar status do pedido');
        }

        return data;
    } catch (error) {
        console.error('Erro na requisição de edição de status:', error);
        throw error;
    }
};
