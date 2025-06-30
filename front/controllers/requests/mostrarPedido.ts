import API_URL from './api.url';

export interface ProdutoPedido {
    idProduto: number;
    nome: string;
    imagem: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
}

export interface ClientePedido {
    idCliente: number;
    nome: string;
    telefone: string;
}

export interface Pedido {
    idPedido: number;
    total: number;
    status: string;
    dataPedido: string;
    cliente: ClientePedido;
    produtos: ProdutoPedido[];
}

export interface PedidosResponse {
    message: string;
    pedidos: Pedido[];
}

export const mostrarPedidosLoja = async (
    idLoja: number, 
    status?: string
): Promise<PedidosResponse> => {
    try {
        let url = `${API_URL}/pedidos-loja/${idLoja}`;
        if (status && status !== 'todos') {
            url += `?status=${status}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data: PedidosResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar pedidos da loja:', error);
        throw error;
    }
};
