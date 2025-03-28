import React from 'react'
import { createBottomTabNavigator } from  '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

import Perfil from '@/app/screens/loja/perfil'
import Pedidos from '@/app/screens/loja/pedidos'
import Estoque from '@/app/screens/loja/estoque'

const Tab = createBottomTabNavigator();

export default function LojaNavigator(){
    return(
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({color,size}) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                switch (route.name){
                    case 'Perfil':
                        iconName = 'person-outline';
                        break;
                    case 'Pedidos':
                        iconName = 'clipboard-outline';
                        break;
                    case 'Estoque':
                        iconName = 'file-tray-stacked-outline';
                        break;
                    default:
                        iconName = 'help-circle-outline'
                }
                return <Ionicons name={iconName} size={size} color={color} />
            },
        })}>
            <Tab.Screen name='Perfil' component={Perfil} />
            <Tab.Screen name='Pedidos' component={Pedidos} />
            <Tab.Screen name='Estoque' component={Estoque} />
        </Tab.Navigator>
    )
}
