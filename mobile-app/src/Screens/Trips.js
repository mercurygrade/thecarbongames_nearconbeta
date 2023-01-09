import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import geolocation from 'react-native-geolocation-service'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Colors from '../Common/Colors'
import CustomTabs from '../Common/CustomTabs'
import { shadow } from '../Common/Styles'
import { getInitials } from '../Common/Utitliy'
import BottomContentView from '../Components/BottomContentView'
import CustomButton from '../Components/CustomButton'
import MapComponent from '../Components/MapComponent'
import useGeolocation from '../Hooks/useGeolocation'
import useRedirect from '../Hooks/useRedirect'
import { USER_TYPES } from '../Models/User'
import { AuthContext } from '../Providers/AuthProvider'
import { EventContext } from '../Providers/EventProvider'
import { TransportContext } from '../Providers/TransportProvider'
import firestore from '@react-native-firebase/firestore'

export default Trips = () => {
    const [peakHourModalVisible, setPeakHourModalVisibility] = useState(false)

    const { userData, company, user } = useContext(AuthContext)
    const { event } = useContext(EventContext)
    const { changeDefaultParams, defaultParams, carpoolOffers, offerCarpool } = useContext(TransportContext)
    useGeolocation()
    const navigation = useNavigation()
    const headerTabs = useMemo(() => {
        if (userData?.type == USER_TYPES.CORPORATE) {
            return [
                { value: 'goto work', label: '    Work    ' },
                { value: 'goto home', label: '    Home    ' },
                { value: 'meeting', label: ' Meeting ' },
            ]
        } else if (userData?.type == USER_TYPES.EVENT) {
            return [
                { value: 'goto work', label: `    ${event?.venue || 'Loading'}    ` },
                { value: 'goto home', label: '    Home    ' }
            ]
        }
    }, [userData?.type, event])

    const [destination, setDestination] = useState()

    useEffect(() => {
        if (!headerTabs) return
        setDestination(headerTabs[0])
    }, [headerTabs])

    useEffect(() => {
        if (defaultParams.type == 'meeting') return setDestination(headerTabs[2])
    }, [defaultParams])

    useRedirect()

    const carpoolOfferAvailable = useMemo(() => carpoolOffers?.filter(carpool => carpool?.owner != user?.uid)?.length > 0, [carpoolOffers, user])

    const onDestinationChange = (destination) => {
        if (destination.value == 'meeting') return Alert.alert('Meeting', 'Please select start and destination locations.', [
            { text: 'Okay', onPress: () => navigation.navigate('Set Origin And Destination') },
            { text: 'Cancel' }
        ])
        setDestination(destination)
        changeDefaultParams(destination.value)
    }

    const onPeakHourEarn = () => {
        setPeakHourModalVisibility(false)
    }

    const onOfferCarpool = () => {
        if (!userData?.cars?.length) return Alert.alert('Carpool', 'You need to own a car to offer carpools.')
        offerCarpool({ onSuccess: () => navigation.navigate('My Carpool') })
    }

    const Header = useMemo(() => () => {
        const insets = useSafeAreaInsets()
        const navigation = useNavigation()
        return (
            <View pointerEvents='box-none' style={{ position: 'absolute', top: insets.top + 20, right: 20, left: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileStack')}>

                    <Avatar
                        size={45}
                        rounded
                        ImageComponent={FastImage}
                        title={getInitials(userData?.full_name)}
                        containerStyle={{ backgroundColor: Colors.PRIMARY }}
                        source={userData?.profileImage ? { uri: userData.profileImage } : null}
                    />

                </TouchableOpacity>
                <View pointerEvents='box-none' style={{ position: 'absolute', top: 0, right: 0, left: 0, alignItems: 'center', justifyContent: 'center' }} >
                    <CustomTabs containerStyle={{ marginTop: 60, ...shadow }} tabs={headerTabs} setState={onDestinationChange} selectedTab={destination} />
                </View>
                <Weather />
            </View>
        )
    }, [destination, userData, company])

    return (
        <View style={{ flex: 1 }} >

            {peakHourModalVisible && <PeakHoursModal onPress={onPeakHourEarn} />}
            <MapComponent destination={destination} />
            {headerTabs && <Header />}
            <BottomContentView style={{ padding: 15, flexDirection: 'row' }} >
                <CustomButton icon='add' onPress={onOfferCarpool} containerStyle={{ flex: 1, ...shadow }} label={'Offer A Carpool'} />
                <View style={{ width: 15 }} />
                <CustomButton icon='people' onPress={() => navigation.navigate('Available Carpools')} disabled={!carpoolOfferAvailable} containerStyle={{ flex: 1, ...shadow }} label={'Join a Carpool'} />
            </BottomContentView>
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

const PeakHoursModal = ({ onPress }) => (
    <Modal animationType='fade' transparent style={{ height: 300 }} >

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >

            <View style={{ margin: 30, backgroundColor: 'white', ...shadow, borderRadius: 20, padding: 20 }} >
                <View style={{ alignItems: 'center', paddingBottom: 20 }}>
                    <Text style={{ fontWeight: '600', fontSize: 18, paddingBottom: 8 }} >Non-peak hours</Text>
                    <Text>Extra credits since you are traveling during non-peak hours</Text>
                </View>

                <CustomButton imageIcon={'carbon'} onPress={onPress} label={'OK EARN +1'} />
            </View>
        </View>
    </Modal>
)

