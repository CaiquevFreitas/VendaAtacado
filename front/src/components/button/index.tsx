import { TouchableOpacity, Text, StyleProp, ViewStyle } from "react-native"
import { styles } from "./style"

type Props = {
    title: string,
    style?: StyleProp<ViewStyle>,
    onPress?: () => void;
}

export function Button({ title, style, onPress }: Props){
    return (
        <TouchableOpacity activeOpacity={0.5} style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}
