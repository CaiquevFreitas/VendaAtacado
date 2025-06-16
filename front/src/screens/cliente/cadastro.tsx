import { View, KeyboardAvoidingView, StyleSheet, ScrollView, Text, Alert, Platform } from 'react-native';
import { themes } from "../../../assets/colors/themes";
import { Textinput } from '../../components/textInput/index';
import { Button } from '../../components/button';
import { TextLink } from '../../components/textLink';
import { DateInput } from '../../components/textInput/dateInput';
import { useState } from 'react';

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from "../../../types";

import { cadastrar } from '../../../controllers/requests/cadastrarCliente';
import { calcularIdade } from '../../../controllers/validations/idade.validation';
import { verificarEmail } from '../../../controllers/validations/email.validation';
import { validarInputs } from '../../../controllers/validations/inputs.validation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Cadastro(){
    const navigation = useNavigation<NavigationProp>();
    const [nome, setNome] = useState('');
    const [data, setData] = useState<Date | undefined>(undefined);
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [telefone, setTelefone] = useState('');

    function handleCadastro(){
        if(!data || !nome || !cpf || !email || !senha || !confirmarSenha || !telefone){
            Alert.alert("Atenção","Preencha todos os campos")
        }else if(senha !== confirmarSenha){
            Alert.alert("Atenção","As senhas não conferem")
        }else if(verificarEmail(email) && calcularIdade(data) && validarInputs(senha, telefone, cpf)){
            cadastrar(nome,data,cpf,email,senha, telefone)
            navigation.navigate("Login")
        }
    }

    return(
        <KeyboardAvoidingView 
            style={styles.background}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <Text style={styles.titulo}>Cadastro</Text>

                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Dados Pessoais</Text>
                        <Textinput tipo="default" descricao="Nome Completo" onChangeText={setNome} />
                        <DateInput descricao='Data de Nascimento' onChange={setData} />
                        <Textinput tipo="numeric" descricao="CPF (apenas números)" onChangeText={setCpf} max={11} />
                        <Textinput tipo="phone-pad" descricao="Telefone" onChangeText={setTelefone} max={11} />
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Dados de Acesso</Text>
                        <Textinput tipo="email-address" descricao="Email" onChangeText={setEmail} />
                        <Textinput tipo="default" descricao="Senha (Max: 8 caracteres)" isSenha={true} onChangeText={setSenha} max={8} />
                        <Textinput tipo="default" descricao="Confirmar Senha" isSenha={true} onChangeText={setConfirmarSenha} max={8} />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button title="Cadastrar" onPress={handleCadastro} />
                        <View style={styles.viewLinks}>
                            <TextLink texto="Já possui uma conta?" onPress={() => navigation.navigate("Login")} />
                        </View>
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
        paddingVertical: 30,
        paddingHorizontal: 20
    },
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        width: '100%',
        gap: 20
    },
    titulo:{
        color: themes.colors.white,
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    formSection: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10
    },
    sectionTitle: {
        color: themes.colors.white,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10
    },
    viewLinks: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15
    }
});
