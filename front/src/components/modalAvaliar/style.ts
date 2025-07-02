import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: 320,
        alignItems: 'center',
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    nome: {
        fontSize: 16,
        marginBottom: 16,
        color: '#333',
    },
    estrelasContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        minHeight: 60,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginBottom: 12,
        textAlignVertical: 'top',
    },
    botoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
    },
    botaoCancelar: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginRight: 8,
    },
    textoCancelar: {
        color: '#333',
        fontWeight: 'bold',
    },
    botaoEnviar: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    textoEnviar: {
        color: 'white',
        fontWeight: 'bold',
    },
    feedback: {
        color: '#4CAF50',
        marginBottom: 8,
        fontWeight: 'bold',
    },
});

