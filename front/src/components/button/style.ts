import { themes } from "../../../assets/colors/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    button: {
        width: "90%",
        height: 52,
        backgroundColor: themes.colors.secondary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 7
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: themes.colors.black
    }
})
