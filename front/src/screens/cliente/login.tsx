import { View, KeyboardAvoidingView, Image, StyleSheet } from 'react-native';
import { themes } from "../../../assets/colors/themes";
import { Textinput } from '../../components/textInput';
import { Button } from '../../components/button';
import { TextLink } from '../../components/textLink';

export default function Login(){
    return(
        <KeyboardAvoidingView style={styles.background}>
            <View style={styles.viewLogo}>
                <Image source={require('../../../assets/icon.png')} />
            </View>

            <View style={styles.container}>
                <Textinput tipo="Email"/>
                <Textinput tipo="Senha"/>
                <Button title="Acessar" />
                <TextLink texto="Esqueceu a senha?" />
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
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: '90%'
    },
    btn: {
        
    }
})