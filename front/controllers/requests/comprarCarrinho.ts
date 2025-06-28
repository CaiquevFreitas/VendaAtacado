import API_URL from './api.url';

export interface ItemSelecionado {
    idItemCarrinho: number;
    idProduto: number;
    quantidade: number;
    precoUnitario: number;
}

export interface ProdutoPedido {
    idProduto: number;
    nome: string;
    quantidade: number;
    precoUnitario: number;
}

export interface PedidoCriado {
    idPedido: number;
    idLoja: number;
    total: number;
    status: string;
    produtos: ProdutoPedido[];
}

export interface RespostaCompra {
    success: boolean;
    message: string;
    pedidos?: PedidoCriado[];
    totalPedidos?: number;
    errors?: string[];
}

export const comprarCarrinho = async (
    idCliente: number, 
    itensSelecionados: ItemSelecionado[]
): Promise<RespostaCompra> => {
    try {
        const response = await fetch(`${API_URL}/comprar-carrinho`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idCliente,
                itensSelecionados
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao criar pedidos');
        }

        return data;
    } catch (error) {
        console.error('Erro na requisição de criação de pedidos:', error);
        throw error;
    }
};
