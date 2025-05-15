import { View, KeyboardAvoidingView, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { themes } from "../../../assets/colors/themes";
import { Textinput } from '../../components/textInput/index';
import { Button } from '../../components/button';
import { TextLink } from '../../components/textLink';
import { DateInput } from '../../components/textInput/dateInput';
import { TimeInput } from '../../components/textInput/timeInput';

import { useState} from 'react';
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from "../../../types";

import { cadastrarLoja } from '../../requests/cadastrarLoja';
import { verificarEmail } from '../../../controllers/validations/email.validation';
import { calcularIdade } from '../../../controllers/validations/idade.validation';
import { validarSenha } from '../../../controllers/validations/senha.validation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CadastroLoja() {
    const navigation = useNavigation<NavigationProp>();

    const [nomeLoja, setNomeLoja] = useState('');
    const [cpf, setCpf] = useState('');
    const [horarioAbertura, setHorarioAbertura] = useState<Date | undefined>(undefined);
    const [horarioFechamento, setHorarioFechamento] = useState<Date | undefined>(undefined);    
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [nomeVendedor, setNomeVendedor] = useState('');
    const [dataNascimento, setDataNascimento] = useState<Date | undefined>(undefined);

    async function handleCadastro() {
        if (
          !nomeLoja ||
          !cpf ||
          !horarioAbertura ||
          !horarioFechamento ||
          !telefone ||
          !email ||
          !senha ||
          !nomeVendedor ||
          !dataNascimento ||
          !confirmarSenha
        ) {
          Alert.alert("Atenção", "Preencha todos os campos");
        } else if (
          verificarEmail(email) &&
          calcularIdade(dataNascimento) &&
          validarSenha(senha, confirmarSenha)
        ) {
          await cadastrarLoja(
            nomeLoja,
            nomeVendedor,
            cpf,
            dataNascimento,
            horarioAbertura,
            horarioFechamento,
            telefone,
            email,
            senha
          );
        } 
    }

    return (
        <KeyboardAvoidingView style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <Text style={styles.titulo}>Cadastro da Loja</Text>

                    <Textinput tipo="default" descricao="Nome da Loja" onChangeText={setNomeLoja} />
                    <Textinput tipo="default" descricao="Nome do Proprietário" onChangeText={setNomeVendedor} />
                    <Textinput tipo="numeric" descricao="CPF (apenas números)" onChangeText={setCpf} max={11} />

                    <DateInput descricao='Data de Nascimento' onChange={setDataNascimento} />
                    <TimeInput descricao='Horário de Abertura' onChange={setHorarioAbertura} value={horarioAbertura} />
                    <TimeInput descricao='Horário de Fechamento' onChange={setHorarioFechamento} value={horarioFechamento} />
                    <Textinput tipo="phone-pad" descricao="Telefone" onChangeText={setTelefone} max={11} />
                    <Textinput tipo="email-address" descricao="Email" onChangeText={setEmail} />
                    <Textinput tipo="default" descricao="Senha (Max: 8 caracteres)" isSenha={true} onChangeText={setSenha} max={8} />
                    <Textinput tipo="default" descricao="Confirmar Senha" isSenha={true} onChangeText={setConfirmarSenha} max={8} />


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
