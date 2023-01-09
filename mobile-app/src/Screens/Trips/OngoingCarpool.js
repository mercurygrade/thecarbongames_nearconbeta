import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, BackHandler, Modal, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Colors from '../../Common/Colors'
import { CARPOOL_STATUSES } from '../../Common/Contstants'
import { shadow } from '../../Common/Styles'
import { formatDuration } from '../../Common/Utitliy'
import CustomButton from '../../Components/CustomButton'
import MapComponent from '../../Components/MapComponent'
import { changeStack } from '../../Navigation'
import { AuthContext } from '../../Providers/AuthProvider'
import { TransportContext } from '../../Providers/TransportProvider'

export default OngoingCarpool = ({ route }) => {
    const id = route.params?.id
    const { carpoolOffers, leaveCarpool } = useContext(TransportContext)
    const { user } = useContext(AuthContext)
    const [trackModalVisible, setTrackModalVisibility] = useState(false)

    const carpool = useMemo(() => carpoolOffers.find(item => item.id == id), [route, carpoolOffers])
    const confirmationModalVisible = useMemo(() => carpool?.status != CARPOOL_STATUSES.CONFIRMED, [carpool])
    const passengers = useMemo(() => carpool?.passengers.filter((passenger, index) => passenger.id != user?.uid), [carpool, user])
    const myIndex = useMemo(() => carpool?.passengers.map(passenger => passenger?.id).indexOf(user?.uid), [user, carpool])

    useEffect(() => { // clear the bottom bar button unmount
        const backButtonListener = BackHandler.addEventListener('hardwareBackPress', onGoBack)
        return backButtonListener.remove
    }, [])

    useEffect(() => {
        if (!carpool) {
            changeStack('Bottom Tabs')
            return Alert.alert('Carpool Completed', 'The carpool ride was completed successfully')
        }
    }, [carpool])

    const onGoBack = () => {
        Alert.alert('Leave Carpool', 'Are you sure you want to leave the carpool?', [
            {
                text: 'Yes',
                onPress: () => {
                    leaveCarpool({
                        params: carpool.id,
                        onSuccess: () => changeStack('Bottom Tabs')
                    })
                }
            },
            {
                text: 'No'
            }
        ])
        return false
    }


    const additionalMarkers = passengers?.map(passenger =>
    ({
        ...passenger,
        coordinates: {
            latitude: parseFloat(passenger.coordinates.split(',')[0]),
            longitude: parseFloat(passenger.coordinates.split(',')[1])
        }
    }))


    const Header = useMemo(() => () => {
        const insets = useSafeAreaInsets()
        return (
            <View pointerEvents='box-none' style={{ position: 'absolute', top: insets.top + 10, right: 20, left: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {carpool.status != CARPOOL_STATUSES.CONFIRMED && <Icon onPress={onGoBack} name='arrow-back-ios' containerStyle={{ padding: 10 }} style={{ height: 45, paddingLeft: 5, width: 45, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.75)', ...shadow }} />}
            </View>
        )
    }, [])

    const StatusInfo = () => {
        return (
            <View pointerEvents='none' style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', padding: 15, paddingBottom: 35, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} >

                <View style={{ backgroundColor: 'white', ...shadow, borderRadius: 20, padding: 20, width: '100%', justifyContent: 'center' }} >
                    <View style={{ backgroundColor: Colors.PRIMARY, padding: 12, marginTop: -20, marginHorizontal: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginBottom: 20 }}>
                        <Text style={{ textAlign: 'center', color: Colors.WHITE, fontSize: 18, fontWeight: '500' }}>Carpool Started</Text>
                    </View>
                    <Text style={{ paddingLeft: 10, fontSize: 16, textAlign: 'center' }} >You will get picked up in {formatDuration(myIndex * 520 * .8879, { largest: 1 })}</Text>
                </View>
            </View>
        )
    }

    const Confirmation = () => {
        return (
            <View pointerEvents='none' style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', padding: 15, paddingBottom: 35, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} >
                <View style={{ backgroundColor: 'white', ...shadow, borderRadius: 20, padding: 20, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                    <ActivityIndicator size={'large'} />
                    <Text style={{ paddingLeft: 10, fontSize: 16 }} >Waiting for confirmation</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }} >

            {/* {trackModalVisible && <TrackJourneyModal onPress={() => setTrackModalVisibility(false)} />} */}
            <MapComponent mapProps={{ showsUserLocation: true, followsUserLocation: carpool.status == CARPOOL_STATUSES.CONFIRMED }} additionalMarkers={additionalMarkers} carpool={carpool} />
            <Header />

            {confirmationModalVisible == false && <StatusInfo />}
            {confirmationModalVisible == true && <Confirmation />}
        </View>
    )
}

const TrackJourneyModal = ({ onPress }) => (
    <Modal animationType='fade' transparent >

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', padding: 15, paddingBottom: 100 }} >

            <View style={{ backgroundColor: 'white', ...shadow, borderRadius: 20, padding: 20, width: '100%' }} >
                <View style={{ alignItems: 'center', paddingBottom: 20 }}>
                    <Text style={{ fontWeight: '600', fontSize: 18, paddingBottom: 8 }} >Track Your Journey?</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <CustomButton containerStyle={{ flex: 1 }} imageIcon="carbon" onPress={onPress} label={'YES EARN +1'} />
                    <View style={{ width: 20 }} />
                    <CustomButton containerStyle={{ flex: 1 }} secondary onPress={onPress} label={'NO'} />
                </View>

            </View>
        </View>
    </Modal>
)

const ConfirmationModal = ({ visible }) => (
    <Modal animationType='fade' visible={visible} transparent >

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', padding: 15, paddingBottom: 100 }} >

            <View style={{ backgroundColor: 'white', ...shadow, borderRadius: 20, padding: 20, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                <ActivityIndicator size={'large'} />
                <Text style={{ paddingLeft: 10, fontSize: 16 }} >Waiting for confirmation</Text>
            </View>
        </View>
    </Modal>
)

