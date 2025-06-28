import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    FlatList,
    Alert
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types';
import { themes } from "../../../assets/colors/themes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mostrarItensCarrinho, ItemCarrinho } from '../../../controllers/requests/mostrarItensCarrinho';
import API_URL from "../../../controllers/requests/api.url";

export default function Carrinho() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [itens, setItens] = useState<ItemCarrinho[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            carregarItensCarrinho();
        }, [])
    );

    const carregarItensCarrinho = async () => {
        try {
            setLoading(true);
    
            const clienteDataString = await AsyncStorage.getItem('clienteData');
            if (clienteDataString) {
                const clienteData = JSON.parse(clienteDataString);
                const idCliente = clienteData.id;
            if (!idCliente) {
                console.error('ID do cliente não encontrado');
                setLoading(false);
                return;
            }

            const response = await mostrarItensCarrinho(parseInt(idCliente));
            setItens(response.itens);
            }
        } catch (error) {
            console.error('Erro ao carregar itens do carrinho:', error);
            Alert.alert('Erro', 'Não foi possível carregar os itens do carrinho');
        } finally {
            setLoading(false);
        }
    };

    const toggleItemSelecao = (id: number) => {
        setItens(prevItens => 
            prevItens.map(item => 
                item.id === id 
                    ? { ...item, selecionado: !item.selecionado }
                    : item
            )
        );
    };

    const toggleSelecionarTodos = () => {
        const todosSelecionados = itens.every(item => item.selecionado);
        setItens(prevItens => 
            prevItens.map(item => ({ ...item, selecionado: !todosSelecionados }))
        );
    };

    const excluirItem = (id: number) => {
        Alert.alert(
            "Excluir item",
            "Tem certeza que deseja remover este item do carrinho?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    style: "destructive",
                    onPress: () => {
                        setItens(prevItens => prevItens.filter(item => item.id !== id));
                    }
                }
            ]
        );
    };

    const alterarQuantidade = (id: number, novaQuantidade: number) => {
        if (novaQuantidade < 1) return;
        
        setItens(prevItens => 
            prevItens.map(item => 
                item.id === id 
                    ? { ...item, quantidade: novaQuantidade }
                    : item
            )
        );
    };

    const calcularTotal = () => {
        return itens
            .filter(item => item.selecionado)
            .reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
    };


    const navegarParaProduto = (idProduto: number) => {
        navigation.navigate('PageProduto', {
            idProduto: idProduto
        });
    };

    const todosSelecionados = itens.length > 0 && itens.every(item => item.selecionado);
    const algumSelecionado = itens.some(item => item.selecionado);
    const total = calcularTotal();

    const renderItem = ({ item }: { item: ItemCarrinho }) => (
        <View style={styles.itemContainer}>
            {/* Checkbox de seleção */}
            <TouchableOpacity 
                style={styles.checkboxContainer} 
                onPress={() => toggleItemSelecao(item.id)}
            >
                <Ionicons 
                    name={item.selecionado ? "checkbox" : "square-outline"} 
                    size={24} 
                    color={item.selecionado ? themes.colors.primary : "#666"} 
                />
            </TouchableOpacity>

            {/* Imagem do produto */}
            <TouchableOpacity 
                style={styles.imagemContainer}
                onPress={() => navegarParaProduto(item.idProduto)}
            >
                <Image source={{ uri: `${API_URL}${item.imagem}` }} style={styles.imagemProduto} />
            </TouchableOpacity>

            {/* Informações do produto */}
            <View style={styles.infoContainer}>
                <TouchableOpacity onPress={() => navegarParaProduto(item.idProduto)}>
                    <Text style={styles.nomeProduto} numberOfLines={2}>
                        {item.nome}
                    </Text>
                </TouchableOpacity>
                
                <Text style={styles.precoUnitario}>
                    R$ {item.precoUnitario.toFixed(2)}
                </Text>

                {/* Controles de quantidade */}
                <View style={styles.quantidadeContainer}>
                    <TouchableOpacity 
                        style={styles.qtdBtn}
                        onPress={() => alterarQuantidade(item.id, item.quantidade - 1)}
                    >
                        <Ionicons name="remove" size={16} color="#666" />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantidade}>{item.quantidade}</Text>
                    
                    <TouchableOpacity 
                        style={styles.qtdBtn}
                        onPress={() => alterarQuantidade(item.id, item.quantidade + 1)}
                    >
                        <Ionicons name="add" size={16} color="#666" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.precoTotal}>
                    Total: R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                </Text>
            </View>

            {/* Botão excluir */}
            <TouchableOpacity 
                style={styles.excluirBtn}
                onPress={() => excluirItem(item.id)}
            >
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
            </TouchableOpacity>
        </View>
    );

    // Se está carregando
    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}>Carrinho de Compras</Text>
                <View style={styles.alertaContainer}>
                    <Ionicons name="refresh" size={80} color="#fff" />
                    <Text style={styles.alertaTexto}>Carregando itens...</Text>
                </View>
            </View>
        );
    }

    // Se não há itens no carrinho
    if (itens.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}>Carrinho de Compras</Text>
                
                <View style={styles.alertaContainer}>
                    <Ionicons name="cart-outline" size={80} color="#fff" />
                    <Text style={styles.alertaTexto}>Seu carrinho está vazio</Text>
                    <Text style={styles.alertaTexto}>Adicione produtos para começar</Text>
                    <Text style={styles.alertaTexto}>suas compras</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Carrinho de Compras</Text>

            {/* Selecionar todos */}
            <View style={styles.selecionarTodosContainer}>
                <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={toggleSelecionarTodos}
                >
                    <Ionicons 
                        name={todosSelecionados ? "checkbox" : "square-outline"} 
                        size={24} 
                        color={todosSelecionados ? themes.colors.primary : "#666"} 
                    />
                </TouchableOpacity>
                <Text style={styles.selecionarTodosTexto}>Selecionar todos</Text>
            </View>

            {/* Lista de itens */}
            <FlatList
                data={itens}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                style={styles.listaItens}
                showsVerticalScrollIndicator={false}
            />

            {/* Barra de total e finalizar compra */}
            {algumSelecionado && (
                <View style={styles.barraTotal}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalValor}>R$ {total.toFixed(2)}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.finalizarBtn}>
                        <Text style={styles.finalizarBtnTexto}>Finalizar Compra</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.primary,
        padding: 20
    },
    titulo: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20
    },
    alertaContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertaTexto: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 5
    },
    selecionarTodosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15
    },
    checkboxContainer: {
        marginRight: 10
    },
    selecionarTodosTexto: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333'
    },
    listaItens: {
        flex: 1
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center'
    },
    imagemContainer: {
        marginRight: 15
    },
    imagemProduto: {
        width: 80,
        height: 80,
        borderRadius: 8
    },
    infoContainer: {
        flex: 1
    },
    nomeProduto: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 5
    },
    precoUnitario: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8
    },
    quantidadeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    qtdBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center'
    },
    quantidade: {
        fontSize: 16,
        fontWeight: '500',
        marginHorizontal: 15,
        minWidth: 20,
        textAlign: 'center'
    },
    precoTotal: {
        fontSize: 14,
        fontWeight: '600',
        color: themes.colors.primary
    },
    excluirBtn: {
        padding: 8
    },
    barraTotal: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    totalContainer: {
        flex: 1
    },
    totalLabel: {
        fontSize: 16,
        color: '#666'
    },
    totalValor: {
        fontSize: 20,
        fontWeight: 'bold',
        color: themes.colors.primary
    },
    finalizarBtn: {
        backgroundColor: themes.colors.primary,
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 8
    },
    finalizarBtnTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    }
});
