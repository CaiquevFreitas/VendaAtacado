import { StyleSheet } from 'react-native';
import { themes } from '../../../assets/colors/themes';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 4,
  },
  imagemProduto: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  nomeProduto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  preco: {
    color: themes.colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  estoque: {
    color: '#888',
    fontSize: 14,
    marginBottom: 10,
  },
  quantidadeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10,
  },
  qtdBtn: {
    padding: 4,
  },
  quantidade: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginHorizontal: 12,
    minWidth: 32,
    textAlign: 'center',
  },
  addBtn: {
    backgroundColor: themes.colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;
