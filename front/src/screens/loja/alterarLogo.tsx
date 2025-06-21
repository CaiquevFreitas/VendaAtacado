import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { themes } from '../../../assets/colors/themes';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { editarLogo } from '../../../controllers/requests/editarLogo';

export default function AlterarLogo() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [imagem, setImagem] = useState<string | null>(null);

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
            quality: 0.5,
        });
        if (!result.canceled) {
            setImagem(result.assets[0].uri);
        }
    };

    const handleSalvar = async () => {
        if (!imagem) {
            Alert.alert('Erro', 'Selecione uma imagem para a logo.');
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
            
            const data = await editarLogo(lojaData.id, imagem);
            lojaData.logo = data.logo;
    
            await AsyncStorage.setItem('lojaData', JSON.stringify(lojaData));
            Alert.alert('Sucesso', 'Logo alterada com sucesso!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Não foi possível alterar a logo.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={themes.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Alterar Logo da Loja</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.label}>Logo da Loja</Text>
                <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                    {imagem ? (
                        <Image source={{ uri: imagem }} style={styles.imagePreview} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="camera" size={32} color={themes.colors.secondary} />
                            <Text style={styles.imagePlaceholderText}>Selecionar imagem</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
                    <Text style={styles.saveButtonText}>Salvar Logo</Text>
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
        shadowOffset: { width: 0, height: 2 },
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    imagePickerButton: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        overflow: 'hidden',
    },
    imagePreview: {
        width: 140,
        height: 140,
        borderRadius: 70,
    },
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePlaceholderText: {
        color: themes.colors.secondary,
        fontSize: 13,
        marginTop: 5,
    },
    saveButton: {
        backgroundColor: themes.colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

