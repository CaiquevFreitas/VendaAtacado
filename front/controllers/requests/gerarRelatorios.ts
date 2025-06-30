import API_URL from './api.url';

export interface VendaPeriodo {
  data?: string;
  semana?: string;
  mes?: string;
  totalVendas: number;
  totalPedidos: number;
}

export interface ProdutoVendido {
  nomeProduto: string;
  totalVendido: number;
  totalReceita: number;
}

export interface StatusPedido {
  status: string;
  quantidade: number;
}

export interface HorarioVenda {
  hora: number;
  totalPedidos: number;
  totalVendas: number;
}

export interface ResumoGeral {
  totalPedidos: number;
  totalVendas: number;
  ticketMedio: number;
  clientesUnicos: number;
}

export interface RelatoriosResponse {
  vendasPorPeriodo: VendaPeriodo[];
  produtosMaisVendidos: ProdutoVendido[];
  statusPedidos: StatusPedido[];
  horariosVendas: HorarioVenda[];
  resumoGeral: ResumoGeral;
}

export const gerarRelatorios = async (idLoja: number, periodo: string = 'mes'): Promise<RelatoriosResponse> => {
  try {
    const response = await fetch(`${API_URL}/relatorios/${idLoja}?periodo=${periodo}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar dados dos relatórios');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

