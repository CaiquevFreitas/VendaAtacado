import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import { useRoute, useNavigation } from '@react-navigation/native';
import { renderPageProduto, PageProdutoResponse } from '../../../controllers/requests/renderPageProduto';
import API_URL from '../../../controllers/requests/api.url';
import ModalAddCarrinho from '../modalAddCarrinho';
import { comprarCarrinho, ItemSelecionado } from '../../../controllers/requests/comprarCarrinho';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [comprandoAgora, setComprandoAgora] = useState(false);
  const [modalTipo, setModalTipo] = useState<'carrinho' | 'comprar'>('carrinho');
  const [quantidadeComprar, setQuantidadeComprar] = useState(1);

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

  const onAdicionarCarrinho = () => {
    setModalTipo('carrinho');
    setModalVisible(true);
  };

  const onComprar = () => {
    setModalTipo('comprar');
    setModalVisible(true);
  };

  const handleConfirmarModal = async (quantidade: number) => {
    if (modalTipo === 'carrinho') {
      setModalVisible(false);
      return; // ModalAddCarrinho já faz a adição ao carrinho
    }
    // Comprar agora
    setComprandoAgora(true);
    try {
      // Buscar idCliente e idItemCarrinho fake (pois não está no carrinho)
      const clienteDataStr = await AsyncStorage.getItem('clienteData');
      if (!clienteDataStr) throw new Error('Cliente não logado');
      const clienteData = JSON.parse(clienteDataStr);
      const idCliente = clienteData.id;
      // Montar item para compra
      const itensParaEnvio: ItemSelecionado[] = [{
        idItemCarrinho: 0, // 0 pois não está no carrinho
        idProduto: produto.idProduto,
        quantidade,
        precoUnitario: produto.preco
      }];
      const resposta = await comprarCarrinho(idCliente, itensParaEnvio);
      if (resposta.success) {
        Alert.alert(
          'Compra realizada!',
          `Seu pedido foi criado com sucesso! Total: R$ ${(produto.preco * quantidade).toFixed(2)}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setModalVisible(false);
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        Alert.alert('Erro', resposta.message || 'Erro ao processar a compra');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao processar a compra');
    } finally {
      setComprandoAgora(false);
    }
  };

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

  // Criar dados para o FlatList principal
  const mainData = [
    { type: 'header', data: produto },
    { type: 'description', data: produto },
    { type: 'reviews', data: avaliacoes }
  ];

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return (
          <View>
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
          </View>
        );
      
      case 'description':
        return produto.descricao ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.descricao}>{produto.descricao}</Text>
          </View>
        ) : null;
      
      case 'reviews':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avaliações do produto</Text>
            {avaliacoes.length === 0 ? (
              <Text style={styles.semAvaliacao}>Nenhuma avaliação ainda.</Text>
            ) : (
              avaliacoes.map((av) => (
                <View key={av.id} style={styles.avaliacaoCard}>
                  <View style={styles.avaliacaoHeader}>
                    <Ionicons name="person-circle" size={28} color="#888" />
                    <Text style={styles.avaliadorNome}>{av.nomeCliente}</Text>
                    <Ionicons name="star" size={16} color="#FFD700" style={{ marginLeft: 8 }} />
                    <Text style={styles.notaText}>{av.nota.toFixed(1)}</Text>
                  </View>
                  <Text style={styles.comentario}>{av.comentario}</Text>
                </View>
              ))
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={{ position: 'absolute', top: 30, left: 16, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, padding: 6, elevation: 3 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#222" />
      </TouchableOpacity>
      
      <FlatList
        data={mainData}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

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
      <ModalAddCarrinho
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        idProduto={idProduto}
        produto={{
          nome: produto.nomeProduto,
          imagem: `${API_URL}${produto.imagem}`,
          preco: produto.preco,
          estoque: produto.estoque
        }}
        onConfirmar={modalTipo === 'comprar' ? handleConfirmarModal : undefined}
      />
    </View>
  );
};

export default PageProduto;

