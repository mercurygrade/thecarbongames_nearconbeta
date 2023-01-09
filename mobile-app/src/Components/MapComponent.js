import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ActivityIndicator, DeviceEventEmitter, Image, Platform, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import polyline from '@liberty-rider/flexpolyline'
import { shadow } from '../Common/Styles';
import { Avatar, Icon } from 'react-native-elements';
import { DESTINATIONS } from '../Common/Contstants';
import Colors from '../Common/Colors';
import { GOOGLE_MAPS_APIKEY, TransportContext } from '../Providers/TransportProvider';
import { getCenter, getInitials } from '../Common/Utitliy';
import MapViewDirections from 'react-native-maps-directions';
import googlePolyline from 'google-polyline'
import { AuthContext } from '../Providers/AuthProvider';
import { USER_TYPES } from '../Models/User';


export default MapComponent = ({ additionalMarkers, carpool, mapProps }) => {

    const mapRef = useRef(null)

    const { userData } = useContext(AuthContext)
    const { defaultParams } = useContext(TransportContext)

    if (!defaultParams?.origin || !defaultParams?.destination) return <ActivityIndicator style={{ flex: 1, }} color={Colors.PRIMARY} size='large' />

    return (
        <View style={{ flex: 1 }} >
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                // camera={{ zoom : 10, center:  }}
                initialRegion={{
                    ...getCenter(defaultParams),
                    latitudeDelta: 0.0222,
                    longitudeDelta: 0.0821,
                }}
                {...mapProps}
            >

                {carpool?.directions?.routes && <Polyline
                    coordinates={googlePolyline.decode(carpool?.directions?.routes?.[0]?.overview_polyline?.points).map(arr => ({ latitude: arr[0], longitude: arr[1] }))}
                    strokeColor={Colors.BLACK_80} // fallback for when `strokeColors` is not supported by the map-provider
                    strokeWidth={6}
                />}

                <CustomMarker active={false} iconName={getMarkerIcon('origin', defaultParams.type, userData.type)} coordinates={{ latitude: parseFloat(defaultParams.origin.split(',')[0]), longitude: parseFloat(defaultParams.origin.split(',')[1]) }} />
                <CustomMarker active={true} iconName={getMarkerIcon('destination', defaultParams.type, userData.type)} coordinates={{ latitude: parseFloat(defaultParams.destination.split(',')[0]), longitude: parseFloat(defaultParams.destination.split(',')[1]) }} />
                {additionalMarkers?.map((marker, index) => !marker.name ? <CustomMarker iconName={'gps-fixed'} key={index} {...marker} /> : <AvatarMarker key={index} {...marker} />)}

            </MapView>
        </View>
    )
}

export const CustomMarker = ({ coordinates, iconName, active }) => (
    <Marker
        style={{ paddingBottom: Platform.OS == 'ios' ? 30 : 0, ...shadow }}
        centerOffset={{ x: 0, y: 0 }}
        coordinate={coordinates} >
        <Image style={{ height: 40, resizeMode: 'contain', tintColor: active ? Colors.DARK_TURQUOISE : Colors.BLACK_60 }} source={require('../Assets/marker.png')} />
        <Icon containerStyle={{ position: 'absolute', top: 4, left: 0, right: 0 }} size={20} name={iconName} color='white' />
    </Marker>
)

export const AvatarMarker = ({ coordinates, iconName, active, ...props }) => {
    return (
        <Marker
            style={{ ...shadow }}
            centerOffset={{ x: 0, y: 0 }}
            coordinate={coordinates} >
            <Avatar
                size={30}
                rounded
                title={getInitials(props?.name)}
                containerStyle={{ backgroundColor: Colors.PRIMARY }}
                source={props?.profile ? { uri: props.profile } : null}
            />
        </Marker>
    )
}

export const getMarkerIcon = (name, type, userType) => {
    switch (name) {
        case 'origin': {
            switch (type) {
                case 'goto work': return 'house'
                case 'goto home': return userType == USER_TYPES.EVENT ? 'gps-fixed' : 'work'
                case 'meeting': return 'gps-fixed'
            }
        }
        case 'destination': {
            switch (type) {
                case 'goto work': return userType == USER_TYPES.EVENT ? 'gps-fixed' : 'work'
                case 'goto home': return 'house'
                case 'meeting': return 'gps-fixed'
            }
        }
    }
}