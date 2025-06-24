import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from './style';
import { useRoute, useNavigation } from '@react-navigation/native';
import { renderPageloja, PageLojaResponse } from '../../../controllers/requests/renderPageloja';  
import API_URL from '../../../controllers/requests/api.url';  

const PageLoja: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { idLoja } = route.params;

  const [dados, setDados] = useState<PageLojaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await renderPageloja(idLoja);
        setDados(res);
      } catch (e: any) {
        setErro(e.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idLoja]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#222" />
        <Text style={{ marginTop: 10 }}>Carregando loja...</Text>
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

  const { loja, endereco, produtos, avaliacoes } = dados;

  return (
    <ScrollView style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={{ position: 'absolute', top: 30, right: 16, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, padding: 6, elevation: 3 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#222" />
      </TouchableOpacity>
      {/* Header Loja */}
      <View style={[styles.header, { paddingTop: 50 }]}> {/* espaço para o botão */}
        <Image source={{ uri: `${API_URL}${loja.logo}` }} style={styles.logo} />
        <View style={styles.headerInfo}>
          <Text style={styles.nomeLoja} numberOfLines={1} ellipsizeMode="tail">{loja.nomeLoja}</Text>
          <Text style={styles.endereco}>
            {endereco
              ? `${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`
              : 'Endereço não cadastrado'}
          </Text>
          <View style={styles.headerRow}>
            {loja.nota !== undefined && (
              <View style={styles.notaContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.notaText}>{loja.nota != null ? loja.nota.toFixed(1) : 'N/A'}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Produtos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Produtos</Text>
        <FlatList
          data={produtos}
          keyExtractor={item => item.idProduto.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.produtoCard}>
              <Image source={{ uri: `${API_URL}${item.imagem}` }} style={styles.produtoImg} />
              <Text style={styles.produtoNome} numberOfLines={2}>{item.nomeProduto}</Text>
              <Text style={styles.produtoPreco}>R${item.preco.toFixed(2)}</Text>
            </View>
          )}
        />
      </View>

      {/* Avaliações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avaliações da Loja</Text>
        {avaliacoes.length === 0 ? (
          <Text style={styles.semAvaliacao}>Nenhuma avaliação ainda.</Text>
        ) : (
          avaliacoes.map((av) => (
            <View key={av.id} style={styles.avaliacaoCard}>
              <View style={styles.avaliacaoHeader}>
                <Ionicons name="person-circle" size={28} color="#888" />
                <Text style={styles.avaliadorNome}>{av.nomeCliente}</Text>
                <View style={styles.avaliacaoNotaRow}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.notaText}>{av.nota.toFixed(1)}</Text>
                </View>
              </View>
              <Text style={styles.comentario}>{av.comentario}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default PageLoja;
