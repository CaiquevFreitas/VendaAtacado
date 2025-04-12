import React from 'react'
import { createBottomTabNavigator } from  '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import Perfil from '../screens/loja/perfil';
import Pedidos from '../screens/loja/pedidos';
import Estoque from '../screens/loja/estoque';

const Tab = createBottomTabNavigator();

export default function LojaNavigator(){
    return(
        <Tab.Navigator screenOptions={({ route }) => ({ headerShown: false,
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
            <Tab.Screen name='Pedidos' component={Pedidos} />
            <Tab.Screen name='Estoque' component={Estoque} />
            <Tab.Screen name='Perfil' component={Perfil} />
        </Tab.Navigator>
    )
}
