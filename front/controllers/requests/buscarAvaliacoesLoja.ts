import API_URL from './api.url';

export interface AvaliacaoRecebida {
    idAvaliacao: number;
    nota: number;
    comentario: string;
    fk_idCliente: number;
    fk_idProduto?: number;
    fk_idLoja?: number;
    Produto?: { nomeProduto: string };
    Cliente?: { nomeCliente: string };
    createdAt?: string;
}

export interface BuscarAvaliacoesLojaResponse {
    success: boolean;
    avaliacoesLoja: AvaliacaoRecebida[];
    avaliacoesProdutos: AvaliacaoRecebida[];
}

export const buscarAvaliacoesLoja = async (idLoja: number): Promise<BuscarAvaliacoesLojaResponse> => {
    const resp = await fetch(`${API_URL}/avaliacoes/loja/${idLoja}`);
    if (!resp.ok) throw new Error('Erro ao buscar avaliações da loja');
    return await resp.json();
};
