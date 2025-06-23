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
import { editarCliente } from '../../../controllers/requests/editarCliente';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ClienteInfo {
    email: string;
    telefone: string;
}

export default function AlterarInformacoesCliente() {
    const navigation = useNavigation<NavigationProp>();
    const [clienteInfo, setClienteInfo] = useState<ClienteInfo>({
        email: '',
        telefone: '',
    });
    
    const [editFields, setEditFields] = useState({
        email: false,
        telefone: false,
        senha: false,
    });

    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');

    useEffect(() => {
        carregarInformacoesCliente();
    }, []);

    const carregarInformacoesCliente = async () => {
        try {
            const clienteDataString = await AsyncStorage.getItem('clienteData');
            if (clienteDataString) {
                const clienteData = JSON.parse(clienteDataString);
                
                setClienteInfo({
                    email: clienteData.email || '',
                    telefone: clienteData.telefone || ''
                });
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar as informações do cliente');
        }
    };

    const salvarAlteracoes = async () => {
        try {
            if (editFields.senha && (!senhaAtual || !novaSenha)) {
                Alert.alert('Erro', 'Para alterar a senha, preencha todos os campos de senha');
                return;
            }
            
            let clienteId = null;
            const clienteDataString = await AsyncStorage.getItem('clienteData');
            if (clienteDataString) {
                
                const clienteData = JSON.parse(clienteDataString);
                clienteId = clienteData.id;
                if (editFields.senha) {
                    if (senhaAtual !== clienteData.senha) {
                        Alert.alert('Erro', 'Senha atual incorreta');
                        return;
                    }
                    if (novaSenha === clienteData.senha) {
                        Alert.alert('Erro', 'A nova senha não pode ser igual a senha atual');
                        return;
                    }
                }
            }

            if (!clienteId) {
                Alert.alert('Erro', 'ID do cliente não encontrado.');
                return;
            }

            const camposParaAtualizar: any = {};
            if (editFields.email) {
                camposParaAtualizar.email = clienteInfo.email;
            }
            if (editFields.telefone) {
                camposParaAtualizar.telefone = clienteInfo.telefone;
            }
            if (editFields.senha) {
                camposParaAtualizar.senha = novaSenha;
            }

            
            await editarCliente({
                id: clienteId,
                campos: camposParaAtualizar
            });


            if (clienteDataString) {
                const clienteData = JSON.parse(clienteDataString);
                const dadosAtualizados = { ...clienteData, ...camposParaAtualizar };
                await AsyncStorage.setItem('clienteData', JSON.stringify(dadosAtualizados));
            }

            
            navigation.goBack();
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
                    <Ionicons name="arrow-back" size={24} color={themes.colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Alterar Informações</Text>
            </View>

            <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formSection}>
                    <View style={styles.fieldHeader}>
                        <Text style={styles.sectionTitle}>Email</Text>
                        <Switch
                            value={editFields.email}
                            onValueChange={(value) => setEditFields(prev => ({ ...prev, email: value }))}
                        />
                    </View>
                    {editFields.email && (
                        <Textinput
                            tipo="email-address"
                            descricao="Email"
                            value={clienteInfo.email}
                            onChangeText={(text) => setClienteInfo(prev => ({ ...prev, email: text }))}
                        />
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
                            value={clienteInfo.telefone}
                            onChangeText={(text) => setClienteInfo(prev => ({ ...prev, telefone: text }))}
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
        padding: 8
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