import API_URL from "./api.url";

export interface ProdutoPage {
    idProduto: number;
    nomeProduto: string;
    imagem: string;
    descricao: string;
    preco: number;
    estoque: number;
}

export interface AvaliacaoProduto {
    id: number;
    nomeCliente: string;
    nota: number;
    comentario: string;
}

export interface PageProdutoResponse {
    produto: ProdutoPage;
    avaliacoes: AvaliacaoProduto[];
}

export async function renderPageProduto(idProduto: number): Promise<PageProdutoResponse> {
    const response = await fetch(`${API_URL}/showPageProduto/${idProduto}`);
    if (!response.ok) {
        throw new Error('Erro ao buscar dados do produto');
    }
    return await response.json();
}