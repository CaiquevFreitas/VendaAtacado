import { TextInput, KeyboardTypeOptions, StyleSheet, View, TouchableOpacity } from "react-native";
import { themes } from "../../../assets/colors/themes";
import { styles } from "./style";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

type Props = {
    tipo: KeyboardTypeOptions;
    descricao: string;
    isSenha?: boolean;
    value?: string;
    onChangeText?: (text: string) => void;
    max?: number
}

export function Textinput({ tipo, descricao, isSenha = false, value, onChangeText, max = 100 }: Props) {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, isSenha && styles.inputComIcone]}
                placeholder={descricao}
                keyboardType={tipo}
                autoCorrect={false}
                secureTextEntry={isSenha && !mostrarSenha}
                placeholderTextColor={themes.colors.secondary}
                value={value}
                onChangeText={onChangeText}
                maxLength={max}
            />
            {isSenha && (
                <TouchableOpacity 
                    style={styles.iconContainer}
                    onPress={() => setMostrarSenha(!mostrarSenha)}
                >
                    <Ionicons 
                        name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'} 
                        size={24} 
                        color={themes.colors.secondary}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}
