import axios from "axios";
import React, { useEffect, useState } from "react";
import base64 from "react-native-base64";
import firestore from '@react-native-firebase/firestore'
import functions from '@react-native-firebase/functions'
import auth from '@react-native-firebase/auth'
// import firebaseWeb from "firebase";

// functions().useEmulator('localhost', 5001)
// firestore().useEmulator('localhost', 8080)
// auth().useEmulator('http://localhost:9099')
// firebaseWeb.database().useEmulator('localhost', 9000)


export const AppContext = React.createContext()

const appKey = 'expodev8-carbontracker2-v1'
const appSecret = 'o6fbzYG7jcBxCxkls4VD1PBTDR9seTTd1UmHlgPbw58'
const encodedToken = base64.encode(`${appKey}:${appSecret}`)

export default AppProvider = ({ children }) => {

    const [loading, setLoading] = useState(false)
    const [accessToken, setAccessToken] = useState()
    const [bottomBarContent, setBottomBarContent] = useState()

    const getToken = () => {
        axios.post('https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token',
            {
                "grant_type": "client_credentials",
                "appName": "carbontracker2",
                "appVersion": "v1",
                "hostTenant": "expodev8",
                "userTenant": "expodev8"
            },
            { headers: { 'Content-Type': 'application/json', 'X-SPACE-AUTH-KEY': `Bearer ${encodedToken}` } })
            .then(res => {
                console.log('TOKEN', res.data.access_token)
                setAccessToken(res.data.access_token)
            }).catch(err => console.log('ERR', JSON.stringify(err.response, null, 2)))
    }

    // useEffect(() => getToken(), [])

    return (
        <AppContext.Provider
            value={{
                bottomBarContent,
                setBottomBarContent,
                accessToken,
                loading,
                setLoading
            }} >
            {children}
        </AppContext.Provider>
    )
}