import React, { useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Alert, LayoutAnimation, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { Avatar, CheckBox, Icon } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Colors from '../../Common/Colors'
import { CARPOOL_STATUSES, CARPOOL_USER_STATUSES } from '../../Common/Contstants'
import CustomTabs from '../../Common/CustomTabs'
import ImageIcon from '../../Common/ImageIcon'
import { shadow } from '../../Common/Styles'
import { getInitials } from '../../Common/Utitliy'
import CustomButton from '../../Components/CustomButton'
import MapComponent from '../../Components/MapComponent'
import { USER_TYPES } from '../../Models/User'
import { AuthContext } from '../../Providers/AuthProvider'
import { EventContext } from '../../Providers/EventProvider'
import { TransportContext } from '../../Providers/TransportProvider'

const tabs = [
    { value: 'map', label: '    Map    ' },
    { value: 'list', label: '    List    ' }
]

export default MyCarpool = ({ navigation }) => {
    const { userData, user } = useContext(AuthContext)
    const { cancelCarpool, myCarpool, startCarpool, completeCarpool } = useContext(TransportContext)
    const [tab, setTab] = useState(tabs[0])
    const [stopsVisible, setStopsVisibility] = useState(true)

    const onGoBack = () => {
        Alert.alert('Cancel carpool', 'Are you sure you want to cancel the carpool offer?', [
            {
                text: 'Yes',
                onPress: () => cancelCarpool({
                    params: myCarpool.id,
                    onSuccess: navigation.goBack
                })
            },
            { text: 'No' }
        ])
    }

    const onToggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setStopsVisibility(cv => !cv)
    }

    const Credits = () => {
        return (
            <View style={{ flexDirection: 'row', padding: 8, backgroundColor: Colors.WHITE, borderRadius: 40, ...shadow, alignItems: 'center' }} >
                <ImageIcon size={20} name="carbon" color={Colors.PRIMARY} />
                <Text style={{ fontSize: 16, paddingLeft: 5 }} >+{myCarpool.passengers.find(p => p.id == user?.uid)?.credits}</Text>
            </View>
        )
    }

    const Header = useMemo(() => () => {
        const insets = useSafeAreaInsets()
        return (
            <View pointerEvents='box-none' style={{ position: 'absolute', top: insets.top + 20, right: 20, left: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Icon onPress={onGoBack} name='arrow-back-ios' containerStyle={{ padding: 10, marginTop: -15, backgroundColor : 'rgba(255,255,255,.75)' , borderRadius: 25, ...shadow,alignItems: 'center', justifyContent: 'center',}} style={{ height: 45, paddingLeft: 5, width: 45, }} />
                {tab.value == 'map' ? <Weather /> : <Credits />}
                <View pointerEvents='box-none' style={{ position: 'absolute', top: 0, right: 0, left: 0, alignItems: 'center', justifyContent: 'center' }} >
                    {myCarpool.status == CARPOOL_STATUSES.OPEN && <CustomTabs containerStyle={{ marginTop: 40, ...shadow }} tabs={tabs} setState={setTab} selectedTab={tab} />}
                </View>
            </View>
        )
    }, [userData, tab, myCarpool])

    const onPress = () => {
        if (myCarpool.status == CARPOOL_STATUSES.CONFIRMED) return completeCarpool({ params: myCarpool.id, onSuccess: navigation.goBack })
        if (myCarpool.status == CARPOOL_STATUSES.OPEN) return startCarpool({ params: myCarpool.id })
    }

    if (!myCarpool?.raw) return null

    return (
        <View style={{ flex: 1 }} >
            <MapComponent mapProps={{ showsUserLocation: true, followsUserLocation: myCarpool.status == CARPOOL_STATUSES.CONFIRMED }} additionalMarkers={myCarpool.markers} carpool={myCarpool} />
            <Stops carpool={myCarpool} toggle={onToggle} visible={stopsVisible} />
            <Passengers tab={tab} />
            <Header />
            {tab.value == 'map' && <BottomContentView>
                <CustomButton
                    disabled={myCarpool.checkedPassengers?.length == 0 && myCarpool.confirmedPassengers?.length == 0}
                    onPress={onPress}
                    label={myCarpool?.status == CARPOOL_STATUSES.CONFIRMED ? 'CARPOOL COMPLETED' : 'GET STARTED'}
                    containerStyle={{ margin: 15 }} />
            </BottomContentView>}
        </View>
    )
}

const Weather = () => {
    return (
        <View style={{ flexDirection: 'row', padding: 5, backgroundColor: 'white', borderRadius: 40, alignItems: 'center', ...shadow }}>
            <Icon name='nights-stay' />
            <Text style={{ fontSize: 18 }} >22°</Text>
        </View>
    )
}

const Passengers = ({ tab }) => {

    const { myCarpool, setCheckedPassengers: setCheckedPassengersMain } = useContext(TransportContext)
    const [checkedPassengers, setCheckedPassengers] = useState([])

    useEffect(() => {
        return () => setCheckedPassengers(checkedPassengers => {
            if (tab.value == 'map') return checkedPassengers
            setCheckedPassengersMain({
                params: { checkedPassengerIds: checkedPassengers.map(passenger => passenger.id), carpoolId: myCarpool.id },
            })
            return checkedPassengers
        })
    }, [tab])

    useEffect(() => {
        setCheckedPassengers(myCarpool.checkedPassengers)
    }, [])

    const onCheck = (passenger) => {
        setCheckedPassengers(value => ([...value, passenger]))
    }

    const onUncheck = (passenger) => {
        setCheckedPassengers(value => value.filter(p => p.id != passenger.id))
    }

    const Body = useMemo(() => () => {
        if (myCarpool.myPassengers?.length == 0) {
            return (
                <View style={{ padding: 20 }}>
                    <Icon size={50} name='people' color={Colors.GRAY} />
                    <Text style={{ color: Colors.GRAY, fontSize: 40, textAlign: 'center' }}>No Passengers Yet</Text>
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }} >
                        <Icon name='people' />
                        <Text style={{ fontSize: 22, fontWeight: '500', paddingLeft: 10 }} >Passengers {checkedPassengers?.length}/{myCarpool?.car?.seat - 1}</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: Colors.GRAY }} />
                    <ScrollView contentContainerStyle={{ paddingBottom: 90 }} style={{ maxHeight: 350, flex: 1 }} >
                        {myCarpool.myPassengers?.map((passenger, index, arr) =>
                            <PassengerItem
                                checked={!!checkedPassengers.find(item => item.id == passenger.id)}
                                onCheck={onCheck}
                                onUnCheck={onUncheck}
                                hideDivider={arr.length - 1 == index} key={index} item={passenger} />
                        )}
                    </ScrollView>
                </View>

            )
        }
    }, [myCarpool.myPassengers, checkedPassengers,])

    if (tab.value == 'map') return null

    return (
        <View style={{ backgroundColor: 'white', position: 'absolute', top: 1, left: 1, right: 1, bottom: 1, paddingTop: 148 }} >
            <Body />
        </View>
    )
}

