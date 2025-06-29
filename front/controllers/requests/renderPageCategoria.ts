import API_URL from './api.url';

export interface ProdutoCategoria {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  estoque: number;
  descricao: string;
  categoria: string;
  nomeLoja: string;
  logoLoja: string;
  notaMedia: string;
  totalAvaliacoes: number;
}

export interface PageCategoriaResponse {
  categoria: string;
  produtos: ProdutoCategoria[];
  total: number;
}

export const renderPageCategoria = async (categoria: string): Promise<PageCategoriaResponse> => {
  try {
    const response = await fetch(`${API_URL}/categoria/${encodeURIComponent(categoria)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar produtos da categoria');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};
