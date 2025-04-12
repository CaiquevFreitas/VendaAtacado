import { themes } from "../../../assets/colors/themes";
import { Image, View, StyleSheet } from "react-native";
import { Button } from "../../components/button";

export default function Perfil(){
    return (
        <View style={styles.container}>
            <Image style={styles.img} source={require('../../../assets/icon.png')} />
            <Button title="Entrar como Cliente"/>
            <Button  title="Entrar como Loja"/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themes.colors.primary,
        gap: 30,
        padding: 30
    },
    img: {
        height: 123,
        width: 252
    }
})