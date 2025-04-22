import { View, Text, StyleSheet} from "react-native";
import { themes } from "../../../assets/colors/themes";
import { Textinput } from "../../components/textInput";

export default function Cadastro(){
    return(
        <View style={styles.container}>
            <View style={styles.viewText}>
                <Text style={styles.texto}>Cadastro</Text>
            </View>
            
            <View style={styles.viewInputs}>
                <Textinput tipo="default" descricao="Nome"/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: themes.colors.primary,
        alignItems: "center",
    },
    texto:{
        color: themes.colors.white,
        fontSize: 25
    },
    viewText:{

    },
    viewInputs:{

    }
})
