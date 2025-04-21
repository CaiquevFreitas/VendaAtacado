import { TextInput, KeyboardTypeOptions} from "react-native";
import { styles } from "./style";

type Props = {
    tipo: KeyboardTypeOptions,
    descricao: string,
    isSenha?: boolean
}

export function Textinput({tipo, descricao, isSenha}: Props){
    return(
        <TextInput style={styles.input}
        placeholder= {descricao}
        keyboardType= {tipo}
        autoCorrect={false}
        secureTextEntry= {isSenha}
        />
    )
}