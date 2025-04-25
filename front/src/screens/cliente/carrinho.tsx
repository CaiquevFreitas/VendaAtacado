import { View, Text, StyleSheet } from "react-native";
import { themes } from "../../../assets/colors/themes";

export default function Compras() {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Minhas compras</Text>

            <View style={styles.alertaContainer}>
                <Text style={styles.alertaIcon}>!</Text>
                <Text style={styles.alertaTexto}>Você ainda não fez nenhuma compra</Text>
                <Text style={styles.alertaTexto}>Experimente comprar nas</Text>
                <Text style={styles.alertaTexto}>lojas parceiras</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.primary,
        padding: 20
    },
    titulo: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30
    },
    alertaContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alertaIcon: {
        color: '#fff',
        fontSize: 80,
        marginBottom: 20
    },
    alertaTexto: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    }
});
