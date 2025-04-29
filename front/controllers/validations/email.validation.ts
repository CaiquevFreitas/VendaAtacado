import { Alert } from "react-native";

export function verificarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valido = regex.test(email);

  if (!valido) {
    Alert.alert("Email inválido", "Por favor, insira um email válido.");
  }

  return valido;
}
