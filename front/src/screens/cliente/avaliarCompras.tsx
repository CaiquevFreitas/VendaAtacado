import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalAvaliar from '../../components/modalAvaliar';
import { enviarAvaliacao } from '../../../controllers/requests/avaliandoCompra';
import { Ionicons } from '@expo/vector-icons';
import { buscarAvaliacoesPendentes, AvaliacaoPendente } from '../../../controllers/requests/buscarAvaliacoesPendentes';
import { useNavigation } from '@react-navigation/native';

export default function AvaliarCompras() {
    const navigation = useNavigation();
    const [pendentes, setPendentes] = useState<AvaliacaoPendente[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTipo, setModalTipo] = useState<'produto' | 'loja'>('produto');
    const [modalNome, setModalNome] = useState('');
    const [modalIdProduto, setModalIdProduto] = useState<number | undefined>(undefined);
    const [modalIdLoja, setModalIdLoja] = useState<number | undefined>(undefined);
    const [feedback, setFeedback] = useState('');
    const [idCliente, setIdCliente] = useState<number | null>(null);

    useEffect(() => {
        carregarPendentes();
    }, []);

    const carregarPendentes = async () => {
        setLoading(true);
        try {
            const dadosSalvos = await AsyncStorage.getItem('clienteData');
            if (!dadosSalvos) throw new Error('Cliente não logado');
            const cliente = JSON.parse(dadosSalvos);
            setIdCliente(cliente.id);
            const pendentesResp = await buscarAvaliacoesPendentes(cliente.id);
            setPendentes(pendentesResp.pendentes);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar as avaliações pendentes.');
        }
        setLoading(false);
    };

    const abrirModalAvaliacao = (tipo: 'produto' | 'loja', nome: string, idProduto?: number, idLoja?: number) => {
        setModalTipo(tipo);
        setModalNome(nome);
        setModalIdProduto(idProduto);
        setModalIdLoja(idLoja);
        setFeedback('');
        setModalVisible(true);
    };

    const handleEnviarAvaliacao = async (nota: number, comentario: string) => {
        if (!idCliente) return;
        try {
            await enviarAvaliacao({
                fk_idCliente: idCliente,
                fk_idProduto: modalTipo === 'produto' ? modalIdProduto : undefined,
                fk_idLoja: modalTipo === 'loja' ? modalIdLoja : undefined,
                nota,
                comentario
            });
            setFeedback('Avaliação registrada com sucesso!');
            setTimeout(async () => {
                setModalVisible(false);
                await carregarPendentes();
            }, 1200);
        } catch (error: any) {
            setFeedback(error.message || 'Erro ao enviar avaliação');
        }
    };

    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 16 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Ionicons name="arrow-back" size={24} color="#333" style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 16, color: '#333' }}>Voltar</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Avaliações Pendentes</Text>
            {pendentes.length === 0 && (
                <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>Nenhum produto ou loja pendente de avaliação.</Text>
            )}
            {pendentes.map((item, idx) => (
                <View key={idx} style={{ backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, padding: 16, elevation: 2, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                        name={item.tipo === 'loja' ? 'storefront-outline' : 'cube-outline'}
                        size={28}
                        color={item.tipo === 'loja' ? '#4CAF50' : '#007bff'}
                        style={{ marginRight: 12 }}
                    />
                    <Text style={{ flex: 1, fontSize: 16 }}>
                        {item.tipo === 'loja' ? `Loja: ${item.nomeLoja}` : `Produto: ${item.nomeProduto}`}
                    </Text>
                    <TouchableOpacity
                        style={{ backgroundColor: '#FFD700', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 18 }}
                        onPress={() =>
                            item.tipo === 'loja'
                                ? abrirModalAvaliacao('loja', item.nomeLoja || '', undefined, item.idLoja)
                                : abrirModalAvaliacao('produto', item.nomeProduto || '', item.idProduto, undefined)
                        }
                    >
                        <Text style={{ color: '#333', fontWeight: 'bold' }}>Avaliar</Text>
                    </TouchableOpacity>
                </View>
            ))}
            <ModalAvaliar
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleEnviarAvaliacao}
                tipo={modalTipo}
                nome={modalNome}
                feedback={feedback}
            />
        </ScrollView>
    );
}