const PassengerItem = ({ item, onCheck, onUnCheck, checked, hideDivider }) => {
    return (
        <TouchableOpacity onPress={() => checked ? onUnCheck(item) : onCheck(item)} style={{ padding: 10, paddingTop: 0, borderBottomWidth: hideDivider ? 0 : 1, borderColor: Colors.GRAY }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Avatar
                    size={35}
                    rounded
                    ImageComponent={FastImage}
                    title={getInitials(item?.name)}
                    containerStyle={{ backgroundColor: Colors.PRIMARY }}
                    source={item?.profile ? { uri: item.profile } : null}
                />
                <Text style={{ fontSize: 20, paddingLeft: 10 }} >{item.name}</Text>
                <CheckBox
                    containerStyle={{ marginLeft: 'auto', marginRight: 0, paddingRight: 0 }}
                    center
                    checkedColor={Colors.PRIMARY}
                    checked={checked}
                    onPress={() => checked ? onUnCheck(item) : onCheck(item)}
                />
            </View>
            {/* <Text style={{ color: Colors.BLACK_60, marginTop: -5 }} >Interests: Diving, DIY, Bird watching</Text> */}
        </TouchableOpacity>
    )
}

const Stops = ({ carpool, toggle, visible }) => {
    const windowDimensions = useWindowDimensions()

    const passengers = useMemo(() => carpool.status == CARPOOL_STATUSES.CONFIRMED ? carpool.confirmedPassengers : carpool.checkedPassengers, [carpool])

    const stops = useMemo(() => {
        const self = carpool?.passengers[0]
        const summary = { name: passengers?.length + ' Passenger' + (passengers?.length == 1 ? '' : 's'), type: 'summary' }
        const destination = {}

        if (visible) return [self, ...(passengers.length == 0 ? [summary] : passengers), destination]
        else return [self, summary, destination]
    }, [carpool, visible])

    const title = useMemo(() => {
        if (carpool?.status == CARPOOL_STATUSES.CONFIRMED) return 'Carpool has started'
        switch (carpool.passengers.length) {
            case 1: return 'Take fellow coworkers to earn'
            case carpool?.car.seat: 'Your car is full'
            default: return `You got ${carpool?.car.seat - (carpool.passengers.length - 1)} seats left`
        }
    }, [carpool])

    const Body = () => {
        if (carpool?.passengers.length == 1) {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 30 }}>
                    <ActivityIndicator color={Colors.PRIMARY} size='large' />
                    <Text>Looking for passengers</Text>
                </View>
            )
        }
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {!visible && <View style={{ height: 10 }} />}
                {stops.map((passenger, index, arr) => (
                    <StopItem expand={visible} key={index} index={index} lastItem={arr.length - 1 == index} passenger={passenger} />
                ))}
            </ScrollView>
        )
    }
    return (
        <View style={{ backgroundColor: 'white', position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, ...shadow, paddingBottom: 95, maxHeight: windowDimensions.height * .85 }} >
            <TouchableOpacity onPressIn={toggle}  >
                <View style={{ borderRadius: 10, height: 5, width: '30%', backgroundColor: '#ccc', alignSelf: 'center', margin: 10 }} />
            </TouchableOpacity>
            <View style={{ padding: 15, paddingVertical: 10, borderBottomWidth: 1, borderColor: Colors.GRAY }}>
                <Text style={{ fontSize: 20 }} >{title}</Text>
            </View>
            <Body />
        </View>
    )
}

const StopItem = ({ passenger, index, lastItem, expand }) => {
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
            if (passenger.type == 'summary') return null
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
                <View style={{ flex: expand ? 1.8 : 1, width: 2, backgroundColor: lastItem ? Colors.WHITE : Colors.PRIMARY }} />
            </View>
            <View style={{ paddingHorizontal: 15, paddingVertical: expand ? 15 : 5, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }} >
                    <Profile />
                    <View style={{ width: 6 }} />
                    <Text style={{ fontSize: passenger.type == 'summary' ? 14 : 20, paddingTop: (passenger.type == 'summary' && !expand) ? 6 : 0 }} >{iconAndName ? iconAndName.name : passenger?.name}</Text>
                </View>
                {expand && passenger.type != 'summary' && <Text numberOfLines={1} style={{ marginLeft: 47, marginTop: -10, color: Colors.GRAY_DARK }} >{passenger?.home_address}</Text>}
            </View>
        </View>

    )
}

