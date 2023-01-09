import React, { useContext, useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutAnimation, Text, View, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shadow } from '../Common/Styles';
import CustomButton from '../Components/CustomButton';
import TripsStack from './TripsStack';
import { AppContext } from '../Providers/AppProvider';
import { BOTTOM_TAB_HEIGHT, DIMENSIONS } from '../Common/Contstants';
import ImageIcon from '../Common/ImageIcon';
import ProfileStack from './ProfileStack';
import Colors from '../Common/Colors';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import CreditsStack from './CreditsStack';

const Tab = createBottomTabNavigator();

function BottomTabs() {
    const insets = useSafeAreaInsets()

    useEffect(()=>{
        changeNavigationBarColor('white', true, true)
        StatusBar.setBackgroundColor(Colors.TRANSPARENT)
        StatusBar.setTranslucent(true)
        StatusBar.setBarStyle('dark-content')
    },[])

    return (
        <Tab.Navigator sceneContainerStyle={{ paddingBottom: insets.bottom + (DIMENSIONS.BOTTOM_TAB_HEIGHT - DIMENSIONS.BOTTOM_TAB_BORDER_RADIUS) }} screenOptions={{ headerShown: false }} tabBar={props => <CustomTabBar {...props} />} >
            <Tab.Screen name="TripsStack" component={TripsStack} />
            <Tab.Screen name="CreditsStack" component={CreditsStack} />
            <Tab.Screen name="ProfileStack" component={ProfileStack} />
        </Tab.Navigator>
    );
}

export default BottomTabs

const CustomTabBar = ({ navigation, state }) => {
    const insets = useSafeAreaInsets()
    const { bottomBarContent } = useContext(AppContext)

    return (
        <View
            style={{
                backgroundColor: 'white',
                paddingBottom: insets.bottom+0,
                borderTopLeftRadius: DIMENSIONS.BOTTOM_TAB_BORDER_RADIUS,
                borderTopRightRadius: DIMENSIONS.BOTTOM_TAB_BORDER_RADIUS,
                position: 'absolute',
                borderWidth :Platform.OS=='android' ? 1 : 0, 
                borderBottomWidth : 0,
                borderColor : Colors.GRAY_LIGHT,
                bottom: 0,
                left: -1,
                right: -1,
                ...shadow
            }} >
            {/* {bottomBarContent && <bottomBarContent.content />} */}
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, height: DIMENSIONS.BOTTOM_TAB_HEIGHT,paddingTop : 10, paddingBottom : 10 }} >
                <BottomNavBtn onPress={() => navigation.navigate('TripsStack')} iconName="map" selected={state.index == 0} />
                <BottomNavBtn onPress={() => navigation.navigate('CreditsStack')} imageIcon="carbon" selected={state.index == 1} />
            </View>
        </View>
    )
}

const BottomNavBtn = ({ onPress, iconName, imageIcon, selected }) => (
    <TouchableOpacity onPress={onPress} style={{ flex: 1, alignItems : 'center' , flexDirection : 'row'}} >
        {
            imageIcon ?
                <ImageIcon color={selected ? 'black' : '#ccc'} containerStyle={{ flex: 1 }} name={imageIcon} />
                :
                <Icon containerStyle={{ flex: 1 , alignItems :'center'}} iconStyle={{ width: '100%', textAlign: 'center' }} color={selected ? 'black' : '#ccc'} size={30} name={iconName} />
        }
    </TouchableOpacity>

)