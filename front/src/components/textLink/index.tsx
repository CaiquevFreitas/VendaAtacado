import { TouchableOpacity, Text } from "react-native";

type Props ={
    texto: string
}

export function TextLink({texto}: Props){
    return(
        <TouchableOpacity>
            <Text>{texto}</Text>
        </TouchableOpacity>
    )
}