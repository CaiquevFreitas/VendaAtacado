import API_URL from './api.url';

export interface AvaliacaoPendente {
    tipo: 'produto' | 'loja';
    idProduto?: number;
    nomeProduto?: string;
    idLoja?: number;
    nomeLoja?: string;
}

export interface BuscarPendentesResponse {
    success: boolean;
    pendentes: AvaliacaoPendente[];
}

export const buscarAvaliacoesPendentes = async (idCliente: number): Promise<BuscarPendentesResponse> => {
    console.log(idCliente)
    const resp = await fetch(`${API_URL}/avaliacoes/pendentes/${idCliente}`);
    if (!resp.ok) throw new Error('Erro ao buscar avaliações pendentes');
    return await resp.json();
};
