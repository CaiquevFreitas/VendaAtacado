import { TextInput } from "react-native";
import { styles } from "./style";

type Props = {
    tipo: string
}

export function Textinput({tipo}: Props){
    return(
        <TextInput style={styles.input}
        placeholder= {tipo}
        autoCorrect={false}
        />
    )
}