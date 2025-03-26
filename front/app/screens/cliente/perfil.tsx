import { themes } from "@/assets/colors/themes";
import { View, StyleSheet } from "react-native";
import { Button } from "@/components/button";

export default function Perfil(){
    return (
        <View style={styles.container}>
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
        gap: 20
    }
})