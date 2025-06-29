import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { renderPageCategoria, PageCategoriaResponse } from '../../controllers/requests/renderPageCategoria';
import API_URL from '../../controllers/requests/api.url';

const PageCategoria: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { categoria } = route.params;

  const [dados, setDados] = useState<PageCategoriaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await renderPageCategoria(categoria);
        setDados(res);
      } catch (e: any) {
        setErro(e.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoria]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons 
          key={i} 
          name={i <= rating ? "star" : "star-outline"} 
          size={12} 
          color={i <= rating ? "#FFD700" : "#ccc"} 
        />
      );
    }
    return stars;
  };

  const renderProduto = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.produtoCard}
      onPress={() => {
        navigation.navigate('PageProduto', {
          idProduto: item.id
        });
      }}
    >
      <Image source={{ uri: `${API_URL}${item.imagem}` }} style={styles.produtoImagem} />
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoNome} numberOfLines={2}>{item.nome}</Text>
        <Text style={styles.produtoPreco}>R$ {item.preco.toFixed(2)}</Text>
        <View style={styles.lojaInfo}>
          <Image source={{ uri: `${API_URL}${item.logoLoja}` }} style={styles.logoLoja} />
          <Text style={styles.nomeLoja} numberOfLines={1}>{item.nomeLoja}</Text>
        </View>
        {item.totalAvaliacoes > 0 && (
          <View style={styles.avaliacaoContainer}>
            {renderStars(parseFloat(item.notaMedia))}
            <Text style={styles.notaText}>{item.notaMedia}</Text>
            <Text style={styles.avaliacoesText}>({item.totalAvaliacoes})</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#222" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  if (erro || !dados) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ff6b6b" />
        <Text style={styles.errorText}>{erro || 'Erro ao carregar dados'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{dados.categoria}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.totalProdutos}>{dados.total} produtos encontrados</Text>
        </View>

        {dados.produtos.length > 0 ? (
          <FlatList
            data={dados.produtos}
            keyExtractor={item => item.id.toString()}
            renderItem={renderProduto}
            numColumns={2}
            columnWrapperStyle={styles.produtosRow}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.produtosContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="basket-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Não há produtos disponíveis nesta categoria no momento
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PageCategoria;
