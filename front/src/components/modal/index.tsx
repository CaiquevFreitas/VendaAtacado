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
import { editarProduto } from '../../../controllers/requests/editarProduto';
import API_URL from '../../../controllers/requests/api.url';


type Produto = {
    id: number;
    nome: string;
    valor: number;
    estoque: number;
    imagem: string;
    categoria: string;
    status?: boolean;
    descricao?: string;
};

interface ModalProdutoProps {
    visible: boolean;
    onSuccess: () => void;
    onClose: () => void;
    produtoParaEditar?: Produto | null;
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

export default function ModalProduto({ visible, onSuccess, onClose, produtoParaEditar }: ModalProdutoProps) {
    const [nomeProduto, setNomeProduto] = useState('');
    const [categoria, setCategoria] = useState(categorias[0]);
    const [preco, setPreco] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imagem, setImagem] = useState<string | null>(null);
    const [status, setStatus] = useState(true);

    const isEditMode = !!produtoParaEditar;

    React.useEffect(() => {
        if (isEditMode) {
            setNomeProduto(produtoParaEditar.nome);
            setCategoria(produtoParaEditar.categoria);
            setPreco(String(produtoParaEditar.valor));
            setQuantidade(String(produtoParaEditar.estoque));
            setDescricao(produtoParaEditar.descricao || '');
            setImagem(produtoParaEditar.imagem ? `${API_URL}${produtoParaEditar.imagem}` : null);
            setStatus(produtoParaEditar.status !== undefined ? produtoParaEditar.status : true);
        } else {
            limparFormulario();
        }
    }, [produtoParaEditar, visible]);

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
            formData.append('estoque', quantidade);
            formData.append('descricao', descricao);

            if (imagem && !imagem.startsWith('http')) {
                const filename = imagem.split('/').pop()!;
                const type = `image/${filename.split('.').pop()}`;
                formData.append('imagem', { uri: imagem, name: filename, type } as any);
            }

            if (isEditMode) {
                formData.append('status', status.toString());
                await editarProduto(produtoParaEditar.id, formData);
            } else {
                formData.append('fk_idLoja', id);
                await cadastrarProduto(formData);
            }
            limparFormulario();
            onSuccess();
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Não foi possível salvar o produto');
        }
    };

    const limparFormulario = () => {
        setNomeProduto('');
        setCategoria(categorias[0]);
        setPreco('');
        setQuantidade('');
        setDescricao('');
        setImagem(null);
        setStatus(true);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{isEditMode ? 'Editar Produto' : 'Cadastrar Produto'}</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color={themes.colors.secondary} />
                        </TouchableOpacity>
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={80}
                    >
                        <ScrollView
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        >
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
                                    <Text style={styles.label}>Descrição</Text>
                                    <TextInput
                                        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                                        value={descricao}
                                        onChangeText={setDescricao}
                                        placeholder="Digite a descrição do produto"
                                        multiline
                                        numberOfLines={3}
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

                                {isEditMode && (
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Status do Produto</Text>
                                        <View style={styles.statusContainer}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.statusButton,
                                                    status ? styles.statusActive : styles.statusInactive
                                                ]}
                                                onPress={() => setStatus(true)}
                                            >
                                                <Text style={[
                                                    styles.statusButtonText,
                                                    status ? styles.statusActiveText : styles.statusInactiveText
                                                ]}>
                                                    Ativo
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    styles.statusButton,
                                                    !status ? styles.statusActive : styles.statusInactive
                                                ]}
                                                onPress={() => setStatus(false)}
                                            >
                                                <Text style={[
                                                    styles.statusButtonText,
                                                    !status ? styles.statusActiveText : styles.statusInactiveText
                                                ]}>
                                                    Inativo
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                    <Text style={styles.submitButtonText}>{isEditMode ? 'Salvar Alterações' : 'Cadastrar'}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </View>
        </Modal>
    );
}
