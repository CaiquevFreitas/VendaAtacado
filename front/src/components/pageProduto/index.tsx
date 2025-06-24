import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import { useRoute, useNavigation } from '@react-navigation/native';

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
  const { nome, imagem, preco, precoOriginal, vendidos, avaliacoes } = route.params;

  // Funções mock para os botões
  const onComprar = () => {};
  const onAdicionarCarrinho = () => {};

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={{ position: 'absolute', top: 30, left: 16, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, padding: 6, elevation: 3 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#222" />
      </TouchableOpacity>
      <ScrollView style={{ flex: 1 }}>
        {/* Imagem do produto */}
        <Image source={{ uri: imagem }} style={styles.imagemProduto} resizeMode="contain" />

        {/* Nome, preço e vendidos */}
        <View style={styles.infoSection}>
          <Text style={styles.nomeProduto}>{nome}</Text>
          <View style={styles.precoRow}>
            <Text style={styles.preco}>R${preco.toFixed(2)}</Text>
            {precoOriginal && (
              <Text style={styles.precoOriginal}>R${precoOriginal.toFixed(2)}</Text>
            )}
            {precoOriginal && (
              <Text style={styles.desconto}>{`-${Math.round(100 - (preco / precoOriginal) * 100)}%`}</Text>
            )}
          </View>
          <Text style={styles.vendidos}>{vendidos} Vendido(s)</Text>
        </View>

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
                    {item.data && <Text style={styles.dataAvaliacao}>{item.data}</Text>}
                  </View>
                  <Text style={styles.comentario}>{item.comentario}</Text>
                  {item.fotos && item.fotos.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fotosRow}>
                      {item.fotos.map((foto, idx) => (
                        <Image key={idx} source={{ uri: foto }} style={styles.fotoAvaliacao} />
                      ))}
                    </ScrollView>
                  )}
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

