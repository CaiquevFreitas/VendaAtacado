import { View, KeyboardAvoidingView, Image, StyleSheet, Alert } from 'react-native';
import { themes } from "../../../assets/colors/themes";
import { Textinput } from '../../components/textInput';
import { Button } from '../../components/button';
import { TextLink } from '../../components/textLink';
import { useState } from 'react';

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from "../../../types";
import { verificarEmail } from '../../../controllers/validations/email.validation';
import { logar } from '../../requests/loginCliente';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Login(){
    const [email,setEmail] = useState('');
    const [senha,setSenha] = useState('');
    const navigation = useNavigation<NavigationProp>();

    function handleLogin(){
        if(!email || !senha){
            Alert.alert("Atenção","Preencha todos os campos")
        }else if(verificarEmail(email)){
            logar(email,senha)
        }
    }

    return(
        <KeyboardAvoidingView style={styles.background}>
            <View style={styles.viewLogo}>
                <Image style={styles.img} source={require('../../../assets/icon.png')} />
            </View>

            <View style={styles.container}>
                <Textinput tipo='email-address' descricao="Email"/>
                <Textinput tipo='default' descricao="Senha" isSenha={true}/>
                <Button title="Acessar" />
                <View style={styles.viewLinks}>
                    <TextLink texto="Esqueceu a senha?" />
                    <TextLink texto="Cadastre-se" onPress={() => navigation.navigate("Cadastro")}/>
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
