import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { Text } from 'react-native'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import MapView, { Marker } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Colors from '../../Common/Colors'
import ImageIcon from '../../Common/ImageIcon'
import { shadow } from '../../Common/Styles'
import { getCenter } from '../../Common/Utitliy'
import CustomButton from '../../Components/CustomButton'
import MapComponent from '../../Components/MapComponent'
import { AuthContext } from '../../Providers/AuthProvider'
import { TransportContext } from '../../Providers/TransportProvider'

export default SetOriginDestination = () => {

    const navigation = useNavigation()
    const { userData, company } = useContext(AuthContext)
    const { setDefaultParams } = useContext(TransportContext)
    const [region, setRegion] = useState()
    const [origin, setOrigin] = useState()



    const Header = useMemo(() => () => {

        return (
            <View pointerEvents='box-none' style={{ position: 'absolute', top: 20, right: 20, left: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Icon onPress={() => navigation.goBack()} name='arrow-downward' containerStyle={{ padding: 10 }} style={{ height: 45, paddingTop: 3, width: 45, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.75)', ...shadow }} />
            </View>
        )
    }, [])

    const onSelect = () => {
        if (!origin) return setOrigin(region)
        setDefaultParams({ type: 'meeting', origin: `${origin.latitude},${origin.longitude}`, destination: `${region.latitude},${region.longitude}` })
        navigation.goBack()
    }

    return (
        <View style={{ flex: 1 }} >
            <ActivityIndicator size={'large'} color={Colors.PRIMARY} style={{ alignSelf: 'center', height: '100%', position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }} />

            <MapView
                style={{ flex: 1 }}
                onRegionChangeComplete={setRegion}
                initialRegion={{
                    latitude: parseFloat(userData?.home_coordinates?.split(',')[0]),
                    longitude: parseFloat(userData?.home_coordinates?.split(',')[1]),
                    latitudeDelta: 0.0222,
                    longitudeDelta: 0.0821,
                }}
            >
                {origin && <CustomMarker coordinates={origin} />}

                {company?.branches?.map((branch, index) => (
                    <Marker
                        key={index}
                        title={branch.name}
                        coordinate={{ latitude: parseFloat(branch.coordinates.split(',')[0]), longitude: parseFloat(branch.coordinates.split(',')[1]) }} />
                ))}

            </MapView>

            <Header />

            <View style={{ position: 'absolute', backgroundColor: Colors.BLACK_100 + 'aa', top: 75, left: 75, right: 75, borderRadius: 10 }} >
                <Text style={{ padding: 10, color: Colors.WHITE, textAlign: 'center' }} >{origin ? 'And now, Please select your destination' : 'First you have to select your starting location.'}</Text>
            </View>

            <View pointerEvents='none' style={{ alignSelf: 'center', height: '100%', position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
                <ImageIcon name='aim' size={50} color={Colors.BLACK_100} containerStyle={{ paddingBottom: 34.5, opacity: .5 }} />
            </View>

            <CustomButton onPress={onSelect} icon='gps-fixed' containerStyle={{ position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: Colors.BLACK_80, borderWidth: 0, ...shadow }} label={origin ? 'SELECT DESTINATION' : 'SELECT ORIGIN'} />

        </View>
    )
}

const CustomMarker = ({ coordinates }) => (
    <Marker
        title='Starting Location'
        style={{ ...shadow }}
        centerOffset={{ x: 0, y: 0 }}
        coordinate={coordinates} >
        <Icon name='trip-origin' size={15} color={Colors.WHITE} containerStyle={{ padding: 3, backgroundColor: Colors.BLACK_80, borderRadius: 20 }} />
    </Marker>
)




