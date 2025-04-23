import { TouchableOpacity, Text } from "react-native";
import { styles } from "./style";

type Props ={
    texto: string,
    onPress?: () => void;
}

export function TextLink({texto, onPress}: Props){
    return(
        <TouchableOpacity onPress={onPress}>
            <Text style={styles.textLink}>{texto}</Text>
        </TouchableOpacity>
    )
}
