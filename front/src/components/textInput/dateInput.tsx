import React, { useState } from "react";
import { TextInput, TouchableOpacity, View, Modal, Platform, StyleSheet } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { themes } from "../../../assets/colors/themes";

type Props = {
    descricao: string;
    value?: Date;
    onChange?: (date: Date) => void;
}

export function DateInput({ descricao, value, onChange }: Props) {
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());

    const handleChange = (event: any, date?: Date) => {
        setShowPicker(Platform.OS === 'ios'); // Se for Android, fecha o picker depois da escolha
        if (date) {
            setSelectedDate(date);
            onChange?.(date); // Chama a função passada para o pai, se existir
        }
    };

    const formatDate = (date: Date) => {
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
                <TextInput
                    style={styles.inputDate}
                    placeholder={descricao}
                    value={formatDate(selectedDate)}
                    editable={false}
                    placeholderTextColor={themes.colors.secondary}
                />
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleChange}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    inputDate:{
        width: "100%",
        backgroundColor: themes.colors.white,
        marginBottom: 15,
        borderRadius: 7,
        padding: 10
    }
})