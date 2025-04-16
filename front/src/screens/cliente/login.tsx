import React from 'react';
import { View, KeyboardAvoidingView, Image,  } from 'react-native';
import { Textinput } from '../../components/textInput';
import { Button } from '../../components/button';

export default function Login(){
    return(
        <KeyboardAvoidingView>
            <View>
                <Image source={require('../../../assets/icon.png')} />
            </View>
            <View>
                <Textinput tipo="Email"/>
                <Textinput tipo="Senha"/>
                <Button title="Acessar" />
            </View>
        </KeyboardAvoidingView>
    )
}