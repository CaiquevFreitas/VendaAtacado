import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adicionarCarrinho } from '../../../controllers/requests/adicionarCarrinho';  

interface ModalAddCarrinhoProps {
  visible: boolean;
  onClose: () => void;
  idProduto: number;
  produto: {
    nome: string;
    imagem: string;
    preco: number;
    estoque: number;
  };
  onConfirmar?: (quantidade: number) => void;
}

const ModalAddCarrinho: React.FC<ModalAddCarrinhoProps> = ({ visible, onClose, idProduto, produto, onConfirmar }) => {
  const [quantidade, setQuantidade] = useState(1);

  const aumentar = () => {
    if (quantidade < produto.estoque) setQuantidade(q => q + 1);
  };
  const diminuir = () => {
    if (quantidade > 1) setQuantidade(q => q - 1);
  };
  
  const handleAddCarrinho = async () => {
    try {
      const idCarrinhoStr = await AsyncStorage.getItem('idCarrinho');
      if (!idCarrinhoStr) throw new Error('Carrinho não encontrado');
      const idCarrinho = Number(idCarrinhoStr);
      await adicionarCarrinho(idCarrinho, idProduto, quantidade, produto.preco);
      Alert.alert('Sucesso', 'Produto adicionado ao carrinho!');
      setQuantidade(1);
      onClose();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao adicionar ao carrinho');
    }
  };
  
  const handleClose = () => {
    setQuantidade(1);
    onClose();
  };

  const handleComprarAgora = () => {
    if (onConfirmar) {
      onConfirmar(quantidade);
      setQuantidade(1);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="#888" />
          </TouchableOpacity>
          <Image source={{ uri: produto.imagem }} style={styles.imagemProduto} />
          <Text style={styles.nomeProduto}>{produto.nome}</Text>
          <Text style={styles.preco}>R${produto.preco.toFixed(2)}</Text>
          <Text style={styles.estoque}>Em estoque: {produto.estoque}</Text>
          <View style={styles.quantidadeRow}>
            <TouchableOpacity style={styles.qtdBtn} onPress={diminuir} disabled={quantidade === 1}>
              <Ionicons name="remove-circle-outline" size={28} color={quantidade === 1 ? '#ccc' : '#222'} />
            </TouchableOpacity>
            <Text style={styles.quantidade}>{quantidade}</Text>
            <TouchableOpacity style={styles.qtdBtn} onPress={aumentar} disabled={quantidade === produto.estoque}>
              <Ionicons name="add-circle-outline" size={28} color={quantidade === produto.estoque ? '#ccc' : '#222'} />
            </TouchableOpacity>
          </View>
          {onConfirmar ? (
            <TouchableOpacity style={styles.addBtn} onPress={handleComprarAgora} disabled={produto.estoque === 0}>
              <Text style={styles.addBtnText}>{produto.estoque === 0 ? 'Sem estoque' : 'Comprar agora'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.addBtn} onPress={handleAddCarrinho} disabled={produto.estoque === 0}>
              <Text style={styles.addBtnText}>{produto.estoque === 0 ? 'Sem estoque' : 'Adicionar ao carrinho'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ModalAddCarrinho;
