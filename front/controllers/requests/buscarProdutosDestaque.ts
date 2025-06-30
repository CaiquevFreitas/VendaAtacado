import API_URL from './api.url';

export interface ProdutoDestaque {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  estoque: number;
  notaMedia: string;
  totalAvaliacoes: number;
}

export const buscarProdutosDestaque = async (): Promise<ProdutoDestaque[]> => {
  try {
    const response = await fetch(`${API_URL}/produtos-destaque`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar produtos em destaque');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};
