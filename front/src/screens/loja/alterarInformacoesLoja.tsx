import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes } from '../../../assets/colors/themes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types';
import { Textinput } from '../../components/textInput';
import { TimeInput } from '../../components/textInput/timeInput';
import { editarLoja } from '../../requests/editarLoja';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LojaInfo {
    nome: string;
    horarioAbertura: Date;
    horarioFechamento: Date;
    telefone: string;
}

export default function AlterarInformacoesLoja() {
    const navigation = useNavigation<NavigationProp>();
    const [lojaInfo, setLojaInfo] = useState<LojaInfo>({
        nome: '',
        horarioAbertura: new Date(),
        horarioFechamento: new Date(),
        telefone: '',
    });
    
    const [editFields, setEditFields] = useState({
        nome: false,
        horario: false,
        telefone: false,
        senha: false,
    });

    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');

    useEffect(() => {
        carregarInformacoesLoja();
    }, []);

    const carregarInformacoesLoja = async () => {
        try {
            const lojaDataString = await AsyncStorage.getItem('lojaData');
            if (lojaDataString) {
                const lojaData = JSON.parse(lojaDataString);
                setLojaInfo({
                    nome: lojaData.nomeLoja,
                    horarioAbertura: new Date(lojaData.horarioAbertura),
                    horarioFechamento: new Date(lojaData.horarioFechamento),
                    telefone: lojaData.telefone
                });
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar as informações da loja');
        }
    };

    const salvarAlteracoes = async () => {
        try {
            if (editFields.senha && (!senhaAtual || !novaSenha)) {
                Alert.alert('Erro', 'Para alterar a senha, preencha todos os campos de senha');
                return;
            }

            if (editFields.senha) {
                const senhaAtualSalva = await AsyncStorage.getItem('@loja_senha');
                if (senhaAtual !== senhaAtualSalva) {
                    Alert.alert('Erro', 'Senha atual incorreta');
                    return;
                }
            }

            const camposParaAtualizar: any = {};
            
            if (editFields.nome) {
                camposParaAtualizar.nome = lojaInfo.nome;
            }
            
            if (editFields.horario) {
                camposParaAtualizar.horarioAbertura = lojaInfo.horarioAbertura;
                camposParaAtualizar.horarioFechamento = lojaInfo.horarioFechamento;
            }
            
            if (editFields.telefone) {
                camposParaAtualizar.telefone = lojaInfo.telefone;
            }
            
            if (editFields.senha) {
                camposParaAtualizar.senha = novaSenha;
            }

            const lojaDataString = await AsyncStorage.getItem('lojaData');
            if (!lojaDataString) {
                Alert.alert('Erro', 'Dados da loja não encontrados');
                return;
            }
            console.log('lojaDataString:', lojaDataString);
            const lojaData = JSON.parse(lojaDataString);
            console.log('lojaData parsed:', lojaData);
            const lojaId = lojaData.id;

            if (!lojaId) {
                Alert.alert('Erro', 'ID da loja não encontrado');
                return;
            }
            console.log('lojaId:', lojaId);

            await editarLoja({
                id: lojaId,
                campos: camposParaAtualizar
            });

            const lojaInfoAtual = await AsyncStorage.getItem('@loja_info');
            const infoAtual = lojaInfoAtual ? JSON.parse(lojaInfoAtual) : {};
            const novasInfos = { ...infoAtual, ...camposParaAtualizar };
            await AsyncStorage.setItem('@loja_info', JSON.stringify(novasInfos));

            if (editFields.senha) {
                await AsyncStorage.setItem('@loja_senha', novaSenha);
            }

            Alert.alert('Sucesso', 'Informações atualizadas com sucesso!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar as alterações');
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={themes.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Alterar Informações da Loja</Text>
            </View>

            <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formSection}>
                    <View style={styles.fieldHeader}>
                        <Text style={styles.sectionTitle}>Nome da Loja</Text>
                        <Switch
                            value={editFields.nome}
                            onValueChange={(value) => setEditFields(prev => ({ ...prev, nome: value }))}
                        />
                    </View>
                    {editFields.nome && (
                        <Textinput
                            tipo="default"
                            descricao="Nome da Loja"
                            value={lojaInfo.nome}
                            onChangeText={(text) => setLojaInfo(prev => ({ ...prev, nome: text }))}
                        />
                    )}
                </View>

                <View style={styles.formSection}>
                    <View style={styles.fieldHeader}>
                        <Text style={styles.sectionTitle}>Horário de Funcionamento</Text>
                        <Switch
                            value={editFields.horario}
                            onValueChange={(value) => setEditFields(prev => ({ ...prev, horario: value }))}
                        />
                    </View>
                    {editFields.horario && (
                        <View style={styles.rowContainer}>
                            <View style={styles.halfWidth}>
                                <TimeInput
                                    descricao="Horário de Abertura"
                                    value={lojaInfo.horarioAbertura}
                                    onChange={(time) => setLojaInfo(prev => ({ ...prev, horarioAbertura: time }))}
                                />
                            </View>
                            <View style={styles.halfWidth}>
                                <TimeInput
                                    descricao="Horário de Fechamento"
                                    value={lojaInfo.horarioFechamento}
                                    onChange={(time) => setLojaInfo(prev => ({ ...prev, horarioFechamento: time }))}
                                />
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.formSection}>
                    <View style={styles.fieldHeader}>
                        <Text style={styles.sectionTitle}>Telefone</Text>
                        <Switch
                            value={editFields.telefone}
                            onValueChange={(value) => setEditFields(prev => ({ ...prev, telefone: value }))}
                        />
                    </View>
                    {editFields.telefone && (
                        <Textinput
                            tipo="phone-pad"
                            descricao="Telefone"
                            value={lojaInfo.telefone}
                            onChangeText={(text) => setLojaInfo(prev => ({ ...prev, telefone: text }))}
                            max={11}
                        />
                    )}
                </View>

                <View style={styles.formSection}>
                    <View style={styles.fieldHeader}>
                        <Text style={styles.sectionTitle}>Alterar Senha</Text>
                        <Switch
                            value={editFields.senha}
                            onValueChange={(value) => setEditFields(prev => ({ ...prev, senha: value }))}
                        />
                    </View>
                    {editFields.senha && (
                        <>
                            <Textinput
                                tipo="default"
                                descricao="Senha atual"
                                value={senhaAtual}
                                onChangeText={setSenhaAtual}
                                isSenha={true}
                                max={8}
                            />
                            <Textinput
                                tipo="default"
                                descricao="Nova senha (Max: 8 caracteres)"
                                value={novaSenha}
                                onChangeText={setNovaSenha}
                                isSenha={true}
                                max={8}
                            />
                        </>
                    )}
                </View>

                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={salvarAlteracoes}
                >
                    <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: themes.colors.white,
        marginLeft: 15,
    },
    content: {
        padding: 20,
    },
    formSection: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
    },
    fieldHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: themes.colors.white,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
    },
    halfWidth: {
        flex: 1,
    },
    saveButton: {
        backgroundColor: themes.colors.white,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    saveButtonText: {
        color: themes.colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 