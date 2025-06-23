import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { themes } from "../../../assets/colors/themes";
import { mostrarLojas, type Loja } from "../../../controllers/requests/mostrarLojas";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types';

export default function Home() {
    const [lojas, setLojas] = useState<Loja[]>([]);
    const [loading, setLoading] = useState(true);
    const [clienteNome, setClienteNome] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            // Carregar nome do cliente
            const clienteData = await AsyncStorage.getItem('clienteData');
            if (clienteData) {
                const dados = JSON.parse(clienteData);
                setClienteNome(dados.nome);
            }

            
            const lojasData = await mostrarLojas();
            setLojas(lojasData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons 
                    key={i} 
                    name={i <= rating ? "star" : "star-outline"} 
                    size={16} 
                    color={i <= rating ? "#FFD700" : "#ccc"} 
                />
            );
        }
        return stars;
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={themes.colors.primary} />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header com mensagem de boas-vindas */}
            <View style={styles.header}>
                <View style={styles.greetingContainer}>
                    <Text style={styles.greeting}>{getGreeting()},</Text>
                    <Text style={styles.userName}>{clienteNome || 'Cliente'}! 👋</Text>
                </View>
                <View style={styles.headerIcon}>
                    <Ionicons name="home" size={24} color="#fff" />
                </View>
            </View>

            {/* Seção de destaque */}
            <View style={styles.highlightSection}>
                <Text style={styles.highlightTitle}>🎉 Bem-vindo ao Venda Atacado!</Text>
                <Text style={styles.highlightText}>
                    Descubra as melhores lojas e produtos com preços incríveis
                </Text>
            </View>

            {/* Seção das principais lojas */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>🏆 Principais Lojas</Text>
                    <TouchableOpacity>
                        <Text style={styles.verTodasText}>Ver todas</Text>
                    </TouchableOpacity>
                </View>

                {lojas.length > 0 ? (
                    <View style={styles.lojasContainer}>
                        {lojas.map((loja) => (
                            <TouchableOpacity key={loja.id} style={styles.lojaCard} onPress={() => {
                                navigation.navigate('PageLoja', {
                                    idLoja: loja.id
                                });
                            }}>
                                <Image 
                                    source={{ 
                                        uri: loja.logo 
                                            ? `http://localhost:3000${loja.logo}` 
                                            : 'https://via.placeholder.com/80/4CAF50/FFFFFF?text=🏪'
                                    }} 
                                    style={styles.lojaLogo} 
                                />
                                <View style={styles.lojaInfo}>
                                    <Text style={styles.lojaNome} numberOfLines={1}>
                                        {loja.nomeLoja}
                                    </Text>
                                    <View style={styles.ratingContainer}>
                                        {renderStars(loja.nota)}
                                        <Text style={styles.ratingText}>{loja.nota.toFixed(1)}</Text>
                                        <Text style={styles.totalAvaliacoesText}>({loja.totalAvaliacoes} avaliações)</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.verLojaButton}>
                                    <Ionicons name="arrow-forward" size={20} color={themes.colors.primary} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="storefront-outline" size={48} color="#ccc" />
                        <Text style={styles.emptyStateText}>Nenhuma loja encontrada</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa'
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666'
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
    greetingContainer: {
        flex: 1
    },
    greeting: {
        color: '#fff',
        fontSize: 18,
        opacity: 0.9
    },
    userName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold'
    },
    headerIcon: {
        padding: 8
    },
    highlightSection: {
        backgroundColor: themes.colors.secondary,
        margin: 20,
        padding: 20,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    highlightTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8
    },
    highlightText: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.9
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 20
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333'
    },
    verTodasText: {
        color: themes.colors.primary,
        fontSize: 14,
        fontWeight: '600'
    },
    lojasContainer: {
        gap: 12
    },
    lojaCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2
    },
    lojaLogo: {
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
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 5
    },
    totalAvaliacoesText: {
        fontSize: 10,
        color: '#999',
        marginLeft: 5
    },
    verLojaButton: {
        padding: 8
    },
    emptyState: {
        alignItems: 'center',
        padding: 40
    },
    emptyStateText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666'
    }
});