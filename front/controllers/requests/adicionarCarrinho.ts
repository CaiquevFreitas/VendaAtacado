import API_URL from './api.url';

export async function adicionarCarrinho(idCarrinho: number, idProduto: number, quantidade: number, precoUnitario: number) {
  try {
    const response = await fetch(`${API_URL}/adicionarAoCarrinho`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idCarrinho, idProduto, quantidade, precoUnitario })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao adicionar ao carrinho');
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao adicionar ao carrinho');
  }
}
