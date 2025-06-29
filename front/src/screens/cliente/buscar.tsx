import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { themes } from "../../../assets/colors/themes";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types';
import { buscarProdutosDestaque, ProdutoDestaque } from '../../../controllers/requests/buscarProdutosDestaque';
import API_URL from '../../../controllers/requests/api.url';

export default function Buscar() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('produtos');
    const [produtosDestaque, setProdutosDestaque] = useState<ProdutoDestaque[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarProdutosDestaque();
    }, []);

    const carregarProdutosDestaque = async () => {
        try {
            setLoading(true);
            const produtos = await buscarProdutosDestaque();
            setProdutosDestaque(produtos);
        } catch (error) {
            console.error('Erro ao carregar produtos em destaque:', error);
            setProdutosDestaque([]);
        } finally {
            setLoading(false);
        }
    };

    const categorias = [
        { nome: 'Frutas', icon: '🍎' },
        { nome: 'Vegetais', icon: '🥬' },
        { nome: 'Doces', icon: '🍰' },
        { nome: 'Almoço', icon: '🍽️' },
        { nome: 'Bebidas', icon: '🥤' },
        { nome: 'Verduras', icon: '🥗' },
        { nome: 'Carnes', icon: '🥩' },
        { nome: 'Limpeza', icon: '🧽' },
        { nome: 'Bolos', icon: '🎂' },
        { nome: 'Salgados', icon: '🥟' }
    ];

    const lojasRecentes = [
        { id: 1, nome: 'Hortifruti Silva', avaliacao: 4.8, distancia: '0.5km', imagem: 'https://via.placeholder.com/60/4CAF50/FFFFFF?text=🏪' },
        { id: 2, nome: 'Mercado Central', avaliacao: 4.5, distancia: '1.2km', imagem: 'https://via.placeholder.com/60/2196F3/FFFFFF?text=🏪' },
        { id: 3, nome: 'Feira do Bairro', avaliacao: 4.9, distancia: '0.8km', imagem: 'https://via.placeholder.com/60/FF9800/FFFFFF?text=🏪' }
    ];

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

    const renderProdutoDestaque = (item: ProdutoDestaque) => (
        <TouchableOpacity 
            key={item.id} 
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
                <View style={styles.produtoAvaliacao}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.produtoNota}>{item.notaMedia}</Text>
                    <Text style={styles.produtoAvaliacoes}>({item.totalAvaliacoes})</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.titulo}>Buscar</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Buscar produtos, lojas..."
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={20} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'produtos' && styles.activeTab]} 
                    onPress={() => setActiveTab('produtos')}
                >
                    <Text style={[styles.tabText, activeTab === 'produtos' && styles.activeTabText]}>
                        Produtos
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'lojas' && styles.activeTab]} 
                    onPress={() => setActiveTab('lojas')}
                >
                    <Text style={[styles.tabText, activeTab === 'lojas' && styles.activeTabText]}>
                        Lojas
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {activeTab === 'produtos' ? (
                    <>
                        {/* Categorias */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Categorias</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll}>
                                {categorias.map((categoria, index) => (
                                    <TouchableOpacity 
                                        key={index} 
                                        style={styles.categoriaItem}
                                        onPress={() => {
                                            navigation.navigate('PageCategoria', {
                                                categoria: categoria.nome
                                            });
                                        }}
                                    >
                                        <Text style={styles.categoriaIcon}>{categoria.icon}</Text>
                                        <Text style={styles.categoriaNome}>{categoria.nome}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Produtos em Destaque */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Produtos em Destaque</Text>
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={themes.colors.primary} />
                                    <Text style={styles.loadingText}>Carregando produtos...</Text>
                                </View>
                            ) : produtosDestaque.length > 0 ? (
                                <View style={styles.produtosGrid}>
                                    {produtosDestaque.map((item) => renderProdutoDestaque(item))}
                                </View>
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="star-outline" size={48} color="#ccc" />
                                    <Text style={styles.emptyText}>Nenhum produto em destaque</Text>
                                    <Text style={styles.emptySubtext}>
                                        Não há produtos com avaliações no momento
                                    </Text>
                                </View>
                            )}
                        </View>
                    </>
                ) : (
                    <>
                        {/* Lojas Recentes */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Lojas Próximas</Text>
                            {lojasRecentes.map((loja) => (
                                <TouchableOpacity key={loja.id} style={styles.lojaCard}>
                                    <Image source={{ uri: loja.imagem }} style={styles.lojaImagem} />
                                    <View style={styles.lojaInfo}>
                                        <Text style={styles.lojaNome}>{loja.nome}</Text>
                                        <View style={styles.lojaAvaliacao}>
                                            {renderStars(loja.avaliacao)}
                                            <Text style={styles.lojaAvaliacaoTexto}>{loja.avaliacao}</Text>
                                        </View>
                                        <Text style={styles.lojaDistancia}>{loja.distancia}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.verLojaButton}>
                                        <Text style={styles.verLojaText}>Ver</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: themes.colors.primary
    },
    titulo: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold'
    },
    filterButton: {
        padding: 8
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: themes.colors.primary
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    searchIcon: {
        marginRight: 10
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333'
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: -10,
        borderRadius: 12,
        padding: 4,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8
    },
    activeTab: {
        backgroundColor: themes.colors.primary
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666'
    },
    activeTabText: {
        color: '#fff'
    },
    content: {
        flex: 1,
        paddingHorizontal: 20
    },
    section: {
        marginTop: 25
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15
    },
    categoriasScroll: {
        marginBottom: 10
    },
    categoriaItem: {
        alignItems: 'center',
        marginRight: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        minWidth: 80,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2
    },
    categoriaIcon: {
        fontSize: 24,
        marginBottom: 8
    },
    categoriaNome: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center'
    },
    produtosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    produtoCard: {
        backgroundColor: '#fff',
        width: '48%',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2
    },
    produtoImagem: {
        width: '100%',
        height: 80,
        borderRadius: 8,
        marginBottom: 8
    },
    produtoInfo: {
        flex: 1
    },
    produtoNome: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4
    },
    produtoPreco: {
        fontSize: 16,
        fontWeight: 'bold',
        color: themes.colors.primary
    },
    produtoAvaliacao: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4
    },
    produtoNota: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5
    },
    produtoAvaliacoes: {
        fontSize: 12,
        color: '#999',
        marginLeft: 5
    },
    lojaCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2
    },
    lojaImagem: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 15
    },
    lojaInfo: {
        flex: 1
    },
    lojaNome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4
    },
    lojaAvaliacao: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    lojaAvaliacaoTexto: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5
    },
    lojaDistancia: {
        fontSize: 12,
        color: '#999'
    },
    verLojaButton: {
        backgroundColor: themes.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20
    },
    verLojaText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666'
    }
});
