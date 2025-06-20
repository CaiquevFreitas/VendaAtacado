import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
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
import { cadastrarEndereco } from '../../../controllers/requests/cadastrarEndereco';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Endereco {
    estado: string;
    cidade: string;
    bairro: string;
    logradouro: string;
    numero: string;
    cep: string;
}

export default function AlterarEndereco() {
    const navigation = useNavigation<NavigationProp>();
    const [endereco, setEndereco] = useState<Endereco>({
        estado: '',
        cidade: '',
        bairro: '',
        logradouro: '',
        numero: '',
        cep: '',
    });

    useEffect(() => {
        carregarEnderecoSalvo();
    }, []);

    const carregarEnderecoSalvo = async () => {
        try {
            const lojaDataString = await AsyncStorage.getItem('lojaData');
            if (lojaDataString) {
                const lojaData = JSON.parse(lojaDataString);
                if (lojaData.endereco) {
                    setEndereco({
                        estado: lojaData.endereco.estado || '',
                        cidade: lojaData.endereco.cidade || '',
                        bairro: lojaData.endereco.bairro || '',
                        logradouro: lojaData.endereco.logradouro || '',
                        numero: lojaData.endereco.numero || '',
                        cep: lojaData.endereco.cep || '',
                    });
                }
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar o endereço salvo');
        }
    };

    const salvarEndereco = async () => {
        
        if (!endereco.estado || !endereco.cidade || !endereco.bairro || !endereco.logradouro || !endereco.numero || !endereco.cep) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }
        try {
            
            const lojaDataString = await AsyncStorage.getItem('lojaData');
            if (!lojaDataString) {
                Alert.alert('Erro', 'Dados da loja não encontrados.');
                return;
            }
            const lojaData = JSON.parse(lojaDataString);
            if (!lojaData.id) {
                Alert.alert('Erro', 'ID da loja não encontrado.');
                return;
            }
            await cadastrarEndereco({
                ...endereco,
                fk_idLoja: lojaData.id
            });
            
            lojaData.endereco = endereco;
            await AsyncStorage.setItem('lojaData', JSON.stringify(lojaData));
            Alert.alert('Sucesso', 'Endereço salvo com sucesso!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar o endereço');
        }
    };

    useEffect(() => {
        const buscarEnderecoPorCep = async () => {
            const cepLimpo = endereco.cep.replace(/\D/g, '');
            if (cepLimpo.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                    const data = await response.json();
                    if (!data.erro) {
                        setEndereco(prev => ({
                            ...prev,
                            estado: data.uf || '',
                            cidade: data.localidade || '',
                            bairro: data.bairro || '',
                            logradouro: data.logradouro || prev.logradouro
                        }));
                    } else {
                        Alert.alert('CEP não encontrado', 'Verifique o CEP digitado.');
                    }
                } catch (error) {
                    Alert.alert('Erro', 'Não foi possível buscar o endereço pelo CEP.');
                }
            }
        };
        if (endereco.cep && endereco.cep.replace(/\D/g, '').length === 8) {
            buscarEnderecoPorCep();
        }
    }, [endereco.cep]);

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
                <Text style={styles.headerTitle}>Endereço da Loja</Text>
            </View>

            <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formSection}>
                    <Textinput
                        tipo="default"
                        descricao="CEP"
                        value={endereco.cep}
                        onChangeText={text => setEndereco(prev => ({ ...prev, cep: text }))}
                        max={10}
                    />
                    <Textinput
                        tipo="default"
                        descricao="Estado"
                        value={endereco.estado}
                        onChangeText={text => setEndereco(prev => ({ ...prev, estado: text }))}
                        max={100}
                    />
                    <Textinput
                        tipo="default"
                        descricao="Cidade"
                        value={endereco.cidade}
                        onChangeText={text => setEndereco(prev => ({ ...prev, cidade: text }))}
                        max={100}
                    />
                    <Textinput
                        tipo="default"
                        descricao="Bairro"
                        value={endereco.bairro}
                        onChangeText={text => setEndereco(prev => ({ ...prev, bairro: text }))}
                        max={100}
                    />
                    <Textinput
                        tipo="default"
                        descricao="Logradouro"
                        value={endereco.logradouro}
                        onChangeText={text => setEndereco(prev => ({ ...prev, logradouro: text }))}
                        max={100}
                    />
                    <Textinput
                        tipo="default"
                        descricao="Número"
                        value={endereco.numero}
                        onChangeText={text => setEndereco(prev => ({ ...prev, numero: text }))}
                        max={5}
                    />
                </View>
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={salvarEndereco}
                >
                    <Text style={styles.saveButtonText}>Salvar Endereço</Text>
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
        gap: 10,
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
