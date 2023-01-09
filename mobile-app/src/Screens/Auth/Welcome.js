import React, { useContext, useEffect, useMemo, useState } from "react"
import { Image, LayoutAnimation, Platform, ScrollView, StatusBar, Text, useWindowDimensions, View } from "react-native"
import { Icon } from "react-native-elements"
import { TextInput, TouchableOpacity } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Colors from "../../Common/Colors"
import CustomButton from "../../Components/CustomButton"
import { changeStack } from "../../Navigation"
import { AuthContext } from "../../Providers/AuthProvider"
import changeNavigationBarColor from 'react-native-navigation-bar-color';

// image assets

// import welcome_illustration from '../../Assets/welcome_illustration.png'
// import logo from '../../Assets/logo.png'

import welcome_illustration from '../../Assets/welcome_illustration.png'
import logo from '../../Assets/logo.png'

export default Welcome = ({navigation}) => {
    const { signIn } = useContext(AuthContext)
    const insets = useSafeAreaInsets()
    const [loginMode, setLoginMode] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisibility] = useState(false)
    const windowDimensions = useWindowDimensions()

    useEffect(() => {
        changeNavigationBarColor('white', true, true)
    }, [])

    const onLoginMode = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setLoginMode(cv => !cv)
    }

    const loginDisabled = useMemo(() => !(email && password))

    const onLogin = () => {
        signIn({ email, password }, () => changeStack('Bottom Tabs'))
    }

    return (
        <View style={{ flexGrow: 1, backgroundColor: 'white', height: windowDimensions.height - (insets.top + (Platform.OS == 'ios' ? insets.bottom : 40)), alignItems: 'center', padding: 15, justifyContent: 'flex-end', paddingBottom: insets.bottom + 15, }} >
            <StatusBar backgroundColor={'white'} barStyle='dark-content' />
            {/* <View style={{ flex: 1, backgroundColor : 'red' }} /> */}
            {loginMode && <View style={{ alignSelf: 'stretch', }} >
                <Image style={{ width: '70%', height: 80, resizeMode: 'contain', alignSelf: 'center', marginBottom: 20 }} source={logo} />
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize='none'
                    keyboardType='email-address'
                    placeholder="Email"
                    placeholderTextColor={Colors.GRAY_DARK}
                    style={{ backgroundColor: 'white', borderRadius: 8, borderColor: Colors.GRAY_DARK, borderWidth: 1, paddingHorizontal: 15, marginBottom: 15, color: Colors.BLACK_100, height: 50 }} />

                <View>
                    <TextInput
                        secureTextEntry={!passwordVisible}
                        value={password}
                        autoCapitalize='none'
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor={Colors.GRAY_DARK}
                        style={{ backgroundColor: 'white', borderRadius: 8, borderColor: Colors.GRAY_DARK, borderWidth: 1, paddingHorizontal: 15, paddingRight: 45, marginBottom: 15, color: Colors.BLACK_100, height: 50 }} />
                    <Icon color={Colors.BLACK_80} onPress={() => setPasswordVisibility(cv => !cv)} containerStyle={{ position: 'absolute', top: 13, right: 15 }} name={passwordVisible ? 'visibility-off' : 'visibility'} />
                </View>

                <CustomButton disabled={loginDisabled} onPress={onLogin} label={'LOGIN'} containerStyle={{ alignSelf: 'stretch' }} />

                <TouchableOpacity style={{ paddingVertical: 10 }} >
                    <Text style={{ color: Colors.PRIMARY, fontWeight: 'bold' }} >Forgot password</Text>
                </TouchableOpacity>

                {Platform.OS == 'android' && <Image style={{ width: '100%', height: windowDimensions.width * .6, resizeMode: 'cover',borderRadius: 20 }} source={welcome_illustration} />}


            </View>}

            {!loginMode && <Text style={{ fontSize: 22, color: Colors.BLACK_60, textAlign: 'center', paddingBottom: 30 }} >Gamifying the transition{'\n'} to a <Text style={{ color: Colors.RED }} >low-carbon</Text> future</Text>}
            {!(loginMode && Platform.OS == 'android') && <Image style={{ width: '100%', height: windowDimensions.width * .6, resizeMode: 'cover', borderRadius : 20 }} source={welcome_illustration} />}
            {!loginMode && <Image style={{ width: '70%', height: 80, resizeMode: 'contain', marginBottom: 30 }} source={logo} />}
            {!loginMode && <CustomButton onPress={onLoginMode} label={'LOGIN'} containerStyle={{ alignSelf: 'stretch' }} />}

            <TouchableOpacity onPress={()=>navigation.navigate('SignUp')} style={{marginTop : 20}} >
                <Text >Don't have an account? <Text style={{ fontWeight: 'bold', color: Colors.PRIMARY }} >Sign Up</Text></Text>
            </TouchableOpacity>
        </View>
    )
}