import { useContext, useEffect, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform, ToastAndroid } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from 'react-native-geolocation-service';
import { STATUSES } from '../Providers';
import { AppContext } from '../Providers/AppProvider';

const [YES, NO, WAIT] = [1, 2, 3]

export default useGeolocation = ({ dependencies = [], interval, showLoading = false } = {}) => {

    const [position, setPosition] = useState(STATUSES.loading)
    const [intervalCount, setIntervalCount] = useState(0)
    const { setLoading } = useContext(AppContext)

    useEffect(() => {
        let timeoutId
        if (interval) timeoutId = setInterval(() => setIntervalCount(cv => cv + 1), interval)
        return () => clearInterval(timeoutId)
    }, [])

    useEffect(() => {
        if (showLoading) setLoading(position == STATUSES.loading)
    }, [position])

    useEffect(() => {
        onInit()
    }, [...dependencies, intervalCount])

    const onInit = () => {
        getCurrentPosition()
            .then(setPosition)
            .catch(err => setPosition(STATUSES.error))
    }

    return { position, retry: onInit }
}

const requestLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the fine location");
            return true
        } else {
            Alert.alert('Notice', 'The carbon games needs your location to work properly.')
            console.log("Location permission denied");
        return false
        }
    } catch (err) {
        console.warn(err);
        return false
    }
};

const askLocationService = async () => {
    try {
        if (Platform.OS == 'android') {
            let access = await requestLocationPermission()
            if (access) {
                let result = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000, });
                return result == 'already-enabled' ? YES : YES
            } else return NO
        } else {
            let result = await Geolocation.requestAuthorization("always")
            if (result == "granted" || result == "restricted") return YES
            else return NO
        }
    } catch (error) {
        console.log(error)
        return NO
    }
};

const getCurrentPosition = () => {
    return new Promise(async (resolve, reject) => {
        let permission = await askLocationService()
        if (permission == YES) Geolocation.getCurrentPosition(info => resolve(info), error => console.log(error), { enableHighAccuracy: true, timeout: 30000, maximumAge: 1000 })
        else {
            Alert.alert('Location Access', 'This app needs your location.', [
                { text: 'Give Access', onPress: () => Linking.openSettings() },
                { text: 'Cancel', },
            ])
            reject("NO PERMISSION")
        }
    })
};