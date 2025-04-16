import { TouchableOpacity, Text, StyleProp, ViewStyle } from "react-native"
import { styles } from "./style"

type Props = {
    title: string,
    style: StyleProp<ViewStyle>
}

export function Button({ title, style }: Props){
    return (
        <TouchableOpacity activeOpacity={0.5} style={[styles.button, style]}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}
