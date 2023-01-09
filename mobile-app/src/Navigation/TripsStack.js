import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { defaultScreenOptions } from '.';
import Trips from '../Screens/Trips';
import Carpool from '../Screens/Trips/Carpool';
import OngoingCarpool from '../Screens/Trips/OngoingCarpool';
import MyCarpool from '../Screens/Trips/MyCarpool';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../Providers/AppProvider';
import { LayoutAnimation } from 'react-native';
import AvailableCarpools from '../Screens/Trips/AvailableCarpools';

const Stack = createStackNavigator();

const TripsStack = () => {

    const { setBottomBarContent } = useContext(AppContext)
    const [bottomBarContentState, setBottomBarContentState] = useState()
    const navigation = useNavigation()
    useEffect(() => {
        const focusListener = navigation.addListener('blur', () => setBottomBarContent(cv => {
            setBottomBarContentState(cv)
            console.log('ProfileStack')
            if (cv) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            return setBottomBarContent(null)
        }))

        const blurListener = navigation.addListener('focus', () => {
            if (bottomBarContentState) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                setBottomBarContent(bottomBarContentState)
            }
        })

        return () => {
            blurListener()
            focusListener()
        }
    }, [bottomBarContentState])

    return (
        <Stack.Navigator screenOptions={{ ...defaultScreenOptions, headerShown: false }}>

            <Stack.Screen name={'Trips'} component={Trips} />
            <Stack.Screen name={'Carpool'} component={Carpool} options={{ gestureEnabled: false }} />
            <Stack.Screen name={'Ongoing Carpool'} component={OngoingCarpool} />
            <Stack.Screen name={'My Carpool'} component={MyCarpool} options={{ gestureEnabled: false }} />
            <Stack.Screen name={'Available Carpools'} component={AvailableCarpools} />

        </Stack.Navigator>
    );
};

export default TripsStack;

