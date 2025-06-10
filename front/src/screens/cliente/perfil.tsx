import { Image, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from "../../../types";
import { Button } from "../../components/button";
import { themes } from "../../../assets/colors/themes";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Perfil() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require("../../../assets/icon.png")} />
      <Button title="Entrar como Cliente" onPress={() => navigation.navigate("Login")} />
      <Button title="Entrar como Loja" onPress={() => navigation.navigate("LoginLoja")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themes.colors.primary,
    gap: 30,
    padding: 30
  },
  img: {
    height: 123,
    width: 252
  }
});
