import { themes } from "../../../assets/colors/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    button: {
        width: "90%",
        height: 60,
        backgroundColor: themes.colors.white,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 7,
        marginBottom: 20
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: themes.colors.black
    }
})