import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert, StyleSheet, Image, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { themes } from '../../../assets/colors/themes';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type ProfileOptionProps = {
    icon: React.ReactNode;
    title: string;
    onPress: () => void;
};

type ClienteData = {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    senha: string;
};

export default function PerfilLogado(){
    const navigation = useNavigation<NavigationProp>();
    const [clienteData, setClienteData] = useState<ClienteData | null>(null);

    useEffect(() => {
        carregarDadosCliente();
    }, []);

    const carregarDadosCliente = async () => {
        try {
            const dadosSalvos = await AsyncStorage.getItem('clienteData');
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                setClienteData(dados);
            }
        } catch (error) {
            console.error('Erro ao carregar dados do cliente:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            await AsyncStorage.removeItem('userType');
            Alert.alert('Logout realizado', 'Você saiu da sua conta.');
            navigation.reset({
                index: 0,
                routes: [{ name: 'ClienteTabs' }],
            });
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível sair da conta.');
            console.error('Erro ao fazer logout:', error);
        }
    };

    const ProfileOption = ({ icon, title, onPress }: ProfileOptionProps) => (
        <TouchableOpacity style={styles.optionButton} onPress={onPress}>
            <View style={styles.optionContent}>
                {icon}
                <Text style={styles.optionText}>{title}</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={24} color={themes.colors.primary} />
        </TouchableOpacity>
    );

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileInfo}>
                    <Image 
                        source={{ uri: 'https://th.bing.com/th/id/OIP.emrz2EGwVvz2df6AzRXBwgHaEb?rs=1&pid=ImgDetMain' }} 
                        style={styles.profileImage} 
                    />
                    <View style={{ maxWidth: 180 }}>
                        <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">{clienteData?.nome || 'Carregando...'}</Text>
                        <Text style={styles.userEmail}>{clienteData?.email || 'carregando@email.com'}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="exit-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.optionsContainer}>
                    <Text style={styles.sectionTitle}>Conta</Text>
                    <ProfileOption 
                        icon={<Ionicons name="settings-outline" size={24} color={themes.colors.primary} />}
                        title="Configurações"
                        onPress={() => navigation.navigate('ConfiguracoesCliente')}
                    />
                    <ProfileOption 
                        icon={<MaterialIcons name="payment" size={24} color={themes.colors.primary} />}
                        title="Métodos de Pagamento"
                        onPress={() => {}}
                    />
                    <ProfileOption 
                        icon={<Ionicons name="notifications-outline" size={24} color={themes.colors.primary} />}
                        title="Notificações"
                        onPress={() => navigation.navigate('NotificacoesCliente')}
                    />
                    <ProfileOption 
                        icon={<MaterialIcons name="local-offer" size={24} color={themes.colors.primary} />}
                        title="Avaliar Compras"
                        onPress={() => navigation.navigate('AvaliarCompras')}
                    />
                    <ProfileOption 
                        icon={<FontAwesome name="question-circle-o" size={24} color={themes.colors.primary} />}
                        title="Ajuda"
                        onPress={() => {}}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: themes.colors.primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: 'white'
    },
    userName: {
        color: themes.colors.white,
        fontSize: 20,
        fontWeight: 'bold'
    },
    userEmail: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14
    },
    logoutButton: {
        padding: 10
    },
    content: {
        flex: 1,
        paddingHorizontal: 20
    },
    optionsContainer: {
        paddingVertical: 20,
        gap: 10
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: themes.colors.primary,
        marginBottom: 10
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    optionText: {
        fontSize: 16,
        color: '#333'
    }
});
