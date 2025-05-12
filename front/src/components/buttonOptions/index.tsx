import { TouchableOpacity, Text } from "react-native";
import { styles } from "./style"

type Props = {
    title: string
}

export function ButtonOption({title}:Props){
    return(
         <TouchableOpacity activeOpacity={0.5} style={[styles.button]} >
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}