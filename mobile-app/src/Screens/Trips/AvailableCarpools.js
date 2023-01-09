import { useNavigation } from "@react-navigation/native";
import React, { useContext, useMemo } from "react";
import { FlatList, Image, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../Common/Colors";
import { VEHICLE_TYPES } from "../../Common/Contstants";
import { shadow } from "../../Common/Styles";
import { formatDuration } from "../../Common/Utitliy";
import CustomButton from "../../Components/CustomButton";
import SeatAvatar from "../../Components/SeatAvatar";
import { Carpool } from "../../Models/Carpool";
import { AuthContext } from "../../Providers/AuthProvider";
import { TransportContext } from "../../Providers/TransportProvider";

export default AvailableCarpools = () => {

    const navigation = useNavigation()
    const { carpoolOffers } = useContext(TransportContext)
    const { user } = useContext(AuthContext)
    const insets = useSafeAreaInsets()

    const Header = () => {
        return (
            <View style={{ padding: 15, alignItems: 'center', flexDirection: 'row', borderBottomWidth: 1, borderColor: Colors.BLACK_30 }}>
                <Text style={{ fontSize: 28, position: 'absolute', left: 0, right: 0, textAlign: 'center' }} >Join a Carpool</Text>
                <Icon onPress={() => navigation.goBack()} name="arrow-back-ios" />
            </View>
        )
    }


    return (
        <View style={{ flex: 1, paddingTop: insets.top }} >
            <Header />
            <FlatList
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                contentContainerStyle={{ padding: 15, paddingBottom: insets.bottom + 110 }}
                data={carpoolOffers}
                renderItem={({ item }) => <CarpoolItem carpool={new Carpool(item, user.uid)} />} />
        </View>
    )
}

const CarpoolItem = ({ carpool }) => {
    const navigation = useNavigation()
    return (
        <View style={{ padding: 15, borderRadius: 15, ...shadow, backgroundColor: Colors.WHITE }} >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6}} >
                <Text>{carpool.car.model}</Text>
                <Text style={{ paddingHorizontal: 6 }} >•</Text>
                <Text>{formatDuration(carpool.duration, { largest: 1 })}</Text>
                <Text style={{ paddingHorizontal: 6 }} >•</Text>
                <Icon size={20} name={carpool.vehicleType == VEHICLE_TYPES.ELECTRIC ? 'bolt' : 'local-gas-station'} />
                <Text style={{marginLeft : 'auto', paddingTop : 2}} >{carpool.occupation}</Text>
                <Icon containerStyle={{ paddingLeft : 5 }} size={20} name={'people'} />
            </View>
            <CarpoolImage carpool={carpool} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text>Departure time</Text>
                <Text>{carpool.departure_time}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }} >
                <Text>Estimated arrival</Text>
                <Text>{carpool.estimated_arrival}</Text>
            </View>

            <CustomButton label={'JOIN'} onPress={() => navigation.navigate('Carpool', { id: carpool.id })} />

        </View>
    )
}

const CarpoolImage = ({ carpool }) => {
    const windowDimensions = useWindowDimensions()
    const { user } = useContext(AuthContext)
    return (
        <View style={{ height: 150 }}>
            <Image
                resizeMode='contain'
                style={{ alignSelf: 'center', height: '100%', width: windowDimensions.width * .7, }}
                source={getCarImage(carpool?.car.seat)} />

            <View style={{ position: 'absolute', top: '25%', right: carpool?.car.seat == 4 ? '30%' : '22%', left: '40%', bottom: "25%" }} >
                {[...new Array(carpool.car.seat)]?.map((item, index) => {
                    const passenger = useMemo(() => carpool.passengers.find(passenger => passenger.seat == index), [carpool])
                    return (
                        <SeatAvatar
                            size={35}
                            key={index}
                            disabled={(!passenger || passenger?.id == user.uid) ? false : true}
                            userData={passenger}
                            containerStyle={{ position: 'absolute', ...getAvatarPosition(index, carpool.car.seat) }}
                        />
                    )
                })}
            </View>
        </View>
    )
}

const getCarImage = (numberOfSeats) => {
    switch (numberOfSeats) {
        case 4: return require('../../Assets/4_seat_car_horizontal.png')
        case 7: return require('../../Assets/7_seat_car_horizontal.png')
        case 8: return require('../../Assets/8_seat_car_horizontal.png')
    }
}

const getAvatarPosition = (index, numberOfSeats) => {
    switch (numberOfSeats) {
        case 4: switch (index) {
            case 0: return { bottom: 0, left: 0 }
            case 1: return { top: 0, left: 0 }
            case 2: return { bottom: 0, right: 0 }
            case 3: return { top: 0, right: 0 }
        }
        case 7: switch (index) {
            case 0: return { bottom: 0, left: 0 }
            case 1: return { top: 0, left: 0 }
            case 2: return { left: '35%', top: -20 }
            case 3: return { left: '35%', top: '27%' }
            case 4: return { left: '35%', bottom: -20 }
            case 5: return { top: 0, right: 0 }
            case 6: return { bottom: 0, right: 0 }
        }
        case 8: switch (index) {
            case 0: return { top: -10, left: 0 }
            case 1: return { bottom: -10, left: 0 }
            case 2: return { bottom: '45%', left: -20 }
            case 3: return { bottom: '45%', right: '28%' }
            case 4: return { bottom: '45%', right: -20 }
            case 5: return { bottom: '5%', left: -20 }
            case 6: return { bottom: '5%', right: '28%' }
            case 7: return { bottom: '5%', right: -20 }
        }

        default:
            break;
    }

}