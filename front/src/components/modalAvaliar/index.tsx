import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ModalAvaliarProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (nota: number, comentario: string) => void;
    tipo: 'produto' | 'loja';
    nome: string;
    jaAvaliado?: boolean;
    feedback?: string;
    notaInicial?: number;
    comentarioInicial?: string;
}

export default function ModalAvaliar({ visible, onClose, onSubmit, tipo, nome, jaAvaliado, feedback, notaInicial = 0, comentarioInicial = '' }: ModalAvaliarProps) {
    const [nota, setNota] = useState(notaInicial);
    const [comentario, setComentario] = useState(comentarioInicial);
    const [enviando, setEnviando] = useState(false);

    const handleEnviar = async () => {
        if (nota < 1 || nota > 5) {
            Alert.alert('Atenção', 'Selecione uma nota de 1 a 5 estrelas.');
            return;
        }
        if (!comentario.trim()) {
            Alert.alert('Atenção', 'Digite um comentário.');
            return;
        }
        setEnviando(true);
        await onSubmit(nota, comentario);
        setEnviando(false);
        setNota(0);
        setComentario('');
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.titulo}>Avaliar {tipo === 'produto' ? 'Produto' : 'Loja'}</Text>
                    <Text style={styles.nome}>{nome}</Text>
                    <View style={styles.estrelasContainer}>
                        {[1,2,3,4,5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setNota(star)} disabled={jaAvaliado || enviando}>
                                <Ionicons name={star <= nota ? 'star' : 'star-outline'} size={32} color="#FFD700" />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu comentário..."
                        value={comentario}
                        onChangeText={setComentario}
                        editable={!jaAvaliado && !enviando}
                        multiline
                        maxLength={100}
                    />
                    {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
                    <View style={styles.botoes}>
                        <TouchableOpacity style={styles.botaoCancelar} onPress={onClose} disabled={enviando}>
                            <Text style={styles.textoCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botaoEnviar} onPress={handleEnviar} disabled={jaAvaliado || enviando}>
                            <Text style={styles.textoEnviar}>{enviando ? 'Enviando...' : 'Enviar'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '80%',
        alignItems: 'center',
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    nome: {
        fontSize: 16,
        marginBottom: 10,
    },
    estrelasContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    feedback: {
        marginBottom: 10,
    },
    botoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    botaoCancelar: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    botaoEnviar: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    textoCancelar: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    textoEnviar: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

