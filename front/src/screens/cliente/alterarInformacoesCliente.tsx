import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { themes } from '../../../assets/colors/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AlterarInformacoesCliente() {
    const navigation = useNavigation<NavigationProp>();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');

    useEffect(() => {
        carregarDadosCliente();
    }, []);

    const carregarDadosCliente = async () => {
        try {
            const clienteData = await AsyncStorage.getItem('clienteData');
            if (clienteData) {
                const cliente = JSON.parse(clienteData);
                setNome(cliente.nome || '');
                setEmail(cliente.email || '');
                setTelefone(cliente.telefone || '');
                setDataNascimento(cliente.dataNascimento || '');
            }
        } catch (error) {
            console.error('Erro ao carregar dados do cliente:', error);
        }
    };

    const handleSalvar = async () => {
        if (!nome || !email || !telefone) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
            return;
        }

        try {
            const clienteData = await AsyncStorage.getItem('clienteData');
            const cliente = clienteData ? JSON.parse(clienteData) : {};
            
            const dadosAtualizados = {
                ...cliente,
                nome,
                email,
                telefone,
                dataNascimento
            };

            await AsyncStorage.setItem('clienteData', JSON.stringify(dadosAtualizados));
            Alert.alert('Sucesso', 'Informações atualizadas com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            Alert.alert('Erro', 'Não foi possível salvar as informações');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={themes.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Alterar Informações</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome Completo *</Text>
                        <TextInput
                            style={styles.input}
                            value={nome}
                            onChangeText={setNome}
                            placeholder="Digite seu nome completo"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email *</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Digite seu email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Telefone *</Text>
                        <TextInput
                            style={styles.input}
                            value={telefone}
                            onChangeText={setTelefone}
                            placeholder="Digite seu telefone"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Data de Nascimento</Text>
                        <TextInput
                            style={styles.input}
                            value={dataNascimento}
                            onChangeText={setDataNascimento}
                            placeholder="DD/MM/AAAA"
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
                    <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: themes.colors.primary,
        marginLeft: 15,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    formContainer: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        color: themes.colors.secondary,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: themes.colors.secondary,
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        backgroundColor: 'white',
    },
    buttonContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    saveButton: {
        backgroundColor: themes.colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: themes.colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 