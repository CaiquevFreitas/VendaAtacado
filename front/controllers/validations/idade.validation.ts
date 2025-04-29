import { Alert } from "react-native";

export function calcularIdade(dataNascimento: Date): boolean{
    const dataAtual = new Date();

    let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();

    const mesAtual = dataAtual.getMonth();
    const diaAtual = dataAtual.getDate();
    const mesNascimento = dataNascimento.getMonth();
    const diaNascimento = dataNascimento.getDate();

    if(mesAtual < mesNascimento || (mesAtual == mesNascimento && diaAtual < diaNascimento)){
        idade--;
    }
    if(idade < 18){
        Alert.alert("Menor de idade", "É necessário ter 18 anos ou mais para se cadastrar!")
        return false;
    }else{
        return true;
    }
    
}