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
import { buscarProdutosLojas, ProdutoBusca, LojaBusca } from '../../../controllers/requests/buscarProdutosLojas';

export default function Buscar() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [searchText, setSearchText] = useState('');
    const [produtosDestaque, setProdutosDestaque] = useState<ProdutoDestaque[]>([]);
    const [loading, setLoading] = useState(true);
    const [resultadosProdutos, setResultadosProdutos] = useState<ProdutoBusca[]>([]);
    const [resultadosLojas, setResultadosLojas] = useState<LojaBusca[]>([]);
    const [buscando, setBuscando] = useState(false);
    const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

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

    const handleBusca = (texto: string) => {
        setSearchText(texto);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        if (!texto.trim()) {
            setResultadosProdutos([]);
            setResultadosLojas([]);
            setBuscando(false);
            return;
        }
        setBuscando(true);
        debounceTimeout.current = setTimeout(async () => {
            try {
                const resp = await buscarProdutosLojas(texto);
                setResultadosProdutos(resp.produtos);
                setResultadosLojas(resp.lojas);
            } catch (e) {
                setResultadosProdutos([]);
                setResultadosLojas([]);
            }
            setBuscando(false);
        }, 300);
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

    const renderProdutoBusca = (item: ProdutoBusca) => (
        <TouchableOpacity 
            key={item.idProduto} 
            style={styles.produtoCard}
            onPress={() => {
                navigation.navigate('PageProduto', {
                    idProduto: item.idProduto
                });
            }}
        >
            <Image source={{ uri: `${API_URL}${item.imagem}` }} style={styles.produtoImagem} />
            <View style={styles.produtoInfo}>
                <Text style={styles.produtoNome} numberOfLines={2}>{item.nomeProduto}</Text>
                <Text style={styles.produtoPreco}>R$ {item.preco.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.titulo}>Buscar</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Procure por produtos e lojas..."
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={handleBusca}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={20} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Resultados de busca inteligentes */}
            {(searchText.length > 0 && (resultadosProdutos.length > 0 || resultadosLojas.length > 0 || buscando)) && (
                <View style={styles.resultadosDropdown}>
                    {buscando && (
                        <View style={{ alignItems: 'center', padding: 12 }}>
                            <ActivityIndicator size="small" color={themes.colors.primary} />
                        </View>
                    )}
                    {resultadosProdutos.length > 0 && (
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.resultadosTitulo}>Produtos</Text>
                            <View style={styles.produtosGrid}>
                                {resultadosProdutos.map(renderProdutoBusca)}
                            </View>
                        </View>
                    )}
                    {resultadosLojas.length > 0 && (
                        <View>
                            <Text style={styles.resultadosTitulo}>Lojas</Text>
                            <View style={styles.lojasContainer}>
                                {resultadosLojas.map(loja => (
                                    <TouchableOpacity key={loja.idLoja} style={styles.lojaCard} onPress={() => {
                                        navigation.navigate('PageLoja', { idLoja: loja.idLoja });
                                    }}>
                                        <Image 
                                            source={{ uri: loja.logo ? `${API_URL}${loja.logo}` : 'https://via.placeholder.com/80/4CAF50/FFFFFF?text=🏪' }} 
                                            style={styles.lojaLogo} 
                                        />
                                        <View style={styles.lojaInfo}>
                                            <Text style={styles.lojaNome} numberOfLines={1}>{loja.nomeLoja}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.verLojaButton}>
                                            <Ionicons name="arrow-forward" size={20} color={themes.colors.primary} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                    {!buscando && resultadosProdutos.length === 0 && resultadosLojas.length === 0 && (
                        <Text style={{ color: '#888', textAlign: 'center', padding: 12 }}>Nenhum resultado encontrado</Text>
                    )}
                </View>
            )}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                            {produtosDestaque.map(renderProdutoDestaque)}
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
    },
    resultadosDropdown: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        marginHorizontal: 0,
        marginTop: 5,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 10
    },
    resultadosTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8
    },
    lojasContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    lojaCard: {
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
    lojaLogo: {
        width: '100%',
        height: 80,
        borderRadius: 8,
        marginBottom: 8
    },
    lojaInfo: {
        flex: 1
    },
    lojaNome: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4
    },
    verLojaButton: {
        alignItems: 'flex-end'
    }
});
