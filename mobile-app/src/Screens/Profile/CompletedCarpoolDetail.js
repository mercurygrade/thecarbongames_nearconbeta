import React, { useContext, useEffect, useMemo, useState } from "react";
import { Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { Icon, Switch } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import Colors from "../../Common/Colors";
import { shadow } from "../../Common/Styles";
import { getCenter } from "../../Common/Utitliy";
import { apikey } from "../../Providers";
import { AuthContext } from "../../Providers/AuthProvider";
import { TransportContext } from "../../Providers/TransportProvider";

export default CompletedCarpoolDetails = ({ navigation, route }) => {
    const insets = useSafeAreaInsets()
    const { defaultParams, carpoolCredits } = useContext(TransportContext)
    const [carpool, setCarpool] = useState(route.params?.carpool)
    const center = getCenter(defaultParams)

    useEffect(() => {

        carpoolCredits(carpool).then(setCarpool)
    }, [])

    return (
        <ScrollView contentContainerStyle={{ padding: 15, paddingTop: insets.top + 15, flex: 1 }} >

            <View style={{ alignItems: 'flex-start' }}>
                <Icon containerStyle={{ backgroundColor: 'white', marginBottom: 10 }} onPress={() => navigation.goBack()} name="arrow-back-ios" />
                <Text style={{ fontSize: 28, color: 'black' }} >Details</Text>
            </View>

            <View style={{ borderRadius: 20, ...shadow, backgroundColor: Colors.WHITE, marginVertical: 20 }} >
                <Image style={{ height: 230, width: '100%', borderRadius: 20, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} source={{ uri: `https://image.maps.ls.hereapi.com/mia/1.6/mapview?apiKey=${apikey}&ppi=320&sb=km&w=1000&h=500&z=15&c=${center.latitude},${center.longitude}` }} />
                <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                            <Text style={{ color: Colors.BLACK_100, fontSize: 16 }} >{'Carpool'}</Text>
                            <Text style={{ color: Colors.BLACK_100, fontSize: 16, marginHorizontal: 10 }}>·</Text>
                            {carpool.vehicleType !== 'carbon-emitting' ? <Icon size={20} name="bolt" /> : <Icon size={20} name="local-gas-station" />}
                            <Icon size={20} name="people" />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }} >
                            <Text style={{ color: Colors.BLACK_100, fontSize: 16 }} >{carpool.routes[0].legs[0].distance.text}</Text>
                            <View style={{ width: 1, height: 25, backgroundColor: Colors.GRAY, marginHorizontal: 20 }} />
                            <Text style={{ color: Colors.BLACK_100, fontSize: 16 }} >{carpool.routes[0].legs[0].duration.text}</Text>
                        </View>
                    </View>

                    <CustomButton label={'DIRECTION'} imageIcon='directions' iconSize={20} />

                </View>
            </View>

            <View style={{justifyContent : 'space-between', flexDirection : 'row'}}>
                <Text style={{fontSize : 16}} >You Earned</Text>
                <View style={{ flexDirection : 'row', alignItems : 'center'}} >
                    <Text style={{ fontSize: 16, paddingLeft: 5 }} >+{carpool.credits}</Text>
                    <ImageIcon size={20} name="carbon" color={Colors.PRIMARY} />
                </View>
            </View>

            <View style={{justifyContent : 'space-between', flexDirection : 'row', marginTop : 15}}>
                <Text style={{fontSize : 16}} >You Saved</Text>
                <View style={{ flexDirection : 'row', alignItems : 'center'}} >
                    <Text style={{ fontSize: 16, paddingLeft: 5 }} >{carpool.co2Amount?.toFixed(3)} Kg CO<Text style={{fontSize :10}} >2</Text></Text>
                </View>
            </View>

            <View style={{justifyContent : 'space-between', flexDirection : 'row', marginTop : 15}}>
                <Text style={{fontSize : 16}} >You Carpool Saved</Text>
                <View style={{ flexDirection : 'row', alignItems : 'center'}} >
                    <Text style={{ fontSize: 16, paddingLeft: 5 }} >{carpool.carpoolCo2Amount?.toFixed(3)} Kg CO<Text style={{fontSize :10}} >2</Text></Text>
                </View>
            </View>

        </ScrollView>
    )
}