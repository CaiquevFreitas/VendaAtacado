import { themes } from "../../../assets/colors/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    input:{
        backgroundColor: themes.colors.white,
        width: '90%',
        marginBottom: 15,
        color: themes.colors.black,
        fontSize: 17,
        borderRadius: 7,
        padding: 10
    }
})