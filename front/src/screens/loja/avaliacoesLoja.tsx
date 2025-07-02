import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarAvaliacoesLoja, AvaliacaoRecebida } from '../../../controllers/requests/buscarAvaliacoesLoja';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function AvaliacoesLoja() {
    const navigation = useNavigation();
    const [tab, setTab] = useState<'loja' | 'produtos'>('loja');
    const [avaliacoesLoja, setAvaliacoesLoja] = useState<AvaliacaoRecebida[]>([]);
    const [avaliacoesProdutos, setAvaliacoesProdutos] = useState<AvaliacaoRecebida[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarAvaliacoes();
    }, []);

    const carregarAvaliacoes = async () => {
        setLoading(true);
        try {
            const dadosString = await AsyncStorage.getItem('lojaData');
            if (!dadosString) throw new Error('Loja não logada');
            const loja = JSON.parse(dadosString);
            const resp = await buscarAvaliacoesLoja(loja.id);
            setAvaliacoesLoja(resp.avaliacoesLoja);
            setAvaliacoesProdutos(resp.avaliacoesProdutos);
        } catch (error) {
            // Trate o erro conforme necessário
        }
        setLoading(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', margin: 16, marginBottom: 0 }}>
                <Ionicons name="arrow-back" size={24} color="#333" style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 16, color: '#333' }}>Voltar</Text>
            </TouchableOpacity>
            <View style={styles.tabsContainer}>
                <TouchableOpacity style={[styles.tab, tab === 'loja' && styles.tabActive]} onPress={() => setTab('loja')}>
                    <Text style={[styles.tabText, tab === 'loja' && styles.tabTextActive]}>Avaliações da Loja</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, tab === 'produtos' && styles.tabActive]} onPress={() => setTab('produtos')}>
                    <Text style={[styles.tabText, tab === 'produtos' && styles.tabTextActive]}>Avaliações dos Produtos</Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <ScrollView style={{ flex: 1, padding: 16 }}>
                    {tab === 'loja' ? (
                        avaliacoesLoja.length === 0 ? (
                            <Text style={styles.emptyText}>Nenhuma avaliação para a loja ainda.</Text>
                        ) : (
                            avaliacoesLoja.map(av => (
                                <View key={av.idAvaliacao} style={styles.card}>
                                    <Text style={styles.nota}>Nota: {av.nota} ⭐</Text>
                                    <Text style={styles.comentario}>{av.comentario}</Text>
                                    <Text style={styles.cliente}>Cliente: {av.Cliente?.nomeCliente || 'Anônimo'}</Text>
                                </View>
                            ))
                        )
                    ) : (
                        avaliacoesProdutos.length === 0 ? (
                            <Text style={styles.emptyText}>Nenhuma avaliação para os produtos ainda.</Text>
                        ) : (
                            avaliacoesProdutos.map(av => (
                                <View key={av.idAvaliacao} style={styles.card}>
                                    <Text style={styles.nota}>Nota: {av.nota} ⭐</Text>
                                    <Text style={styles.comentario}>{av.comentario}</Text>
                                    <Text style={styles.produto}>Produto: {av.Produto?.nomeProduto || '-'}</Text>
                                    <Text style={styles.cliente}>Cliente: {av.Cliente?.nomeCliente || 'Anônimo'}</Text>
                                </View>
                            ))
                        )
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    tab: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    tabActive: {
        borderBottomWidth: 3,
        borderColor: '#4CAF50',
    },
    tabText: {
        fontSize: 16,
        color: '#888',
        fontWeight: 'bold',
    },
    tabTextActive: {
        color: '#4CAF50',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    nota: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    comentario: {
        fontSize: 15,
        marginBottom: 4,
    },
    produto: {
        fontSize: 14,
        color: '#007bff',
        marginBottom: 2,
    },
    cliente: {
        fontSize: 13,
        color: '#888',
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 40,
    },
});
