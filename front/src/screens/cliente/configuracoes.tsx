import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { themes } from '../../../assets/colors/themes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type ConfigOptionProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress: () => void;
};

const ConfigOption = ({ icon, title, description, onPress }: ConfigOptionProps) => (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
        <View style={styles.optionIconContainer}>
            {icon}
        </View>
        <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>{title}</Text>
            <Text style={styles.optionDescription}>{description}</Text>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color={themes.colors.primary} />
    </TouchableOpacity>
);

export default function ConfiguracoesCliente() {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={themes.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Configurações da Conta</Text>
            </View>

            <View style={styles.content}>
                <ConfigOption 
                    icon={<Ionicons name="person-outline" size={24} color={themes.colors.primary} />}
                    title="Alterar Informações Pessoais"
                    description="Atualize nome, email, telefone e outras informações pessoais"
                    onPress={() => navigation.navigate('AlterarInformacoesCliente')}
                />

                <ConfigOption 
                    icon={<Ionicons name="camera-outline" size={24} color={themes.colors.primary} />}
                    title="Alterar Foto de Perfil"
                    description="Atualize sua foto de perfil"
                    onPress={() => navigation.navigate('AlterarFotoCliente')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: themes.colors.primary,
        marginLeft: 15,
    },
    content: {
        padding: 20,
        gap: 15,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
    },
    optionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${themes.colors.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    optionDescription: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
});
