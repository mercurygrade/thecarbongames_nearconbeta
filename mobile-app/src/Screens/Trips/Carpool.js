import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Alert, BackHandler, Image, LayoutAnimation, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Avatar, Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../Common/Colors";
import { CARPOOL_STATUSES, CARPOOL_USER_STATUSES, VEHICLE_TYPES } from "../../Common/Contstants";
import ImageIcon from "../../Common/ImageIcon";
import { shadow } from "../../Common/Styles";
import { formatDuration, getInitials } from "../../Common/Utitliy";
import BottomContentView from "../../Components/BottomContentView";
import CustomButton from "../../Components/CustomButton";
import MapComponent from "../../Components/MapComponent";
import SeatAvatar from "../../Components/SeatAvatar";
import { Carpool as CarpoolModel } from "../../Models/Carpool";
import { USER_TYPES } from "../../Models/User";
import { changeStack } from "../../Navigation";
import { AppContext } from "../../Providers/AppProvider";
import { AuthContext } from "../../Providers/AuthProvider";
import { EventContext } from "../../Providers/EventProvider";
import { TransportContext } from "../../Providers/TransportProvider";

export default Carpool = ({ route }) => {
    const navigation = useNavigation()
    const insets = useSafeAreaInsets()
    const windowDimensions = useWindowDimensions()
    const id = route.params?.id

    const { user, userData } = useContext(AuthContext)
    const { carpoolOffers, onCarpoolSeatSelect, onLeaveCarpool, joinCarpool, getCarpoolPreview } = useContext(TransportContext)

    const [detailVisible, setDetailVisibility] = useState(false)
    const [carpoolPreview, setCarpoolPreview] = useState({ credits: 0 })
    const [selectedSeat, setSelectedSeat] = useState()

    const carpool = useMemo(() => {
        let c = carpoolOffers.find(item => item.id == id)
        let passengers = [...c.passengers, { name: userData.full_name, id: user.uid, seat: selectedSeat, profile_image: userData.profileImage, home_address: userData.home_address }]
        return new CarpoolModel({ ...c, ...carpoolPreview, passengers }, user.uid)
    }, [route, carpoolOffers, carpoolPreview, userData, selectedSeat])

    const isNotCompanyBus = useMemo(() => carpool?.userData ? true : false, [])

    useEffect(() => {
        getCarpoolPreview({
            params: id,
            onSuccess: res => setCarpoolPreview(res.data),
            onFail: () => navigation.goBack()
        })
    }, [])

    useEffect(() => { // clear the bottom bar button unmount
        const backButtonListener = BackHandler.addEventListener('hardwareBackPress', onGoBack)
        return backButtonListener.remove
    }, [])

    const onGoBack = () => {
        navigation.goBack()
        return false
    }

    useEffect(() => {

        if (!carpool) {
            navigation.navigate('Trips')
            return Alert.alert('Carpool cancelled', 'Carpool has been cancelled by the driver.')
        }

        if (carpool?.status == CARPOOL_STATUSES.CONFIRMED && !carpool?.me) {
            navigation.navigate('Trips')
            return Alert.alert('Carpool Closed', 'The driver has started the ride with other passengers.')
        }

        if (carpool?.status == CARPOOL_STATUSES.CONFIRMED && carpool?.me?.status == CARPOOL_USER_STATUSES.REJECTED) {
            navigation.navigate('Trips')
            return Alert.alert('Carpool Closed', 'The driver has chosen a different route.')
        }

    }, [carpool, user])

    const onToggle = () => {
        setDetailVisibility(cv => !cv)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }

    const onJoin = () => {
        joinCarpool({
            params: { carpoolId: carpool.id, seat: selectedSeat },
            onSuccess: () => navigation.navigate('Ongoing Carpool', { id: carpool.id })
        })
    }

    if (!carpool) return null

    return (
        <View style={{ flex: 1, backgroundColor: Colors.GRAY, paddingTop: insets.top }} >

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, paddingBottom: 8, alignItems: 'center' }}>
                <Icon onPress={onGoBack} name="arrow-back-ios" />
                <View style={{ flexDirection: 'row', padding: 8, backgroundColor: Colors.WHITE, borderRadius: 40, ...shadow, alignItems: 'center' }} >
                    <Text style={{ fontSize: 16 }} >+{carpoolPreview?.credits}</Text>
                    <ImageIcon name="carbon" color={Colors.PRIMARY} />
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, alignItems: 'center' }}>
                <Text style={{ fontSize: 26 }} >{`Carpool with ${carpool.passengers[0]?.name?.split(' ')?.[0]}`}</Text>
                <Icon name="star" size={28} color={Colors.PRIMARY} />
            </View>

            <View style={{ width: windowDimensions.width, flex: 1, marginTop: 'auto' }} >
                <Image
                    resizeMode='contain'
                    style={{ width: windowDimensions.width, alignSelf: 'center', flex: 1 }}
                    source={getCarImage(carpool?.car?.seat)} />
                <View style={{ position: 'absolute', top: '40%', right: '38%', left: '38%', bottom: carpool?.car?.seat == 4 ? '30%' : '15%' }} >
                    {[...new Array(carpool.car.seat)]?.map((item, index) => {
                        const passenger = useMemo(() => carpool.passengers.find(passenger => passenger.seat == index), [carpool])
                        return (
                            <SeatAvatar
                                key={index}
                                onPress={() => setSelectedSeat(value => value == index ? null : index)}
                                disabled={(!passenger || passenger?.id == user.uid) ? false : true}
                                userData={passenger}
                                containerStyle={{ position: 'absolute', ...getAvatarPosition(index, carpool?.car.seat) }}
                            />
                        )
                    })}
                </View>
            </View>

            <CarpoolDetails visible={detailVisible} toggle={onToggle} carpool={carpool} passengers={carpool?.passengers} />

            <BottomContentView >
                <CustomButton
                    disabled={!selectedSeat}
                    onPress={onJoin}
                    imageIcon="carbon"
                    label={'JOIN AND EARN ' + carpoolPreview?.credits || ''}
                    containerStyle={{ margin: 15 }} />
            </BottomContentView>
            <View pointerEvents='none' style={{ height: 270 }} />
        </View>
    )
}

