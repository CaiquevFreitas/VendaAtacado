import { themes } from "../../../assets/colors/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    button: {
        width: "100%",
        height: 52,
        backgroundColor: themes.colors.white,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: themes.colors.primary
    }
})
