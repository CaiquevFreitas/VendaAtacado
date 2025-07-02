import API_URL from './api.url';

export interface ProdutoBusca {
    idProduto: number;
    nomeProduto: string;
    imagem: string;
    preco: number;
}

export interface LojaBusca {
    idLoja: number;
    nomeLoja: string;
    logo: string;
}

export interface BuscarProdutosLojasResponse {
    produtos: ProdutoBusca[];
    lojas: LojaBusca[];
}

export const buscarProdutosLojas = async (termo: string): Promise<BuscarProdutosLojasResponse> => {
    const resp = await fetch(`${API_URL}/busca?termo=${encodeURIComponent(termo)}`);
    if (!resp.ok) throw new Error('Erro ao buscar produtos e lojas');
    return await resp.json();
};
