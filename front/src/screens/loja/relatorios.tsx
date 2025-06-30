import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { gerarRelatorios, RelatoriosResponse, VendaPeriodo, ProdutoVendido, StatusPedido, HorarioVenda } from '../../../controllers/requests/gerarRelatorios';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const screenWidth = Dimensions.get('window').width;

export default function Relatorios() {
  const [dados, setDados] = useState<RelatoriosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'vendas', title: 'Vendas por Período' },
    { key: 'produtos', title: 'Mais Vendidos' },
    { key: 'status', title: 'Status Pedidos' },
    { key: 'horarios', title: 'Horários' },
  ]);

  useEffect(() => {
    async function fetchRelatorios() {
      setLoading(true);
      setErro(null);
      try {
        const lojaDataString = await AsyncStorage.getItem('lojaData');
        if (!lojaDataString) throw new Error('Loja não encontrada');
        const lojaData = JSON.parse(lojaDataString);
        const idLoja = lojaData.id;
        console.log('Buscando relatórios para loja:', idLoja);
        const response = await gerarRelatorios(idLoja, 'mes');
        console.log('Dados recebidos:', response);
        setDados(response);
      } catch (e: any) {
        console.error('Erro ao buscar relatórios:', e);
        setErro(e.message || 'Erro ao buscar relatórios');
      } finally {
        setLoading(false);
      }
    }
    fetchRelatorios();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando relatórios...</Text>
      </View>
    );
  }
  if (erro) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Erro: {erro}</Text>
      </View>
    );
  }
  if (!dados) {
    return (
      <View style={styles.center}>
        <Text>Nenhum dado encontrado.</Text>
      </View>
    );
  }

  try {
    // Verificar se os dados são válidos
    const vendasPorPeriodo = Array.isArray(dados.vendasPorPeriodo) ? dados.vendasPorPeriodo : [];
    const produtosMaisVendidos = Array.isArray(dados.produtosMaisVendidos) ? dados.produtosMaisVendidos : [];
    const statusPedidos = Array.isArray(dados.statusPedidos) ? dados.statusPedidos : [];
    const horariosVendas = Array.isArray(dados.horariosVendas) ? dados.horariosVendas : [];

    // Preparar dados para o gráfico de linha (vendas por período)
    const mesesSiglas = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const vendasChartData = {
      labels: vendasPorPeriodo.slice(0, 6).map((v: VendaPeriodo) => {
        if (v.mes) {
          // v.mes está no formato 'YYYY-MM'
          const mesNum = parseInt(v.mes.split('-')[1], 10);
          return mesesSiglas[mesNum - 1] || v.mes;
        }
        if (v.semana) return `Sem ${v.semana.slice(-2)}`;
        if (v.data) return v.data.slice(-5);
        return '';
      }),
      datasets: [{
        data: vendasPorPeriodo.slice(0, 6).map((v: VendaPeriodo) => Number(v.totalVendas) || 0)
      }]
    };

    // Preparar dados para o gráfico de barras (produtos mais vendidos)
    const produtosChartData = {
      labels: produtosMaisVendidos.slice(0, 5).map((p: ProdutoVendido) => 
        p.nomeProduto && p.nomeProduto.length > 15 ? p.nomeProduto.slice(0, 15) + '...' : p.nomeProduto || 'Produto'
      ),
      datasets: [{
        data: produtosMaisVendidos.slice(0, 5).map((p: ProdutoVendido) => Number(p.totalVendido) || 0)
      }]
    };

    // Preparar dados para o gráfico de pizza (status dos pedidos)
    const statusChartData = statusPedidos.map((s: StatusPedido, index: number) => ({
      name: s.status || 'Desconhecido',
      population: Number(s.quantidade) || 0,
      color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index % 5],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));

    // Preparar dados para o gráfico de barras (horários)
    const horariosChartData = {
      labels: horariosVendas.map((h: HorarioVenda) => `${h.hora || 0}h`),
      datasets: [{
        data: horariosVendas.map((h: HorarioVenda) => Number(h.totalVendas) || 0)
      }]
    };

    // Scenes para cada tab
    const VendasRoute = () => (
      vendasPorPeriodo.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.titulo}>Vendas por Período</Text>
          <LineChart
            data={vendasChartData}
            width={screenWidth - 64}
            height={220}
            yAxisLabel="R$ "
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              style: { borderRadius: 16 }
            }}
            bezier
            style={styles.chart}
          />
        </View>
      ) : <Text style={styles.semDados}>Sem dados para o período.</Text>
    );
    const ProdutosRoute = () => (
      produtosMaisVendidos.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.titulo}>Produtos Mais Vendidos</Text>
          <BarChart
            data={produtosChartData}
            width={screenWidth - 64}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
              style: { borderRadius: 16 }
            }}
            style={styles.chart}
            verticalLabelRotation={30}
          />
        </View>
      ) : <Text style={styles.semDados}>Sem dados de produtos vendidos.</Text>
    );
    const StatusRoute = () => (
      statusPedidos.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.titulo}>Status dos Pedidos</Text>
          <PieChart
            data={statusChartData}
            width={screenWidth - 64}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </View>
      ) : <Text style={styles.semDados}>Sem dados de status de pedidos.</Text>
    );
    const HorariosRoute = () => (
      horariosVendas.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.titulo}>Horários com Mais Vendas</Text>
          <BarChart
            data={horariosChartData}
            width={screenWidth - 64}
            height={220}
            yAxisLabel="R$ "
            yAxisSuffix=""
            xLabelsOffset={-10}
            fromZero
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
              style: { borderRadius: 16 },
              labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            }}
            style={styles.chart}
            verticalLabelRotation={0}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ fontSize: 12, color: '#666' }}>Horário (h)</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>Receita (R$)</Text>
          </View>
        </View>
      ) : <Text style={styles.semDados}>Sem dados de horários de vendas.</Text>
    );

    const renderScene = SceneMap({
      vendas: VendasRoute,
      produtos: ProdutosRoute,
      status: StatusRoute,
      horarios: HorariosRoute,
    });

    return (
      <View style={{ flex: 1 }}>
        {/* Resumo Geral */}
        <View style={styles.card}>
          <Text style={styles.titulo}>Resumo Geral</Text>
          <View style={styles.resumoGrid}>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoValor}>{dados.resumoGeral?.totalPedidos || 0}</Text>
              <Text style={styles.resumoLabel}>Pedidos</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoValor}>R$ {(dados.resumoGeral?.totalVendas || 0).toFixed(2)}</Text>
              <Text style={styles.resumoLabel}>Vendas</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoValor}>R$ {(dados.resumoGeral?.ticketMedio || 0).toFixed(2)}</Text>
              <Text style={styles.resumoLabel}>Ticket Médio</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoValor}>{dados.resumoGeral?.clientesUnicos || 0}</Text>
              <Text style={styles.resumoLabel}>Clientes</Text>
            </View>
          </View>
        </View>
        {/* Tabs dos gráficos */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: screenWidth }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: '#007bff' }}
              style={{ backgroundColor: '#fff' }}
              activeColor="#007bff"
              inactiveColor="#6c757d"
            />
          )}
          style={{ flex: 1 }}
        />
      </View>
    );
  } catch (error: any) {
    console.error('Erro ao renderizar relatórios:', error);
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Erro ao renderizar relatórios</Text>
        <Text style={{ color: 'red', fontSize: 12 }}>{error.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  resumoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resumoItem: {
    width: '48%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  resumoValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  resumoLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  semDados: {
    textAlign: 'center',
    color: '#666',
    margin: 24,
    fontSize: 16,
  },
});
