import { useNavigation } from "@react-navigation/native";
import React, { useContext, useMemo } from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../Common/Colors";
import { shadow } from "../../Common/Styles";
import { getCenter } from "../../Common/Utitliy";
import CustomButton from "../../Components/CustomButton";
import MapComponent, { AvatarMarker, CustomMarker, getMarkerIcon } from "../../Components/MapComponent";
import { changeStack } from "../../Navigation";
import { AuthContext } from "../../Providers/AuthProvider";
import { GOOGLE_MAPS_APIKEY, TransportContext } from "../../Providers/TransportProvider";



export default Navigation = () => {
    const navigation = useNavigation()
    const {user} = useContext(AuthContext)
    const { defaultParams, carpoolOffers, completeCarpool } = useContext(TransportContext)
    const insets = useSafeAreaInsets()
    const myCarpool = useMemo(() => carpoolOffers.find(carpool => carpool.userData.id == user?.uid), [user, carpoolOffers])

    const Header = useMemo(() => () => {

        return (
            <View pointerEvents='box-none' style={{ position: 'absolute', top: 20, right: 20, left: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Icon onPress={() => navigation.goBack()} name='arrow-downward' containerStyle={{ padding: 10 }} style={{ height: 45, paddingTop: 3, width: 45, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.75)', ...shadow }} />
            </View>
        )
    }, [])

    const additionalMarkers = myCarpool?.passengerData?.filter(passenger => passenger && passenger.id != user?.uid)
    .map(passenger =>
    ({
        ...passenger,
        coordinates: {
            latitude: parseFloat(passenger.coordinates.split(',')[0]),
            longitude: parseFloat(passenger.coordinates.split(',')[1])
        }
    }))

    const onComplete = ()=>completeCarpool(myCarpool, ()=>changeStack('Bottom Tabs'))

    return (
        <View style={{ flex: 1 }} >
           

            <MapComponent additionalMarkers={additionalMarkers} carpool={myCarpool} />
            <Header />
            <CustomButton containerStyle={{position : 'absolute', bottom : insets.bottom+20, left : 20, right : 20} } onPress={onComplete} label={'COMPLETED'} />
        </View>
    )
}