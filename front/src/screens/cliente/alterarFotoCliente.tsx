import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { themes } from '../../../assets/colors/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AlterarFotoCliente() {
    const navigation = useNavigation<NavigationProp>();
    const [foto, setFoto] = useState<string | null>(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Erro', 'Precisamos de permissão para acessar suas imagens');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setFoto(result.assets[0].uri);
        }
    };

    const tirarFoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Erro', 'Precisamos de permissão para acessar sua câmera');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setFoto(result.assets[0].uri);
        }
    };

    const handleSalvar = async () => {
        if (!foto) {
            Alert.alert('Erro', 'Por favor, selecione uma foto');
            return;
        }

        try {
            const clienteData = await AsyncStorage.getItem('clienteData');
            const cliente = clienteData ? JSON.parse(clienteData) : {};
            
            const dadosAtualizados = {
                ...cliente,
                foto: foto
            };

            await AsyncStorage.setItem('clienteData', JSON.stringify(dadosAtualizados));
            Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar foto:', error);
            Alert.alert('Erro', 'Não foi possível salvar a foto');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={themes.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Alterar Foto de Perfil</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.photoContainer}>
                    {foto ? (
                        <Image source={{ uri: foto }} style={styles.photoPreview} />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Ionicons name="person" size={80} color={themes.colors.secondary} />
                            <Text style={styles.photoPlaceholderText}>Nenhuma foto selecionada</Text>
                        </View>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.optionButton} onPress={tirarFoto}>
                        <Ionicons name="camera" size={24} color={themes.colors.white} />
                        <Text style={styles.optionButtonText}>Tirar Foto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
                        <Ionicons name="images" size={24} color={themes.colors.white} />
                        <Text style={styles.optionButtonText}>Escolher da Galeria</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={[styles.saveButton, !foto && styles.saveButtonDisabled]} 
                    onPress={handleSalvar}
                    disabled={!foto}
                >
                    <Text style={styles.saveButtonText}>Salvar Foto</Text>
                </TouchableOpacity>
            </View>
        </View>
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
        alignItems: 'center',
    },
    photoContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginBottom: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    photoPreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    photoPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    photoPlaceholderText: {
        marginTop: 10,
        color: themes.colors.secondary,
        fontSize: 14,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
        marginBottom: 30,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themes.colors.primary,
        padding: 15,
        borderRadius: 8,
        gap: 10,
    },
    optionButtonText: {
        color: themes.colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: themes.colors.primary,
        padding: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#ccc',
    },
    saveButtonText: {
        color: themes.colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 