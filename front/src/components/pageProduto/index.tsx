import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import { useRoute, useNavigation } from '@react-navigation/native';
import { renderPageProduto, PageProdutoResponse } from '../../../controllers/requests/renderPageProduto';
import  API_URL  from '../../../controllers/requests/api.url';


interface Avaliacao {
  id: number;
  nomeCliente: string;
  nota: number;
  comentario: string;
  data?: string;
  fotos?: string[];
}

const PageProduto: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { idProduto } = route.params;

  const [dados, setDados] = useState<PageProdutoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await renderPageProduto(idProduto);
        setDados(res);
      } catch (e: any) {
        setErro(e.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idProduto]);

  // Funções mock para os botões
  const onComprar = () => {};
  const onAdicionarCarrinho = () => {};

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#222" />
        <Text style={{ marginTop: 10 }}>Carregando produto...</Text>
      </View>
    );
  }
  if (erro || !dados) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ color: 'red' }}>{erro || 'Erro ao carregar dados'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#222', fontWeight: 'bold' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { produto, avaliacoes } = dados;

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={{ position: 'absolute', top: 30, left: 16, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, padding: 6, elevation: 3 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#222" />
      </TouchableOpacity>
      <ScrollView style={{ flex: 1 }}>
        {/* Imagem do produto */}
        <Image source={{ uri: `${API_URL}${produto.imagem}` }} style={styles.imagemProduto} resizeMode="contain" />

        {/* Nome, preço e vendidos */}
        <View style={styles.infoSection}>
          <Text style={styles.nomeProduto}>{produto.nomeProduto}</Text>
          <View style={styles.precoRow}>
            <Text style={styles.preco}>R${produto.preco.toFixed(2)}</Text>
          </View>
          <Text style={styles.vendidos}>{produto.estoque} em estoque</Text>
        </View>

        {/* Descrição do produto */}
        {produto.descricao && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.descricao}>{produto.descricao}</Text>
          </View>
        )}

        {/* Avaliações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações do produto</Text>
          {avaliacoes.length === 0 ? (
            <Text style={styles.semAvaliacao}>Nenhuma avaliação ainda.</Text>
          ) : (
            <FlatList
              data={avaliacoes}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.avaliacaoCard}>
                  <View style={styles.avaliacaoHeader}>
                    <Ionicons name="person-circle" size={28} color="#888" />
                    <Text style={styles.avaliadorNome}>{item.nomeCliente}</Text>
                    <Ionicons name="star" size={16} color="#FFD700" style={{ marginLeft: 8 }} />
                    <Text style={styles.notaText}>{item.nota.toFixed(1)}</Text>
                  </View>
                  <Text style={styles.comentario}>{item.comentario}</Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* Barra de ações */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.carrinhoBtn} onPress={onAdicionarCarrinho}>
          <Ionicons name="cart-outline" size={22} color="#fff" />
          <Text style={styles.carrinhoBtnText}>Adicionar ao carrinho</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.comprarBtn} onPress={onComprar}>
          <Text style={styles.comprarBtnText}>Compre agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PageProduto;

