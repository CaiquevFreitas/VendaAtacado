import { TouchableOpacity, Text } from "react-native";
import { styles } from "./style";

type Props ={
    texto: string
}

export function TextLink({texto}: Props){
    return(
        <TouchableOpacity>
            <Text style={styles.textLink}>{texto}</Text>
        </TouchableOpacity>
    )
}