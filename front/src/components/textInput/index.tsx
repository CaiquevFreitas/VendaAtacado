import { TextInput, KeyboardTypeOptions, StyleSheet } from "react-native";
import { themes } from "../../../assets/colors/themes";
import { styles } from "./style";
type Props = {
    tipo: KeyboardTypeOptions;
    descricao: string;
    isSenha?: boolean;
    value?: string;
    onChangeText?: (text: string) => void;
    max?: number
}

export function Textinput({ tipo, descricao, isSenha = false, value, onChangeText, max = 100 }: Props) {
    return (
        <TextInput
            style={styles.input}
            placeholder={descricao}
            keyboardType={tipo}
            autoCorrect={false}
            secureTextEntry={isSenha}
            placeholderTextColor={themes.colors.secondary}
            value={value}
            onChangeText={onChangeText}
            maxLength={max}
        />
    );
}
