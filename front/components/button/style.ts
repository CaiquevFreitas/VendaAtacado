import { themes } from "@/assets/colors/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    button: {
        width: "100%",
        height: 52,
        backgroundColor: themes.colors.secondary,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: themes.colors.black
    }
})