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
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { styles } from './style';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ModalCadastroProdutoProps {
    visible: boolean;
    onClose: () => void;
    onProdutoCadastrado: () => void;
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

export default function ModalCadastroProduto({ visible, onClose, onProdutoCadastrado }: ModalCadastroProdutoProps) {
    const [nomeProduto, setNomeProduto] = useState('');
    const [categoria, setCategoria] = useState(categorias[0]);
    const [preco, setPreco] = useState('');
    const [quantidade, setQuantidade] = useState('');

    const handleSubmit = async () => {
        if (!nomeProduto || !categoria || !preco || !quantidade) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        try {
            const novoProduto = {
                id: Date.now(),
                nome: nomeProduto,
                categoria,
                valor: parseFloat(preco),
                quantidade: parseInt(quantidade),
                imagem: 'https://via.placeholder.com/150' // Imagem padrão temporária
            };

            const produtosString = await AsyncStorage.getItem('produtos');
            const produtos = produtosString ? JSON.parse(produtosString) : [];
            
            await AsyncStorage.setItem('produtos', JSON.stringify([...produtos, novoProduto]));
            
            Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
            limparFormulario();
            onProdutoCadastrado();
            onClose();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível cadastrar o produto');
        }
    };

    const limparFormulario = () => {
        setNomeProduto('');
        setCategoria(categorias[0]);
        setPreco('');
        setQuantidade('');
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
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
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formContainer}>
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
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}
