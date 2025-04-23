import { View, KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import { themes } from "../../../assets/colors/themes";
import { Textinput } from '../../components/textInput';
import { Button } from '../../components/button';
import { TextLink } from '../../components/textLink';
import { Text } from 'react-native';

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from "../../../types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Cadastro(){
    const navigation = useNavigation<NavigationProp>();

    return(
        <KeyboardAvoidingView style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.container}>
                    <Text style={styles.titulo}>Cadastro</Text>

                    <Textinput tipo="default" descricao="Nome Completo" />
                    <Textinput tipo="numeric" descricao="Data de Nascimento (DD/MM/AAAA)" />
                    <Textinput tipo="numeric" descricao="CPF (apenas números)"  />
                    <Textinput tipo="email-address" descricao="Email" />
                    <Textinput tipo="default" descricao="Senha" isSenha={true} />

                    <Button title="Cadastrar" />

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
