import { Alert } from "react-native";

export function validarInputs(senha: string, telefone: string, cpf?: string, cnpj?: string): boolean{
    
    
    if(cpf && !cnpj){
        if(cpf.length !== 11){
            Alert.alert("Atenção", "CPF inválido");
            return false;
        }
    }else if(cnpj && !cpf){
        if(cnpj.length !== 14){
            Alert.alert("Atenção", "CNPJ inválido");
            return false;
        }
    }

    // Validação da senha
    if(senha.length < 8){
        Alert.alert("Atenção", "Senha inválida");
        return false;
    }

    // Validação do telefone
    if(telefone.length !== 11){
        Alert.alert("Atenção", "Telefone inválido");
        return false;
    }

    return true;
}