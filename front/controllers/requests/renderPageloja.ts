import API_URL from "./api.url";

export interface ProdutoPageLoja {
    idProduto: number;
    nomeProduto: string;
    imagem: string;
    preco: number;
    estoque: number;
}

export interface AvaliacaoPageLoja {
    id: number;
    nomeCliente: string;
    nota: number;
    comentario: string;
}

export interface LojaPageLoja {
    idLoja: number;
    nomeLoja: string;
    logo: string;
    nota: number;
}

export interface EnderecoPageLoja {
    idEndereco: number;
    estado: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    cep: string;
    numero: string;
}

export interface PageLojaResponse {
    loja: LojaPageLoja;
    endereco: EnderecoPageLoja;
    produtos: ProdutoPageLoja[];
    avaliacoes: AvaliacaoPageLoja[];
}

export async function renderPageloja(idLoja: number): Promise<PageLojaResponse> {
    const response = await fetch(`${API_URL}/showPageLoja/${idLoja}`);
    if (!response.ok) {
        throw new Error('Erro ao buscar dados da loja');
    }
    return await response.json();
}