import { themes } from "../../../assets/colors/themes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        position: 'relative',
        marginBottom: 15,
    },
    input:{
        backgroundColor: themes.colors.white,
        width: '100%',
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
    },
    inputComIcone: {
        paddingRight: 50, 
    },
    iconContainer: {
        position: 'absolute',
        right: 12,
        height: '100%',
        justifyContent: 'center',
    }
})