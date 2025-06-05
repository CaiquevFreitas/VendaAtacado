import { themes } from "../../../assets/colors/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    input:{
        backgroundColor: themes.colors.white,
        width: '100%',
        marginBottom: 15,
        color: themes.colors.black,
        fontSize: 16,
        borderRadius: 10,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2
    }
})