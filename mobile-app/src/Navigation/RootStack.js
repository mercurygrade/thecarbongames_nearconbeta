import React, { useContext, useMemo } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import BottomTabs from './BottomTabs';
import AuthStack from './AuthStack';
import { AuthContext } from '../Providers/AuthProvider';
import Navigation from '../Screens/Trips/Navigation';
import SetOriginDestination from '../Screens/Trips/SetOriginDestination';
import useRedirect from '../Hooks/useRedirect';

const Stack = createStackNavigator();

const RootStack = () => {
    const { user } = useContext(AuthContext)
    const initialRoute = useMemo(() => user ? 'Bottom Tabs' : 'Auth Stack', [user])


    if (user+'' == 'undefined') return null

 

    return (
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ ...TransitionPresets.ModalSlideFromBottomIOS, headerShown: false, cardStyle: { backgroundColor: 'white' } }}>

            <Stack.Screen name={'Auth Stack'} options={{ headerShown: false }} component={AuthStack} />
            <Stack.Screen name={'Bottom Tabs'} options={{ headerShown: false }} component={BottomTabs} />
            <Stack.Screen name={'Navigation'} options={{ headerShown: false, ...TransitionPresets.ModalPresentationIOS }} component={Navigation} />
            <Stack.Screen name={'Set Origin And Destination'} options={{ headerShown: false, ...TransitionPresets.ModalPresentationIOS }} component={SetOriginDestination} />

        </Stack.Navigator>
    );
};

export default RootStack;

