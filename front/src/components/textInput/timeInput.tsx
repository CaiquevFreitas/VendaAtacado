import React, { useState } from "react";
import { TextInput, TouchableOpacity, View, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { themes } from "../../../assets/colors/themes";

type Props = {
  descricao: string;
  value?: Date;
  onChange?: (time: Date) => void;
};

export function TimeInput({ descricao, value, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | undefined>(value);

  const handleChange = (event: any, time?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (time) {
      
      const timeZoneOffset = 3 * 60 * 60 * 1000; 
      const adjustedTime = new Date(time.getTime() + timeZoneOffset);
      setSelectedTime(adjustedTime);
      onChange?.(adjustedTime);
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput
          style={styles.inputTime}
          placeholder={descricao}
          value={selectedTime ? formatTime(selectedTime) : ""}
          editable={false}
          placeholderTextColor={themes.colors.secondary}
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedTime || new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputTime: {
    width: "100%",
    backgroundColor: themes.colors.white,
    borderRadius: 7,
    padding: 10,
  },
  container: {
    flex: 1,
    marginBottom: 15,
    width: "90%",
  },
});
