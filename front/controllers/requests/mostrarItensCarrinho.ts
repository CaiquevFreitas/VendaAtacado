import  API_URL  from './api.url';

export interface ItemCarrinho {
    id: number;
    idProduto: number;
    nome: string;
    imagem: string;
    precoUnitario: number;
    quantidade: number;
    selecionado: boolean;
}

export interface ItensCarrinhoResponse {
    message: string;
    itens: ItemCarrinho[];
}

export const mostrarItensCarrinho = async (idCliente: number): Promise<ItensCarrinhoResponse> => {
    try {
        const response = await fetch(`${API_URL}/itensCarrinho/${idCliente}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data: ItensCarrinhoResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar itens do carrinho:', error);
        throw error;
    }
};
