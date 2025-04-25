import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { themes } from "../../../assets/colors/themes";

export default function Buscar() {
    const categorias = [
        'Frutas',
        'Vegetais',
        'Ferramentas',
        'Jogos',
        'Animais',
        'Rações',
        'Roupas',
        'Acessórios'
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>O que você está procurando?</Text>

            <TextInput
                placeholder="Pesquise seus produtos favoritos"
                placeholderTextColor="#ccc"
                style={styles.input}
            />

            <Text style={styles.subtitulo}>Categorias</Text>

            <ScrollView contentContainerStyle={styles.categoriasContainer}>
                {categorias.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.categoriaBox}>
                        <Text style={styles.categoriaTexto}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.primary,
        padding: 20
    },
    titulo: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
        marginBottom: 20,
        color: '#333'
    },
    subtitulo: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    categoriasContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    categoriaBox: {
        backgroundColor: themes.colors.secondary,
        width: '47%',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginBottom: 15,
        alignItems: 'center'
    },
    categoriaTexto: {
        color: '#fff',
        fontSize: 16
    }
});
