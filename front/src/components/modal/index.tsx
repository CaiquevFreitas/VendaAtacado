import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './style';
import { themes } from '../../../assets/colors/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cadastrarProduto } from '../../../controllers/requests/cadastrarProduto';

interface ModalCadastroProdutoProps {
    visible: boolean;
    onProdutoCadastrado: () => void;
    onClose: () => void;
}

const categorias = [
    'Frutas',
    'Vegetais',
    'Doces',
    'Almoço',
    'Bebidas',
    'Verduras',
    'Carnes',
    'Limpeza',
    'Bolos',
    'Salgados'
];

export default function ModalCadastroProduto({ visible, onProdutoCadastrado, onClose }: ModalCadastroProdutoProps) {
    const [nomeProduto, setNomeProduto] = useState('');
    const [categoria, setCategoria] = useState(categorias[0]);
    const [preco, setPreco] = useState('');
    const [quantidade, setQuantidade] = useState('');
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

    const handleSubmit = async () => {
        if (!nomeProduto || !categoria || !preco || !quantidade) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        try {
            const lojaData = await AsyncStorage.getItem('lojaData');
            if (!lojaData) {
                Alert.alert('Erro', 'Dados da loja não encontrados');
                return;
            }

            const { id } = JSON.parse(lojaData);

            const formData = new FormData();
            formData.append('nomeProduto', nomeProduto);
            formData.append('categoria', categoria);
            formData.append('preco', preco);
            formData.append('quantidade', quantidade);
            formData.append('fk_idLoja', id);

            if (imagem) {
                const filename = imagem.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const type = match ? `image/${match[1]}` : 'image';

                formData.append('imagem', {
                    uri: imagem,
                    name: filename,
                    type
                } as any);
            }

            await cadastrarProduto(formData);
            limparFormulario();
            onProdutoCadastrado();
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Não foi possível cadastrar o produto');
        }
    };

    const limparFormulario = () => {
        setNomeProduto('');
        setCategoria(categorias[0]);
        setPreco('');
        setQuantidade('');
        setImagem(null);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Cadastrar Produto</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Ionicons name="close" size={24} color={themes.colors.secondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Imagem do Produto</Text>
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
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Nome do Produto</Text>
                                <TextInput
                                    style={styles.input}
                                    value={nomeProduto}
                                    onChangeText={setNomeProduto}
                                    placeholder="Digite o nome do produto"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Categoria</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={categoria}
                                        onValueChange={(itemValue) => setCategoria(itemValue)}
                                        style={styles.picker}
                                    >
                                        {categorias.map((cat) => (
                                            <Picker.Item key={cat} label={cat} value={cat} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Preço</Text>
                                <TextInput
                                    style={styles.input}
                                    value={preco}
                                    onChangeText={setPreco}
                                    placeholder="Digite o preço"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Quantidade em Estoque</Text>
                                <TextInput
                                    style={styles.input}
                                    value={quantidade}
                                    onChangeText={setQuantidade}
                                    placeholder="Digite a quantidade"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>Cadastrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}
