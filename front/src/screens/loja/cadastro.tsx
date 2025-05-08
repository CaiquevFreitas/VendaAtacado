import { View, KeyboardAvoidingView, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { themes } from "../../../assets/colors/themes";
import { Textinput } from '../../components/textInput/index';
import { Button } from '../../components/button';
import { TextLink } from '../../components/textLink';

import { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from "../../../types";

import { cadastrarLoja } from '../../requests/cadastrarLoja';

import { verificarEmail } from '../../../controllers/validations/email.validation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CadastroLoja() {
    const navigation = useNavigation<NavigationProp>();

    const [nomeLoja, setNomeLoja] = useState('');
    const [cpf, setCpf] = useState('');
    const [endereco, setEndereco] = useState('');
    const [horario, setHorario] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    function handleCadastro() {
        if (!nomeLoja || !cpf || !endereco || !horario || !telefone || !email || !senha) {
            Alert.alert("Atenção", "Preencha todos os campos");
        } else if (!verificarEmail(email)) {
            Alert.alert("Atenção", "Email inválido");
        } else {
           
            cadastrarLoja(nomeLoja, cpf, endereco, horario, telefone, email, senha);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <Text style={styles.titulo}>Cadastro da Loja</Text>

                    <Textinput tipo="default" descricao="Nome da Loja" onChangeText={setNomeLoja} />
                    <Textinput tipo="numeric" descricao="CPF (apenas números)" onChangeText={setCpf} max={11} />
                    <Textinput tipo="default" descricao="Endereço" onChangeText={setEndereco} />
                    <Textinput tipo="default" descricao="Horário de Funcionamento" onChangeText={setHorario} />
                    <Textinput tipo="phone-pad" descricao="Telefone" onChangeText={setTelefone} max={11} />
                    <Textinput tipo="email-address" descricao="Email" onChangeText={setEmail} />
                    <Textinput tipo="default" descricao="Senha (Max: 8 caracteres)" isSenha={true} onChangeText={setSenha} max={8} />

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
    background: {
        flex: 1,
        backgroundColor: themes.colors.primary
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20
    },
    container: {
        alignItems: "center",
        justifyContent: "flex-start",
        width: '90%',
        gap: 10
    },
    titulo: {
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
});
