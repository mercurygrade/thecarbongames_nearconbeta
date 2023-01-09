import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import MapView from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Colors from '../../Common/Colors'
import { shadow } from '../../Common/Styles'
import { getCenter } from '../../Common/Utitliy'
import CustomButton from '../../Components/CustomButton'
import MapComponent from '../../Components/MapComponent'
import { AuthContext } from '../../Providers/AuthProvider'
import { TransportContext } from '../../Providers/TransportProvider'

export default ChangeAddress = () => {

    const navigation = useNavigation()
    const { updateUserData, userData } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [region, setRegion] = useState()

    useEffect(() => { setTimeout(() => setLoading(false), 500) }, [])

    const Header = useMemo(() => () => {
        const insets = useSafeAreaInsets()

        return (
            <View pointerEvents='box-none' style={{ position: 'absolute', top: insets.top + 10, right: 20, left: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Icon onPress={() => navigation.goBack()} name='arrow-back-ios' containerStyle={{ padding: 10 }} style={{ height: 45, paddingLeft: 5, width: 45, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,.75)', ...shadow }} />
            </View>
        )
    }, [])

    const onSelect = ()=>updateUserData({home_coordinates : region.latitude+','+region.longitude}, {showLoading : true, onSuccess : ()=>navigation.goBack()})

    return (
        <View style={{ flex: 1 }} >
            <ActivityIndicator size={'large'} color={Colors.PRIMARY} style={{ alignSelf: 'center', height: '100%', position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }} />

            {!loading && <MapView
                style={{ flex: 1 }}
                onRegionChangeComplete={setRegion}
                initialRegion={{
                    latitude : parseFloat(userData?.home_coordinates?.split(',')[0]),
                    longitude : parseFloat(userData?.home_coordinates?.split(',')[1]),
                    latitudeDelta: 0.0222,
                    longitudeDelta: 0.0821,
            }}
            />}

            <Header />

            <View pointerEvents='none' style={{ alignSelf: 'center', height: '100%', position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name='place' size={50} color={Colors.DARK_TURQUOISE} containerStyle={{ paddingBottom: 0 }} />
            </View>

            <CustomButton onPress={onSelect} icon='gps-fixed' containerStyle={{ position: 'absolute', bottom: 40, left: 20, right: 20, ...shadow }} label={'SELECT PLACE'} />

        </View>
    )
}



