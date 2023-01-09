import React, { useContext, useEffect, useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator } from "react-native";
import { Avatar, Icon } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../Common/Colors";
import { STATES } from "../../Common/Contstants";
import ImageIcon from "../../Common/ImageIcon";
import { shadow } from "../../Common/Styles";
import { capitalizeFirstLetter, getInitials } from "../../Common/Utitliy";
import { TribeContext } from "../../Providers/TribeProvider";

export default MyTribe = ({ navigation }) => {
    const insets = useSafeAreaInsets()
    const { myTribe } = useContext(TribeContext)



    const Header = () => {
        return (
            <View style={{ paddingBottom: 8 }}>
                <Icon containerStyle={{ alignSelf: 'flex-start' }} iconStyle={{ paddingBottom: 8 }} onPress={() => navigation.goBack()} name="arrow-back-ios" />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                    <Text style={{ fontSize: 28, }} >My Tribe</Text>
                    <View style={{ flexDirection: 'row', padding: 8, backgroundColor: Colors.WHITE, borderRadius: 40, ...shadow, alignItems: 'center' }} >
                        <ImageIcon size={20} name="carbon" color={Colors.PRIMARY} />
                        <Text style={{ fontSize: 16, paddingLeft: 5 }} >1270</Text>
                    </View>
                </View>
            </View>
        )
    }

    const ListHeader = () => {
        return (
            <View>
                <Header />
                <TribeDetails tribe={myTribe} />
                <TribeLeaderItem item={myTribe?.members?.find(member => member.id == myTribe.leader)} />
            </View>
        )
    }

    return (
        <FlatList
            data={myTribe?.members?.filter(member => member.id != myTribe.leader)}
            renderItem={MemberItem}
            numColumns={2}
            contentContainerStyle={{ padding: 15, paddingTop: insets.top + 15, paddingBottom: 35, backgroundColor: 'white', flexGrow: 1 }}
            ListHeaderComponent={() => <ListHeader />} />
    )
}

export const TribeDetails = ({ tribe }) => {
    return (
        <TouchableOpacity style={{ borderRadius: 15, backgroundColor: '#0860bf', marginTop: 20, ...shadow }} >
            <LinearGradient colors={['#0860bf', '#01adef']} useAngle angle={95} style={{ padding: 10, borderRadius: 15 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                    <Text style={{ fontSize: 24, color: 'white', }} >#{tribe?.rank}</Text>
                    <View style={{ flexDirection: 'row', padding: 8, backgroundColor: Colors.WHITE, borderRadius: 40, ...shadow, alignItems: 'center' }} >
                        <Icon size={14} name="arrow-upward" color={Colors.PRIMARY} />
                        <Text style={{ fontSize: 14, color: Colors.PRIMARY }} >+2</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <Image source={{ uri: tribe.image }} style={{ width: 110, height: 110, marginTop: 5, borderRadius: 30 }} />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ color: 'white', fontSize: 28 }} >{tribe.name}</Text>
                        <Text style={{ color: 'white' }} >Your tribe</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 'auto', marginBottom: 10 }} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'white', fontSize: 20 }} >{tribe.totalCredits}</Text>
                                <ImageIcon name='carbon' size={20} />
                            </View>
                            <View style={{ backgroundColor: 'white', width: 1, alignSelf: 'stretch', marginHorizontal: 10 }} />
                            <View style={{}}>
                                <Text style={{ color: 'white', }} >Average</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 16 }} >{tribe.averageCredits}</Text>
                                    <ImageIcon name='carbon' size={16} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            </LinearGradient>
        </TouchableOpacity>
    )
}

const TribeLeaderItem = ({ item }) => {
    return (
        <TouchableOpacity style={{ marginTop: 15, padding: 10, flexDirection: 'row', borderRadius: 15, ...shadow, backgroundColor: 'white' }} >
            {/* <Image source={{ uri: tribeLeaderDummyProfile }} style={{ width: 110, height: 110, marginTop: 5, borderRadius: 30 }} /> */}
            <Avatar
                size={110}
                title={getInitials(item?.first_name + ' ' + item?.last_name)}
                containerStyle={{ backgroundColor: Colors.PRIMARY, marginTop: 5, borderRadius: 30, overflow: 'hidden' }}
                source={item?.profileImage ? { uri: item?.profileImage } : null}
            />
            <View style={{ paddingLeft: 10, flex: 1 }} >
                <Text style={{ color: 'black', fontWeight: '600', fontSize: 16 }} >Tribal Leader</Text>
                <Text style={{ fontSize: 26, color: 'black', }} >{item.first_name + ' ' + item.last_name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ImageIcon name='carbon' color={Colors.PRIMARY} size={16} />
                    <Text style={{ color: 'black', fontSize: 16 }} >{item.credits || 0}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 10, justifyContent: 'space-between' }}>
                    <View style={{ padding: 8, paddingHorizontal: 14, borderRadius: 50, borderWidth: 1, borderColor: Colors.GRAY }} >
                        <Text style={{ color: 'black', fontSize: 16 }} >{capitalizeFirstLetter(item.league)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ImageIcon size={32} name='bike' containerStyle={{ paddingTop: 5 }} />
                        <View style={{ paddingLeft: 5 }} >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'black', fontSize: 12 }} >bicycle</Text>
                                <ImageIcon name={'bolt'} size={12} />
                            </View>
                            <Text style={{ color: 'black', fontSize: 12 }} >private</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const MemberItem = ({ item, index }) => {
    return (
        <TouchableOpacity style={{ marginTop: 15, padding: 10, borderRadius: 15, ...shadow, backgroundColor: 'white', flex: 1, marginRight: index % 2 == 0 ? 15 : 0 }} >
            <View style={{ flexDirection: 'row' }}>
                {/* <Image source={{ uri: memberDummyProfile }} style={{ width: 65, height: 65, marginTop: 5, borderRadius: 25 }} /> */}
                <Avatar
                    size={65}
                    title={getInitials(item?.first_name + ' ' + item?.last_name)}
                    containerStyle={{ backgroundColor: Colors.PRIMARY, marginTop: 5, borderRadius: 30, overflow: 'hidden' }}
                    source={item?.profileImage ? { uri: item?.profileImage } : null}
                />
                <View style={{ paddingLeft: 5, flex: 1 }} >
                    <Text style={{ color: 'black', fontSize: 14, fontWeight: '500' }} >{item?.first_name + ' ' + item?.last_name}</Text>

                    <View style={{ padding: 8, marginTop: 5, borderRadius: 50, borderWidth: 1, borderColor: Colors.GRAY }} >
                        <Text style={{ color: 'black', fontSize: 12, textAlign: 'center' }} >{capitalizeFirstLetter(item.league)}</Text>
                    </View>
                </View>

            </View>
            <View style={{ height: 1, backgroundColor: Colors.GRAY, marginVertical: 8 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ImageIcon size={32} name='bike' containerStyle={{ paddingTop: 5 }} />
                    <View style={{ paddingLeft: 5 }} >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: 'black', fontSize: 12 }} >bicycle</Text>
                            {/* <ImageIcon name={'bolt'} size={12} /> */}
                        </View>
                        <Text style={{ color: 'black', fontSize: 12 }} >private</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ImageIcon name='carbon' color={Colors.PRIMARY} size={16} />
                    <Text style={{ color: 'black', fontSize: 14 }} >{item.credits || 0}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}