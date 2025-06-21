import { Alert } from "react-native";

export function validarHorario(horarioAbertura: Date, horarioFechamento: Date): boolean {

    if(horarioAbertura >= horarioFechamento){
        Alert.alert('Erro', 'O horário de fechamento deve ser maior que o horário de abertura');
        return false;
    }

    return true;
}