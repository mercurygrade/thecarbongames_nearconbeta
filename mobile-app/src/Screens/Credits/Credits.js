import React, { useContext } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../Common/Colors";
import ImageIcon from "../../Common/ImageIcon";
import { shadow } from "../../Common/Styles";
import { getInitials } from "../../Common/Utitliy";
import { AuthContext } from "../../Providers/AuthProvider";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LeaderBoard from "./LeaderBoard";
import RedeemPrizes from "./RedeemPrizes";

const Tab = createMaterialTopTabNavigator();

export default Credits = () => {
    const { userData } = useContext(AuthContext)
    const insets = useSafeAreaInsets()
    const navigation = useNavigation()
    return (
        <View style={{ paddingTop: insets.top, flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' }}>
                <Avatar
                    size={45}
                    rounded
                    onPress={()=>navigation.navigate('ProfileStack')}
                    title={getInitials(userData?.name)}
                    containerStyle={{ backgroundColor: Colors.PRIMARY }}
                    source={userData?.profileImage ? { uri: userData.profileImage } : null}
                />
                <View style={{ flexDirection: 'row', padding: 8, backgroundColor: Colors.WHITE, borderRadius: 40, ...shadow, alignItems: 'center' }} >
                    <ImageIcon size={20} name="carbon" color={Colors.PRIMARY} />
                    <Text style={{ fontSize: 16, paddingLeft: 5 }} >{userData.total_credits || 0}</Text>
                </View>
            </View>
            <Tabs />
        </View>
    )
}

function Tabs() {
    return (
        <Tab.Navigator screenOptions={{ tabBarIndicatorStyle: { backgroundColor: Colors.PRIMARY } }}>
            <Tab.Screen name="Redeem Prizes" component={RedeemPrizes} />
            <Tab.Screen name="Leader Board" component={LeaderBoard} />
        </Tab.Navigator>
    );
}
