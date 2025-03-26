import { themes } from "@/assets/colors/themes";
import { View, Text, StyleSheet } from "react-native";

export default function Perfil(){
    return (
        <View style={styles.container}>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themes.colors.primary
    }
})