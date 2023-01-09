import React, {  } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { defaultScreenOptions } from '.';
import Profile from '../Screens/Profile/Profile';
import MyTribe from '../Screens/Profile/MyTribe';
import RedeemedPrizes from '../Screens/Profile/RedeemedPrizes';
import PurchaseHistory from '../Screens/Profile/PurchaseHistory';
import SavedRoutes from '../Screens/Profile/SavedRoutes';
import Statistics from '../Screens/Profile/Statistics';
import Carpooling from '../Screens/Profile/Carpooling';
import ChangeAddress from '../Screens/Profile/ChangeAddress';
import CompletedCarpools from '../Screens/Profile/CompletedCarpools';
import CompletedCarpoolDetail from '../Screens/Profile/CompletedCarpoolDetail';

const Stack = createStackNavigator();

const ProfileStack = () => {


    return (
        <Stack.Navigator screenOptions={{ ...defaultScreenOptions, headerShown: false }}>

            <Stack.Screen name={'Profile'} component={Profile} />
            <Stack.Screen name={'My Tribe'} component={MyTribe} />
            <Stack.Screen name={'Redeemed Prizes'} component={RedeemedPrizes} />
            <Stack.Screen name={'Purchase History'} component={PurchaseHistory} />
            <Stack.Screen name={'Saved Routes'} component={SavedRoutes} />
            <Stack.Screen name={'Statistics'} component={Statistics} />
            <Stack.Screen name={'Carpooling'} component={Carpooling} />
            <Stack.Screen name={'Change Address'} component={ChangeAddress} />
            <Stack.Screen name={'Completed Carpools'} component={CompletedCarpools} />
            <Stack.Screen name={'Completed Carpool Details'} component={CompletedCarpoolDetail} />

        </Stack.Navigator>
    );
};

export default ProfileStack;

