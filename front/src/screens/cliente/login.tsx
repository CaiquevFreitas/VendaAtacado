import { View, KeyboardAvoidingView, Image, StyleSheet } from 'react-native';
import { themes } from "../../../assets/colors/themes";
import { Textinput } from '../../components/textInput';
import { Button } from '../../components/button';
import { TextLink } from '../../components/textLink';

export default function Login(){
    return(
        <KeyboardAvoidingView style={styles.background}>
            <View style={styles.viewLogo}>
                <Image style={styles.img} source={require('../../../assets/icon.png')} />
            </View>

            <View style={styles.container}>
                <Textinput tipo="Email"/>
                <Textinput tipo="Senha"/>
                <Button title="Acessar" />
                <View style={styles.viewLinks}>
                    <TextLink texto="Esqueceu a senha?" />
                    <TextLink texto="Cadastre-se" />
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    background:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themes.colors.primary
    },
    viewLogo:{
        flex: 1,
        justifyContent: "center"
    },
    img:{
        height: 123,
        width: 252
    },
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        width: '90%',
        gap: 10
    },
    viewLinks: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between"
    }
})