const getCarImage = (numberOfSeats) => {
    switch (numberOfSeats) {
        case 4: return require('../../Assets/4_seat_car.png')
        case 7: return require('../../Assets/7_seat_car.png')
        case 8: return require('../../Assets/8_seat_car.png')
    }
}

const getAvatarPosition = (index, numberOfSeats) => {
    switch (numberOfSeats) {
        case 4: switch (index) {
            case 0: return { top: 0, left: 0 }
            case 1: return { top: 0, right: 0 }
            case 2: return { bottom: 0, left: 0 }
            case 3: return { bottom: 0, right: 0 }
        }
        case 7: switch (index) {
            case 0: return { top: 0, left: 0 }
            case 1: return { top: 0, right: 0 }
            case 2: return { bottom: '35%', left: -20 }
            case 3: return { bottom: '35%', right: '28%' }
            case 4: return { bottom: '35%', right: -20 }
            case 5: return { bottom: 0, left: 0 }
            case 6: return { bottom: 0, right: 0 }
        }
        case 8: switch (index) {
            case 0: return { top: -10, left: 0 }
            case 1: return { top: -10, right: 0 }
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

const CarpoolDetails = ({ carpool, toggle, visible }) => {
    const windowDimensions = useWindowDimensions()
    return (
        <View style={{ backgroundColor: 'white', position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, ...shadow, paddingBottom: 95, maxHeight: windowDimensions.height * .85 }} >
            <TouchableOpacity onPressIn={toggle}  >
                <View style={{ borderRadius: 10, height: 5, width: '30%', backgroundColor: '#ccc', alignSelf: 'center', margin: 10 }} />
            </TouchableOpacity>

            <View style={{ padding: 15, backgroundColor: Colors.WHITE, marginTop: 0, borderColor: Colors.GRAY, borderBottomWidth: visible ? 1 : 0 }} >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }} >
                    <Text>{'Carpool'}</Text>
                    <Text style={{ paddingHorizontal: 6 }} >•</Text>
                    <Text>{formatDuration(carpool.duration, { largest: 1 })}</Text>
                    <Text style={{ paddingHorizontal: 6 }} >•</Text>
                    <Icon name={carpool.car.type == VEHICLE_TYPES.ELECTRIC ? 'bolt' : 'local-gas-station'} />
                    <Icon containerStyle={{ marginLeft: 'auto' }} color={Colors.GRAY_DARK} name={'people'} />
                </View>

                {carpool.me && (
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                            <Text>Departure time</Text>
                            <Text>{carpool.departure_time}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }} >
                            <Text>Estimated arrival</Text>
                            <Text>{carpool.estimated_arrival}</Text>
                        </View>
                    </View>
                )}

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                    <Text style={{ paddingRight: 10 }}>{carpool.vehicleModal}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }} >
                        <Icon name='person' size={20} />
                        <Text>{carpool.occupation}</Text>
                    </View>
                </View>
            </View>
            {visible && <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {[...carpool?.passengers, {}].map((passenger, index, arr) => (
                    <StopItem key={index} index={index} lastItem={arr.length - 1 == index} passenger={passenger} />
                ))}
                <View style={{ borderRadius: 15, ...shadow, margin: 15,  }}>
                    <View style={{ height: 250,borderRadius: 10, overflow: 'hidden', marginTop: 0, borderWidth: 2, borderColor: Colors.WHITE }} >
                        <MapComponent carpool={carpool} additionalMarkers={carpool.markers} />
                    </View>
                </View>
            </ScrollView>}
        </View>
    )
}

