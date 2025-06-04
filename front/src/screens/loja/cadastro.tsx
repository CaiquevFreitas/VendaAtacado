import { View, KeyboardAvoidingView, StyleSheet, ScrollView, Text, Alert, Platform } from 'react-native';
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CadastroLoja() {
    const navigation = useNavigation<NavigationProp>();

    const [nomeLoja, setNomeLoja] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [horarioAbertura, setHorarioAbertura] = useState<Date | undefined>(undefined);
    const [horarioFechamento, setHorarioFechamento] = useState<Date | undefined>(undefined);    
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [nomeVendedor, setNomeVendedor] = useState('');
    const [dataNascimento, setDataNascimento] = useState<Date | undefined>(undefined);

    async function handleCadastro() {
        if (!nomeLoja || !cnpj || !horarioAbertura || !horarioFechamento || !telefone || !email || !senha || !nomeVendedor || !dataNascimento || !confirmarSenha) {
            Alert.alert("Atenção", "Preencha todos os campos");
        } else if (verificarEmail(email) && calcularIdade(dataNascimento)) {
            cadastrarLoja(
                nomeLoja,
                nomeVendedor,
                cnpj,
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
        <KeyboardAvoidingView 
            style={styles.background}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <Text style={styles.titulo}>Cadastro da Loja</Text>
                    
                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Dados da Loja</Text>
                        <Textinput tipo="default" descricao="Nome da Loja" onChangeText={setNomeLoja} />
                        <Textinput tipo="numeric" descricao="CNPJ (apenas números)" onChangeText={setCnpj} max={11} />
                        <View style={styles.rowContainer}>
                            <View style={styles.halfWidth}>
                                <TimeInput descricao='Horário de Abertura' onChange={setHorarioAbertura} />
                            </View>
                            <View style={styles.halfWidth}>
                                <TimeInput descricao='Horário de Fechamento' onChange={setHorarioFechamento} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Dados do Proprietário</Text>
                        <Textinput tipo="default" descricao="Nome do Proprietário" onChangeText={setNomeVendedor} />
                        <DateInput descricao='Data de Nascimento' onChange={setDataNascimento} />
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
    background: {
        flex: 1,
        backgroundColor: themes.colors.primary
    },
    scrollContent: {
        flexGrow: 1,
        paddingVertical: 30,
        paddingHorizontal: 20
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        width: '100%',
        gap: 20
    },
    titulo: {
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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10
    },
    halfWidth: {
        flex: 1
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