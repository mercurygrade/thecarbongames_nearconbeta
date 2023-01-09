import { useNavigation } from "@react-navigation/native";
import moment from "moment";
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
import { TransportContext } from "../../Providers/TransportProvider";

export default CompletedCarpools = () => {

    const navigation = useNavigation()
    const { completedCarpoolOffers } = useContext(TransportContext)
    const insets = useSafeAreaInsets()

    const Header = () => {
        return (
            <View style={{ padding: 15, alignItems: 'flex-start' }}>
                <Icon containerStyle={{ backgroundColor: 'white' }} onPress={() => navigation.goBack()} name="arrow-back-ios" />
                <Text style={{ fontSize: 28,paddingTop : 5 }} >Completed Carpools</Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, paddingTop: insets.top }} >
            <Header />
            <FlatList
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                contentContainerStyle={{ padding: 10 }}
                data={completedCarpoolOffers}
                renderItem={({ item }) => <CarpoolItem carpool={item} />} />
        </View>
    )
}

const CarpoolItem = ({ carpool }) => {
    const navigation = useNavigation()
    const duration = useMemo(() => carpool?.routes?.[0]?.legs?.reduce((total, leg) => total + leg.duration.value, 0), [carpool])
    return (
        <View style={{ padding: 15, borderRadius: 15, ...shadow, backgroundColor: Colors.WHITE }} >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }} >
                <Text>{carpool.vehicleModal}</Text>
                <Text style={{ paddingHorizontal: 6 }} >•</Text>
                <Text>{formatDuration(duration, { largest: 1 })}</Text>
                <Text style={{ paddingHorizontal: 6 }} >•</Text>
                <Icon name={carpool.vehicleType == VEHICLE_TYPES.ELECTRIC ? 'bolt' : 'local-gas-station'} />
                <Icon containerStyle={{ marginLeft: 'auto' }} color={Colors.GRAY_DARK} name={'people'} />
            </View>
            <CarpoolImage carpool={carpool} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom : 15 }} >
                <Text>Completed time</Text>
                <Text>{moment(carpool.completed_time).format('DD-MM-YYYY')}</Text>
            </View>

            <CustomButton label={'DETAILS'} onPress={()=>navigation.navigate('Completed Carpool Details', {carpool : carpool})} />

        </View>
    )
}

const CarpoolImage = ({ carpool }) => {
    const windowDimensions = useWindowDimensions()
    return (
        <View style={{ height: 150 }}>
            <Image
                resizeMode='contain'
                style={{ alignSelf: 'center', height: '100%', width: windowDimensions.width * .7, }}
                source={getCarImage(carpool?.passengerData.length)} />

            <View style={{ position: 'absolute', top: '25%', right: carpool?.passengerData.length == 4 ? '30%' : '22%', left: '40%', bottom: "25%" }} >
                {carpool?.passengerData?.map((passenger, index) => (
                    <SeatAvatar
                        size={35}
                        key={passenger?.id||index}
                        disabled={index == 0 || (carpool?.passengerData?.[index] ? true : false)}
                        userData={passenger}
                        containerStyle={{ position: 'absolute', ...getAvatarPosition(index, carpool?.passengerData.length) }}
                    />
                ))}
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