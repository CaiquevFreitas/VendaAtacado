import { View, KeyboardAvoidingView, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { themes } from "../../../assets/colors/themes";
import { Textinput } from '../../components/textInput/index';
import { Button } from '../../components/button';
import { TextLink } from '../../components/textLink';
import { DateInput } from '../../components/textInput/dateInput';
import { useState } from 'react';

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from "../../../types";

import { cadastrar } from '../../requests/cadastrar';
import { calcularIdade } from '../../../controllers/validations/idade.validation';
import { verificarEmail } from '../../../controllers/validations/email.validation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Cadastro(){
    const navigation = useNavigation<NavigationProp>();
    const [nome, setNome] = useState('');
    const [data, setData] = useState<Date | undefined>(undefined);

    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    function handleCadastro(){
        if(!data || !nome || !cpf || !email || !senha){
            Alert.alert("Atenção","Preencha todos os campos")
        }else{
            /*verificarEmail(email)
            calcularIdade(data);
            cadastrar(nome,data,cpf,email,senha)*/
        }
    }

    return(
        <KeyboardAvoidingView style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.container}>
                    <Text style={styles.titulo}>Cadastro</Text>

                    <Textinput tipo="default" descricao="Nome Completo" onChangeText={setNome} />
                    <DateInput descricao='Data de Nascimento' onChange={setData} />
                    <Textinput tipo="numeric" descricao="CPF (apenas números)" onChangeText={setCpf} />
                    <Textinput tipo="email-address" descricao="Email" onChangeText={setEmail} />
                    <Textinput tipo="default" descricao="Senha (Max: 8 caracteres)" isSenha={true} onChangeText={setSenha} maxSenha={8} />

                    <Button title="Cadastrar" onPress={handleCadastro} />

                    <View style={styles.viewLinks}>
                    <TextLink texto="Já possui uma conta?" onPress={() => navigation.navigate("Login")} />
                    </View>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    background:{
        flex: 1,
        backgroundColor: themes.colors.primary
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20
    },
    container:{
        alignItems: "center",
        justifyContent: "flex-start",
        width: '90%',
        gap: 10
    },
    titulo:{
        color: themes.colors.white,
        fontSize: 28,
        marginBottom: 20
    },
    viewLinks: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15
    }
})
