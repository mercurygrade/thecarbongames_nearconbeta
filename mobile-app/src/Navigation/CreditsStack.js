import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { defaultScreenOptions } from '.';
import Credits from '../Screens/Credits/Credits';

const Stack = createStackNavigator();

const CreditsStack = () => {
    return (
        <Stack.Navigator screenOptions={{ ...defaultScreenOptions, headerShown : false }}>

            <Stack.Screen name={'Credits'}  component={Credits} />

        </Stack.Navigator>
    );
};

export default CreditsStack;

