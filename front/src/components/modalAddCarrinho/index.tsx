import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';

interface ModalAddCarrinhoProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (quantidade: number) => void;
  produto: {
    nome: string;
    imagem: string;
    preco: number;
    estoque: number;
  };
}

const ModalAddCarrinho: React.FC<ModalAddCarrinhoProps> = ({ visible, onClose, onAdd, produto }) => {
  const [quantidade, setQuantidade] = useState(1);

  const aumentar = () => {
    if (quantidade < produto.estoque) setQuantidade(q => q + 1);
  };
  const diminuir = () => {
    if (quantidade > 1) setQuantidade(q => q - 1);
  };
  const handleAdd = () => {
    onAdd(quantidade);
    setQuantidade(1);
    onClose();
  };
  const handleClose = () => {
    setQuantidade(1);
    onClose();
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
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd} disabled={produto.estoque === 0}>
            <Text style={styles.addBtnText}>{produto.estoque === 0 ? 'Sem estoque' : 'Adicionar ao carrinho'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalAddCarrinho;
