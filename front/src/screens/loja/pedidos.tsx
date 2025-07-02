import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    FlatList,
    Alert,
    RefreshControl,
    ActivityIndicator
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { themes } from "../../../assets/colors/themes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mostrarPedidosLoja, Pedido } from '../../../controllers/requests/mostrarPedido';
import { editarStatusPedido } from '../../../controllers/requests/editarStatusPedido';
import API_URL from "../../../controllers/requests/api.url";

const STATUS_OPTIONS = [
    { value: 'todos', label: 'Todos' },
    { value: 'Em Processamento', label: 'Em Processamento' },
    { value: 'Em preparo', label: 'Em Preparo' },
    { value: 'Pronto', label: 'Pronto' },
    { value: 'Entregue', label: 'Entregue' },
    { value: 'Cancelado', label: 'Cancelado' }
];

export default function Pedidos() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState('todos');
    const [idLoja, setIdLoja] = useState<number | null>(null);
    const [editandoStatus, setEditandoStatus] = useState<number | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            carregarDadosLoja();
            if (idLoja) {
                carregarPedidos();
            }
        }, [idLoja, filtroStatus])
    );

    const carregarDadosLoja = async () => {
        try {
            const lojaDataString = await AsyncStorage.getItem('lojaData');
            if (lojaDataString) {
                const lojaData = JSON.parse(lojaDataString);
                setIdLoja(lojaData.id);
            }
        } catch (error) {
            console.error('Erro ao carregar dados da loja:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados da loja');
        }
    };

    const carregarPedidos = async () => {
        if (!idLoja) return;

        try {
            setLoading(true);
            const response = await mostrarPedidosLoja(idLoja, filtroStatus);
            setPedidos(response.pedidos);
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            Alert.alert('Erro', 'Não foi possível carregar os pedidos');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await carregarPedidos();
        setRefreshing(false);
    };

    const alterarStatusPedido = async (idPedido: number, novoStatus: string, statusAtual: string) => {
        // Verificar se o pedido pode ser alterado
        if (statusAtual === 'Entregue' || statusAtual === 'Cancelado') {
            Alert.alert(
                'Status Não Alterável',
                `Pedidos com status "${statusAtual}" não podem ser alterados.`,
                [{ text: 'OK' }]
            );
            return;
        }

        // Confirmação antes de alterar
        Alert.alert(
            'Confirmar Alteração',
            `Deseja alterar o status do pedido #${pedidos.find(p => p.idPedido === idPedido)?.numeroPedido} para "${novoStatus}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Confirmar', 
                    onPress: async () => {
                        try {
                            setEditandoStatus(idPedido);
                            const resposta = await editarStatusPedido(idPedido, novoStatus);
                            
                            if (resposta.success) {
                                Alert.alert(
                                    'Status Alterado!',
                                    resposta.message,
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                // Recarregar pedidos para atualizar a lista
                                                carregarPedidos();
                                            }
                                        }
                                    ]
                                );
                            } else {
                                Alert.alert('Erro', resposta.message || 'Erro ao alterar status');
                            }
                        } catch (error: any) {
                            console.error('Erro ao alterar status:', error);
                            Alert.alert('Erro', error.message || 'Não foi possível alterar o status do pedido');
                        } finally {
                            setEditandoStatus(null);
                        }
                    }
                }
            ]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Em Processamento':
                return '#FFA500';
            case 'Em preparo':
                return '#FF6B35';
            case 'Pronto':
                return '#4CAF50';
            case 'Entregue':
                return '#2196F3';
            case 'Cancelado':
                return '#F44336';
            default:
                return '#666';
        }
    };

    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const renderProduto = ({ item }: { item: any }) => (
        <View style={styles.produtoItem}>
            <Image 
                source={{ uri: `${API_URL}${item.imagem}` }} 
                style={styles.produtoImagem} 
            />
            <View style={styles.produtoInfo}>
                <Text style={styles.produtoNome} numberOfLines={2}>
                    {item.nome}
                </Text>
                <Text style={styles.produtoPreco}>
                    R$ {item.precoUnitario.toFixed(2)} x {item.quantidade}
                </Text>
                <Text style={styles.produtoSubtotal}>
                    Subtotal: R$ {item.subtotal.toFixed(2)}
                </Text>
            </View>
        </View>
    );

    const renderPedido = ({ item }: { item: Pedido }) => {
        const podeAlterar = item.status !== 'Entregue' && item.status !== 'Cancelado';
        
        return (
            <View style={styles.pedidoContainer}>
                {/* Cabeçalho do Pedido */}
                <View style={styles.pedidoHeader}>
                                    <View style={styles.pedidoInfo}>
                    <Text style={styles.pedidoId}>Pedido #{item.numeroPedido}</Text>
                    <Text style={styles.pedidoData}>{formatarData(item.dataPedido)}</Text>
                </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>

                {/* Informações do Cliente */}
                <View style={styles.clienteInfo}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.clienteInfoContent}
                    >
                        <View style={styles.clienteItem}>
                    <Ionicons name="person" size={16} color="#666" />
                            <Text style={styles.clienteNome} numberOfLines={1}>{item.cliente.nome}</Text>
                        </View>
                        <View style={styles.clienteItem}>
                    <Ionicons name="call" size={16} color="#666" />
                    <Text style={styles.clienteTelefone}>{item.cliente.telefone}</Text>
                        </View>
                    </ScrollView>
                </View>

                {/* Lista de Produtos */}
                <View style={styles.produtosContainer}>
                    <Text style={styles.produtosTitulo}>Produtos:</Text>
                    <FlatList
                        data={item.produtos}
                        renderItem={renderProduto}
                        keyExtractor={(produto) => produto.idProduto.toString()}
                        scrollEnabled={false}
                    />
                </View>

                {/* Total do Pedido */}
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total do Pedido:</Text>
                    <Text style={styles.totalValor}>R$ {item.total.toFixed(2)}</Text>
                </View>

                {/* Controles de Status */}
                <View style={styles.controlesContainer}>
                    <View style={styles.statusSelector}>
                        <Text style={styles.statusLabel}>
                            {podeAlterar ? 'Alterar Status:' : 'Status Final:'}
                        </Text>
                        {!podeAlterar && (
                            <Text style={styles.statusFinalText}>
                                Este pedido não pode mais ser alterado
                            </Text>
                        )}
                        <View style={styles.statusOptions}>
                            {STATUS_OPTIONS.slice(1).map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.statusOption,
                                        item.status === option.value && styles.statusOptionAtivo,
                                        !podeAlterar && styles.statusOptionDesabilitado
                                    ]}
                                    onPress={() => {
                                        if (podeAlterar && editandoStatus !== item.idPedido) {
                                            alterarStatusPedido(item.idPedido, option.value, item.status);
                                        }
                                    }}
                                    disabled={!podeAlterar || editandoStatus === item.idPedido}
                                >
                                    {editandoStatus === item.idPedido && item.status === option.value && (
                                        <Ionicons name="refresh" size={12} color="#fff" style={styles.loadingIcon} />
                                    )}
                                    <Text style={[
                                        styles.statusOptionText,
                                        item.status === option.value && styles.statusOptionTextAtivo,
                                        !podeAlterar && styles.statusOptionTextDesabilitado
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    // Se está carregando
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={themes.colors.primary} />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Pedidos Recebidos</Text>

            {/* Filtro por Status */}
            <View style={styles.filtroContainer}>
                <Text style={styles.filtroLabel}>Filtrar por Status:</Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtroOptions}
                >
                    {STATUS_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.filtroOption,
                                filtroStatus === option.value && styles.filtroOptionAtivo
                            ]}
                            onPress={() => setFiltroStatus(option.value)}
                        >
                            <Text style={[
                                styles.filtroOptionText,
                                filtroStatus === option.value && styles.filtroOptionTextAtivo
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Lista de Pedidos */}
            {pedidos.length === 0 ? (
                <View style={styles.alertaContainer}>
                    <Ionicons name="receipt-outline" size={80} color="#fff" />
                    <Text style={styles.alertaTexto}>
                        {filtroStatus === 'todos' 
                            ? 'Nenhum pedido recebido ainda' 
                            : `Nenhum pedido com status "${filtroStatus}"`
                        }
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={pedidos}
                    renderItem={renderPedido}
                    keyExtractor={(item) => item.idPedido.toString()}
                    style={styles.listaPedidos}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#fff']}
                            tintColor="#fff"
                        />
                    }
                />
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themes.colors.primary
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#fff'
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
        marginTop: 10
    },
    filtroContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15
    },
    filtroLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10
    },
    filtroOptions: {
        flexDirection: 'row'
    },
    filtroOption: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 10
    },
    filtroOptionAtivo: {
        backgroundColor: themes.colors.primary
    },
    filtroOptionText: {
        fontSize: 14,
        color: '#666'
    },
    filtroOptionTextAtivo: {
        color: '#fff'
    },
    listaPedidos: {
        flex: 1
    },
    pedidoContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15
    },
    pedidoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    pedidoInfo: {
        flex: 1
    },
    pedidoId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    pedidoData: {
        fontSize: 14,
        color: '#666',
        marginTop: 2
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600'
    },
    clienteInfo: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        borderRadius: 6,
        marginBottom: 15
    },
    clienteInfoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    clienteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    clienteNome: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        flexShrink: 1
    },
    clienteTelefone: {
        fontSize: 14,
        color: '#666'
    },
    produtosContainer: {
        marginBottom: 15
    },
    produtosTitulo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10
    },
    produtoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    produtoImagem: {
        width: 50,
        height: 50,
        borderRadius: 6,
        marginRight: 10
    },
    produtoInfo: {
        flex: 1
    },
    produtoNome: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2
    },
    produtoPreco: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2
    },
    produtoSubtotal: {
        fontSize: 12,
        fontWeight: '600',
        color: themes.colors.primary
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 6,
        marginBottom: 15
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333'
    },
    totalValor: {
        fontSize: 18,
        fontWeight: 'bold',
        color: themes.colors.primary
    },
    controlesContainer: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 15
    },
    statusSelector: {
        marginBottom: 10
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8
    },
    statusFinalText: {
        fontSize: 12,
        color: '#F44336',
        fontStyle: 'italic',
        marginBottom: 8
    },
    statusOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    statusOption: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusOptionAtivo: {
        backgroundColor: themes.colors.primary,
        borderColor: themes.colors.primary
    },
    statusOptionDesabilitado: {
        backgroundColor: '#f5f5f5',
        borderColor: '#ddd',
        opacity: 0.6
    },
    statusOptionText: {
        fontSize: 12,
        color: '#666'
    },
    statusOptionTextAtivo: {
        color: '#fff'
    },
    statusOptionTextDesabilitado: {
        color: '#999'
    },
    loadingIcon: {
        marginRight: 4
    }
});