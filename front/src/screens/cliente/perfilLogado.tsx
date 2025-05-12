import { View, TouchableOpacity, Alert, StyleSheet, Image, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { themes } from '../../../assets/colors/themes';

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
        <View style={styles.container}>
            <View style={styles.topo}>
              <View>
                <Image 
                    source={{ uri: 'https://th.bing.com/th/id/OIP.emrz2EGwVvz2df6AzRXBwgHaEb?rs=1&pid=ImgDetMain' }} 
                    style={{ width: 60, height: 60, borderRadius: 25 }} 
                  />
                <Text style={styles.texto} >Nome cliente</Text>
              </View>
              <View>
                <TouchableOpacity style={styles.btn} onPress={handleLogout} >
                  <Text style={styles.texto}>Sair da conta</Text>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView>
            
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor: themes.colors.secondary
    },
    topo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 30,
      paddingVertical: 10,
      width: '100%',
      height: 100,
      backgroundColor: themes.colors.primary
    },    
    btn:{
      width: 90,
      height: 30,
      backgroundColor: 'red',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    texto:{
      color: themes.colors.white
    }
})