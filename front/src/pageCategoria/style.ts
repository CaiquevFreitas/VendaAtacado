import { StyleSheet } from 'react-native';
import { themes } from '../../assets/colors/themes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: themes.colors.primary
  },
  backButton: {
    padding: 8
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center'
  },
  headerRight: {
    width: 40
  },
  content: {
    flex: 1,
    paddingHorizontal: 16
  },
  infoSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  totalProdutos: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500'
  },
  produtosContainer: {
    paddingVertical: 16
  },
  produtosRow: {
    justifyContent: 'space-between',
    marginBottom: 16
  },
  produtoCard: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  produtoImagem: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8
  },
  produtoInfo: {
    flex: 1
  },
  produtoNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 18
  },
  produtoPreco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themes.colors.primary,
    marginBottom: 8
  },
  lojaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  logoLoja: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6
  },
  nomeLoja: {
    fontSize: 12,
    color: '#666',
    flex: 1
  },
  avaliacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  notaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  avaliacoesText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 2
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 32
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24
  },
  backButtonText: {
    fontSize: 16,
    color: themes.colors.primary,
    fontWeight: '600'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22
  }
});

export default styles;
