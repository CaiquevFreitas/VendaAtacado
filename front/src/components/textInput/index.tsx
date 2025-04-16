import { TextInput } from "react-native";

type Props = {
    tipo: string
}

export function Textinput({tipo}: Props){
    return(
        <TextInput 
        placeholder= {tipo}
        autoCorrect={false}
        />
    )
}