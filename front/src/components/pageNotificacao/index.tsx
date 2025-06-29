import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarNotificacoesCliente, buscarNotificacoesLoja, NotificacaoResponse } from '../../../controllers/requests/buscarNotificacoes';
import { deletarNotificacao, deletarTodasNotificacoes } from '../../../controllers/requests/deletarNotificação';
import styles from './style';

interface PageNotificacaoProps {
  userType: 'cliente' | 'loja';
}

const PageNotificacao: React.FC<PageNotificacaoProps> = ({ userType }) => {
  const navigation = useNavigation();
  const [notificacoes, setNotificacoes] = useState<NotificacaoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletando, setDeletando] = useState<number | null>(null);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  const carregarNotificacoes = async () => {
    try {
      setLoading(true);
      
      // Buscar dados do usuário logado
      const userDataKey = userType === 'cliente' ? 'clienteData' : 'lojaData';
      const userDataString = await AsyncStorage.getItem(userDataKey);
      
      if (!userDataString) {
        throw new Error('Usuário não encontrado');
      }

      const userData = JSON.parse(userDataString);
      const userId = userData.id;

      // Buscar notificações do backend
      let notificacoesData: NotificacaoResponse[];
      if (userType === 'cliente') {
        notificacoesData = await buscarNotificacoesCliente(userId);
      } else {
        notificacoesData = await buscarNotificacoesLoja(userId);
      }

      setNotificacoes(notificacoesData);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setNotificacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarNotificacoes();
    setRefreshing(false);
  };

  const deletarNotificacaoIndividual = async (idNotificacao: number) => {
    Alert.alert(
      'Deletar Notificação',
      'Tem certeza que deseja deletar esta notificação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletando(idNotificacao);
              await deletarNotificacao(idNotificacao);
              
              // Remover da lista local
              setNotificacoes(prev => prev.filter(n => n.idNotificacao !== idNotificacao));
              
              Alert.alert('Sucesso', 'Notificação deletada com sucesso!');
            } catch (error) {
              console.error('Erro ao deletar notificação:', error);
              Alert.alert('Erro', 'Não foi possível deletar a notificação');
            } finally {
              setDeletando(null);
            }
          }
        }
      ]
    );
  };

  const limparTodasNotificacoes = async () => {
    if (notificacoes.length === 0) {
      Alert.alert('Aviso', 'Não há notificações para deletar');
      return;
    }

    Alert.alert(
      'Deletar Todas as Notificações',
      `Tem certeza que deseja deletar todas as ${notificacoes.length} notificação(ões)?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar Todas',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              
              // Buscar dados do usuário logado
              const userDataKey = userType === 'cliente' ? 'clienteData' : 'lojaData';
              const userDataString = await AsyncStorage.getItem(userDataKey);
              
              if (!userDataString) {
                throw new Error('Usuário não encontrado');
              }

              const userData = JSON.parse(userDataString);
              const userId = userData.id;

              await deletarTodasNotificacoes(userType, userId);
              
              // Limpar lista local
              setNotificacoes([]);
              
              Alert.alert('Sucesso', 'Todas as notificações foram deletadas!');
            } catch (error) {
              console.error('Erro ao deletar notificações:', error);
              Alert.alert('Erro', 'Não foi possível deletar as notificações');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const getIconeTipo = (tipo: string) => {
    switch (tipo) {
      case 'Pedido':
        return <MaterialIcons name="shopping-cart" size={24} color="#4CAF50" />;
      case 'Avaliação':
        return <Ionicons name="star" size={24} color="#FFD700" />;
      case 'Promoção':
        return <MaterialIcons name="local-offer" size={24} color="#FF5722" />;
      case 'Sistema':
        return <Ionicons name="settings" size={24} color="#2196F3" />;
      default:
        return <Ionicons name="notifications" size={24} color="#666" />;
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias === 0) {
      return 'Hoje';
    } else if (diffDias === 1) {
      return 'Ontem';
    } else if (diffDias < 7) {
      return `${diffDias} dias atrás`;
    } else {
      return data.toLocaleDateString('pt-BR');
    }
  };

  const renderNotificacao = ({ item }: { item: NotificacaoResponse }) => (
    <View style={styles.notificacaoItem}>
      <View style={styles.notificacaoIcone}>
        {getIconeTipo(item.tipo)}
      </View>
      <View style={styles.notificacaoConteudo}>
        <Text style={styles.notificacaoTitulo}>
          {item.titulo}
        </Text>
        <Text style={styles.notificacaoMensagem}>
          {item.descricao}
        </Text>
        <Text style={styles.notificacaoData}>
          {formatarData(item.dataNotificacao)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deletarNotificacaoIndividual(item.idNotificacao)}
        disabled={deletando === item.idNotificacao}
      >
        {deletando === item.idNotificacao ? (
          <ActivityIndicator size="small" color="#FF5722" />
        ) : (
          <Ionicons name="trash-outline" size={20} color="#FF5722" />
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#222" />
        <Text style={styles.loadingText}>Carregando notificações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={limparTodasNotificacoes}
          disabled={notificacoes.length === 0}
        >
          <Text style={[
            styles.clearButtonText,
            notificacoes.length === 0 && styles.clearButtonTextDisabled
          ]}>
            Limpar
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.idNotificacao.toString()}
        renderItem={renderNotificacao}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma notificação</Text>
            <Text style={styles.emptySubtext}>
              Você não tem notificações no momento
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default PageNotificacao;
