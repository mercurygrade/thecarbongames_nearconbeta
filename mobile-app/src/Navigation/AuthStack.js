import React, {  } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { defaultScreenOptions } from '.';
import Welcome from '../Screens/Auth/Welcome';
import SignUp from '../Screens/Auth/SignUp';

const Stack = createStackNavigator();

const AuthStack = () => {

    return (
        <Stack.Navigator screenOptions={{ ...defaultScreenOptions, headerShown: false }}>

            <Stack.Screen name={'Welcome'} component={Welcome} />
            <Stack.Screen name={'SignUp'} component={SignUp} />

        </Stack.Navigator>
    );
};

export default AuthStack;

