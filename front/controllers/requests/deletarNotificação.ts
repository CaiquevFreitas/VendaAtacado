import API_URL from './api.url';

export const deletarNotificacao = async (idNotificacao: number): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/notificacoes/${idNotificacao}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar notificação');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

export const deletarTodasNotificacoes = async (tipo: 'cliente' | 'loja', id: number): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/notificacoes/todas/${tipo}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar notificações');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};
