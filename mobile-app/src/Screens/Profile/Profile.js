import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StatusBar, Text, View } from "react-native";
import { Avatar, Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../Common/Colors";
import ImageIcon from "../../Common/ImageIcon";
import { shadow } from "../../Common/Styles";
import { AuthContext } from "../../Providers/AuthProvider";
import { launchImageLibrary } from 'react-native-image-picker'
import { getInitials } from "../../Common/Utitliy";
import { StorageContext } from "../../Providers/StorageProvider";
import { utils } from '@react-native-firebase/app';
import { TransportContext } from "../../Providers/TransportProvider";
import FastImage from "react-native-fast-image";


export default Profile = () => {
    const insets = useSafeAreaInsets()
    const navigation = useNavigation()
    const [uploading, setUploading] = useState(false)
    const { signOut, userData, updateUserData ,user } = useContext(AuthContext)
    const {carpoolOffers} = useContext(TransportContext)
    const { upload } = useContext(StorageContext)

    const onImageSelected = (res) => {
        if (!res || res.didCancel) return
        setUploading(true)
        upload(res.assets[0].uri, (url) => {
            setUploading(false)
            updateUserData({ profileImage: url }, { showLoading: false })
        })
    }

    const onChangeAddress = ()=>{
        if(carpoolOffers.map(c=>c.id).includes(user?.uid)) return Alert.alert('Change Address', "You can't change your address while you have an active carpool offer.")
        navigation.navigate('Change Address')
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 15, flexGrow: 1, backgroundColor: 'white' }} >
            <StatusBar barStyle='dark-content' />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }} >
                <ImageIcon size={35} name="edit" color={'black'} />
                <View style={{ width: 1, alignSelf: 'stretch', marginHorizontal: 10, marginVertical: 5, backgroundColor: Colors.GRAY }} />
                <TouchableOpacity onPress={onChangeAddress} >
                    <ImageIcon size={35} name="maps-home" color={'black'} />
                </TouchableOpacity>
                <View style={{ width: 1, alignSelf: 'stretch', marginHorizontal: 10, marginVertical: 5, backgroundColor: Colors.GRAY }} />
                <Icon onPress={signOut} size={35} name='logout' />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 35 }}>
                <View style={{}}>
                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ padding: 3, borderWidth: 3, borderColor: Colors.PRIMARY, borderRadius: 60 }}>
                            <Avatar
                                onPress={() => launchImageLibrary({ includeBase64: false, includeExtra: true }, onImageSelected)}
                                size={100}
                                rounded
                                ImageComponent={FastImage}
                                title={getInitials(userData?.full_name)}
                                containerStyle={{ backgroundColor: Colors.PRIMARY }}
                                source={userData?.profileImage ? { uri: userData.profileImage } : null}
                            />
                            {uploading && <ActivityIndicator size={'large'} style={{ backgroundColor: Colors.BLACK_100 + '50', height: 100, width: 100, borderRadius: 50, position: 'absolute', top: 3, left: 3 }} color={Colors.WHITE} />}
                        </View>
                    </View>

                    <Text style={{ fontSize: 35, color: Colors.BLACK_100 }} >{userData?.first_name}</Text>
                    <Text style={{ fontSize: 35, color: Colors.GRAY_DARK, marginTop: -10 }}  >{userData?.last_name}</Text>
                </View>

                <View style={{ flexDirection: 'row', borderRadius: 50, padding: 8, alignSelf: 'center', alignItems: 'center', paddingHorizontal: 10, marginBottom: 75, borderWidth: 1, borderColor: Colors.GRAY }}>
                    <Text style={{ paddingRight: 5 }}>Flowering</Text>
                    <ImageIcon size={16} name={'info-outlined'} />
                </View>
            </View>

            <View style={{ marginVertical: 5, marginHorizontal: -20 }} >
                <Btn icon={'users'} iconColor='#a28a80' label={'My tribe'} onPress={() => navigation.navigate('My Tribe')} />
                <Btn icon={'directions'} iconColor='#add57f' label={'Saved routes'} onPress={() => navigation.navigate('Saved Routes')} />
                <Btn icon={'shield'} iconColor='#fdb64e' label={'My badges'} onPress={() => navigation.navigate('My Tribe')} />
                <Btn icon={'shopping'} iconColor='#f16393' label={'Redeemed prizes'} onPress={() => navigation.navigate('Redeemed Prizes')} />
                {/* <Btn icon={'car'} iconColor='#ac6bad' label={'Carpooling'} onPress={() => navigation.navigate('Carpooling')} /> */}
                <Btn icon={'car'} iconColor='#ac6bad' label={'Past Carpools'} onPress={() => navigation.navigate('Completed Carpools')} />
                <Btn icon={'graph'} iconColor='#48b8ac' label={'Statistics'} onPress={() => navigation.navigate('Statistics')} />
            </View>

        </ScrollView>
    )
}

const Btn = ({ label, icon, iconColor, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }} >
            <ImageIcon name={icon} containerStyle={{ backgroundColor: iconColor, padding: 8, borderRadius: 17, marginRight: 20 }} />
            <Text style={{ fontSize: 16 }} >{label}</Text>
            <View style={{ backgroundColor: 'white', margin: 10, marginRight: 20, marginLeft: 'auto', borderRadius: 50, ...shadow, shadowOpacity: .1, padding: 12 }} >
                <Icon size={16} name='arrow-forward-ios' />
            </View>
        </TouchableOpacity>
    )
}