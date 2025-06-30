import API_URL from './api.url';

export interface NotificacaoResponse {
  idNotificacao: number;
  titulo: string;
  descricao: string;
  tipo: 'Avaliação' | 'Promoção' | 'Pedido' | 'Sistema';
  dataNotificacao: string;
  fk_idCliente?: number;
  fk_idLoja?: number;
}

export const buscarNotificacoesCliente = async (idCliente: number): Promise<NotificacaoResponse[]> => {
  try {
    const response = await fetch(`${API_URL}/notificacoes/cliente/${idCliente}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar notificações');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

export const buscarNotificacoesLoja = async (idLoja: number): Promise<NotificacaoResponse[]> => {
  try {
    const response = await fetch(`${API_URL}/notificacoes/loja/${idLoja}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar notificações');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}; 