import { StyleSheet } from 'react-native';
import { themes } from '../../../assets/colors/themes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imagemProduto: {
    width: '100%',
    height: 220,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
  },
  infoSection: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  nomeProduto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  precoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  preco: {
    color: '#E53935',
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 8,
  },
  precoOriginal: {
    color: '#888',
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  desconto: {
    color: '#fff',
    backgroundColor: '#E53935',
    fontWeight: 'bold',
    fontSize: 13,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  vendidos: {
    color: '#666',
    fontSize: 13,
    marginBottom: 2,
  },
  section: {
    marginTop: 18,
    paddingHorizontal: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: themes.colors.primary,
    marginBottom: 10,
  },
  semAvaliacao: {
    color: '#888',
    fontStyle: 'italic',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  avaliacaoCard: {
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  avaliacaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  avaliadorNome: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 15,
    marginRight: 8,
  },
  notaText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 2,
  },
  dataAvaliacao: {
    color: '#888',
    fontSize: 12,
    marginLeft: 8,
  },
  comentario: {
    color: '#444',
    fontSize: 14,
    marginTop: 2,
  },
  fotosRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 8,
  },
  fotoAvaliacao: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    padding: 10,
    paddingBottom: 18,
    justifyContent: 'space-between',
  },
  carrinhoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themes.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
  },
  carrinhoBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  comprarBtn: {
    backgroundColor: '#E53935',
    borderRadius: 8,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  comprarBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;
