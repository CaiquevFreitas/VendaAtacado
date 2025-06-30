import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    Image,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themes } from '../../../assets/colors/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types';
import ModalProduto from '../../components/modal';
import { buscarProdutosLoja } from '../../../controllers/requests/mostrarProdutos';
import { deletarProduto } from '../../../controllers/requests/deletarProduto';

import API_URL from '../../../controllers/requests/api.url';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Produto = {
    id: number;
    nome: string;
    valor: number;
    estoque: number;
    imagem: string;
    fk_idLoja: number;
    categoria: string;
    descricao?: string;
    status?: boolean;
};

export default function Estoque() {
    const navigation = useNavigation<NavigationProp>();
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

    useEffect(() => {
        carregarProdutos();
    }, []);

    
    useEffect(() => {
        console.log('Estado produtos atualizado:', produtos);
    }, [produtos]);

    const carregarProdutos = async () => {
        try {
            const produtosData = await buscarProdutosLoja();
            
            if (Array.isArray(produtosData)) {
                const produtosFormatados = produtosData.map(produto => ({
                    id: produto.idProduto,
                    nome: produto.nomeProduto || '',
                    valor: produto.preco || 0,
                    estoque: produto.estoque || 0,
                    imagem: produto.imagem || '',
                    fk_idLoja: produto.fk_idLoja || produto.idLoja,
                    categoria: produto.categoria || '',
                    descricao: produto.descricao || '',
                    status: produto.status
                }));
                
                setProdutos(prevProdutos => {
                    return produtosFormatados;
                });
            } else {
                setProdutos(prevProdutos => []);
            }
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            Alert.alert('Erro', 'Não foi possível carregar os produtos');
            setProdutos(prevProdutos => []);
        }
    };

    const handleExcluirProduto = async (id: number) => {
        Alert.alert(
            'Confirmar exclusão',
            'Tem certeza que deseja excluir este produto?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletarProduto(id);
                            carregarProdutos(); 
                        } catch (error) {
                            console.error('Erro ao excluir produto:', error);
                        }
                    }
                }
            ]
        );
    };

    const handleAbrirModal = (produto?: Produto) => {
        setProdutoSelecionado(produto || null);
        setModalVisible(true);
    };

    const handleFecharModal = () => {
        setProdutoSelecionado(null);
        setModalVisible(false);
    };

    const formatarPreco = (valor: number | undefined | null) => {
        if (valor === undefined || valor === null) {
            return 'R$ 0,00';
        }
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={() => handleAbrirModal()}
                >
                    <Ionicons name="add-circle-outline" size={24} color={themes.colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Estoque</Text>
                <TouchableOpacity 
                    style={styles.headerButton}
                >
                    <Ionicons name="filter-outline" size={24} color={themes.colors.white} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {produtos.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
                    </View>
                ) : (
                    produtos.map((produto) => (
                        <View 
                            key={`produto-${produto.id}`} 
                            style={styles.produtoCard}
                        >
                            <Image 
                                source={{ uri: `${API_URL}${produto.imagem}` }} 
                                style={styles.produtoImagem}
                            />
                            <View style={styles.produtoInfo}>
                                <Text style={styles.produtoNome}>{produto.nome}</Text>
                                <Text style={styles.produtoPreco}>{formatarPreco(produto.valor)}</Text>
                                <Text style={styles.produtoQuantidade}>
                                    Quantidade: {produto.estoque}
                                </Text>
                                {produto.status !== undefined && (
                                    <View style={styles.statusContainer}>
                                        <View style={[
                                            styles.statusIndicator,
                                            produto.status ? styles.statusActive : styles.statusInactive
                                        ]} />
                                        <Text style={[
                                            styles.statusText,
                                            produto.status ? styles.statusActiveText : styles.statusInactiveText
                                        ]}>
                                            {produto.status ? 'Ativo' : 'Inativo'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.produtoAcoes}>
                                <TouchableOpacity 
                                    style={[styles.actionButton, styles.editButton]}
                                    onPress={() => handleAbrirModal(produto)}
                                >
                                    <Ionicons name="pencil" size={20} color={themes.colors.white} />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.actionButton, styles.deleteButton]}
                                    onPress={() => handleExcluirProduto(produto.id)}
                                >
                                    <Ionicons name="trash" size={20} color={themes.colors.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <ModalProduto
                visible={modalVisible}
                onSuccess={() => {
                    setModalVisible(false);
                    carregarProdutos();
                }}
                onClose={handleFecharModal}
                produtoParaEditar={produtoSelecionado}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: themes.colors.primary,
        padding: 20,
        paddingTop: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: themes.colors.white,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: themes.colors.secondary,
    },
    produtoCard: {
        backgroundColor: themes.colors.white,
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
    },
    produtoImagem: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    produtoInfo: {
        flex: 1,
        marginLeft: 15,
    },
    produtoNome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: themes.colors.black,
        marginBottom: 5,
    },
    produtoPreco: {
        fontSize: 16,
        color: themes.colors.primary,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    produtoQuantidade: {
        fontSize: 14,
        color: themes.colors.secondary,
    },
    produtoAcoes: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: themes.colors.primary,
    },
    deleteButton: {
        backgroundColor: '#ff4444',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 5,
    },
    statusActive: {
        backgroundColor: themes.colors.primary,
    },
    statusInactive: {
        backgroundColor: '#ff4444',
    },
    statusActiveText: {
        color: themes.colors.primary,
    },
    statusInactiveText: {
        color: '#ff4444',
    },
    statusText: {
        fontSize: 14,
        color: themes.colors.secondary,
    },
});