const StopItem = ({ passenger, index, lastItem }) => {
    const { user, userData } = useContext(AuthContext)
    const { defaultParams } = useContext(TransportContext)
    const { event } = useContext(EventContext)

    const iconAndName = useMemo(() => {

        const rideType = defaultParams.type
        const userType = userData.type

        const destination = { icon: userType == USER_TYPES.EVENT ? 'gps-fixed' : 'work', name: userType == USER_TYPES.EVENT ? event.venue : 'Work' }
        const origin = { icon: 'house', name: 'Home' }

        if (lastItem) {
            switch (rideType) {
                case 'goto work': return destination
                case 'goto home': return origin
                case 'meeting': return { icon: 'gps-fixed', name: 'Meeting' }
            }
        }

        if (passenger.id == user.uid) {
            switch (rideType) {
                case 'goto work': return origin
                case 'goto home': return destination
                case 'meeting': return { icon: 'gps-fixed', name: 'Meeting' }
            }
        }

        return null

    }, [userData, lastItem, passenger, user, defaultParams, event])

    const Profile = () => {

        if (iconAndName) return <Icon color={Colors.WHITE} name={iconAndName.icon} size={25} containerStyle={{ backgroundColor: Colors.BLACK_60, width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }} />

        if (user?.uid == passenger.id) return <Icon color={Colors.WHITE} name='home' size={25} containerStyle={{ backgroundColor: Colors.BLACK_60, width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }} />
        if (lastItem) return <Icon color={Colors.WHITE} name='work' size={20} containerStyle={{ backgroundColor: Colors.BLACK_60, width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }} />
        else {
            return (
                <Avatar
                    size={40}
                    rounded
                    title={getInitials(passenger?.name)}
                    ImageComponent={FastImage}
                    containerStyle={{ backgroundColor: Colors.PRIMARY, borderColor: 'white', borderWidth: 1 }}
                    source={passenger?.profile ? { uri: passenger?.profile } : null}
                />
            )
        }
    }

    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ alignItems: 'center', marginRight: -10, marginLeft: 10 }}>
                <View style={{ flex: 1, width: 2, backgroundColor: index == 0 ? Colors.WHITE : Colors.PRIMARY }} />
                <View style={{ height: 15, width: 15, borderRadius: 10, backgroundColor: Colors.PRIMARY, margin: 2 }} />
                <View style={{ flex: 1.2, width: 2, backgroundColor: lastItem ? Colors.WHITE : Colors.PRIMARY }} />
            </View>
            <View style={{ padding: 20, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: -10 }} >
                    <Profile />
                    <View style={{ width: 6 }} />
                    <Text style={{ fontSize: 20 }} >{iconAndName ? iconAndName.name : passenger?.name}</Text>
                </View>
                <Text numberOfLines={1} style={{ marginLeft: 47, color: Colors.GRAY_DARK, fontSize: 14 }} >{passenger?.home_address}</Text>
            </View>
        </View>
    )
}