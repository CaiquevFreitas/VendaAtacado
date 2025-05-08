import { View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function PerfilLogado(){
    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
    
          Alert.alert('Logout realizado', 'Você saiu da sua conta.');


        } catch (error) {
          Alert.alert('Erro', 'Não foi possível sair da conta.');
          console.error('Erro ao fazer logout:', error);
        }
      };
    

    return(
        <View>
            // Só para testar a tela, imprementar a tela posteriormente
            <Button title="Sair da conta" color="red" onPress={handleLogout} />
        </View>
    )
}