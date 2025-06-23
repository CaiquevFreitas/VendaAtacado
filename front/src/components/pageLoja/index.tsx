import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from './style';
import { useRoute, useNavigation } from '@react-navigation/native';


interface Produto {
  id: number;
  nome: string;
  imagem: string;
  preco: number;
  vendidos: number;
  avaliacao: number;
}

interface Avaliacao {
  id: number;
  nomeCliente: string;
  nota: number;
  comentario: string;
}

interface PageLojaProps {
  nome: string;
  logo: string;
  endereco: string;
  seguidores?: string;
  nota?: number;
  produtos: Produto[];
  avaliacoes: Avaliacao[];
  onSeguir?: () => void;
  seguindo?: boolean;
}

const PageLoja: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {
    nome,
    logo,
    endereco,
    seguidores,
    nota,
    produtos,
    avaliacoes,
    onSeguir,
    seguindo
  } = route.params;
  const avaliacoesTyped: Avaliacao[] = avaliacoes;

  return (
    <ScrollView style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={{ position: 'absolute', top: 30, right: 16, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, padding: 6, elevation: 3 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#222" />
      </TouchableOpacity>
      {/* Header Loja */}
      <View style={[styles.header, { paddingTop: 50 }]}> {/* espaço para o botão */}
        <Image source={{ uri: logo }} style={styles.logo} />
        <View style={styles.headerInfo}>
          <Text style={styles.nomeLoja} numberOfLines={1} ellipsizeMode="tail">{nome}</Text>
          <Text style={styles.endereco}>{endereco}</Text>
          <View style={styles.headerRow}>
            {nota !== undefined && (
              <View style={styles.notaContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.notaText}>{nota.toFixed(1)}</Text>
              </View>
            )}
            {seguidores && (
              <Text style={styles.seguidores}>{seguidores} seguidores</Text>
            )}
          </View>
        </View>
        {onSeguir && (
          <TouchableOpacity style={[styles.seguirBtn, seguindo && styles.seguindoBtn]} onPress={onSeguir}>
            <Text style={[styles.seguirBtnText, seguindo && styles.seguindoBtnText]}>{seguindo ? 'Seguindo' : 'Seguir'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Produtos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Produtos</Text>
        <FlatList
          data={produtos}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.produtoCard}>
              <Image source={{ uri: item.imagem }} style={styles.produtoImg} />
              <Text style={styles.produtoNome} numberOfLines={2}>{item.nome}</Text>
              <Text style={styles.produtoPreco}>R${item.preco.toFixed(2)}</Text>
              <View style={styles.produtoInfoRow}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.produtoAvaliacao}>{item.avaliacao.toFixed(1)}</Text>
                <Text style={styles.produtoVendidos}>{item.vendidos} vendidos</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Avaliações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avaliações</Text>
        {avaliacoesTyped.length === 0 ? (
          <Text style={styles.semAvaliacao}>Nenhuma avaliação ainda.</Text>
        ) : (
          avaliacoesTyped.map((av: Avaliacao) => (
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
