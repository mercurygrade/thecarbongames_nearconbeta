import React, { useContext, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { shadow } from "../../Common/Styles";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Icon } from "react-native-elements";
import Colors from "../../Common/Colors";
import ImageIcon from "../../Common/ImageIcon";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { getInitials } from "../../Common/Utitliy";
import { TribeDetails } from "../Profile/MyTribe";
import { TribeContext } from "../../Providers/TribeProvider";
import { AuthContext } from "../../Providers/AuthProvider";



const gradients = [
    ['#ef8201', '#bf0808'],
    ['#b8ef19', '#027c33'],
    ['#e195f4', '#773db2']
]

export default Tribes = () => {
    const { user } = useContext(AuthContext)
    const { tribes, myTribe } = useContext(TribeContext)
    return (
        <View style={{ flex: 1 }} >
            <TribeDetails tribe={myTribe} />
            <View style={{ flexDirection: 'row' }}>
                {tribes.filter(tribe => !tribe.members.map(member => member.id).includes(user?.uid)).slice(0,3).map((tribe, index, arr) => (
                    <SmallTribeItem hideDivider={arr.length-1==index} tribe={tribe} key={index} gradient={gradients[index]} />
                ))}
            </View>

            <Ranking data={tribes.map(tribe=>({...tribe, credits : tribe.totalCredits,}))} name={'Players'} />
        </View>
    )
}

const Ranking = ({ data, name }) => {

    const RankItem = ({ item, index, hideDivider }) => {
        return (
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: Colors.GRAY_LIGHT, height: 30, width: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 15 }}>
                        <Text style={{ fontWeight: '500', fontSize: 15 }} >{index + 1}</Text>
                    </View>
                    {
                        item.image != undefined && <Avatar
                            size={35}
                            rounded
                            title={getInitials(item.name)}
                            containerStyle={{ backgroundColor: Colors.PRIMARY, marginRight: 10 }}
                            source={item.image ? { uri: item.image } : null}
                        />
                    }
                    <Text style={{}} >{item.name}</Text>
                    <Text style={{ marginLeft: 'auto', fontSize: 16 }} >{item.credits}</Text>
                </View>
                {!hideDivider && <View style={{ height: 1, backgroundColor: Colors.GRAY, marginVertical: 7 }} />}
            </View>

        )
    }

    return (
        <View style={{ paddingTop: 10 }} >
            <View style={{ flexDirection: 'row', padding: 10, borderRadius: 10, backgroundColor: Colors.GRAY_LIGHT, alignItems: 'center' }}>
                <Text style={{ fontWeight: '500', }} >Rank</Text>
                <Text style={{ fontWeight: '500', paddingLeft: 15 }} >{name}</Text>
                <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' }}>
                    <ImageIcon name='carbon' size={20} color={Colors.PRIMARY} />
                    <Text style={{ fontWeight: '500', paddingLeft: 5 }} >Credits</Text>
                </View>
            </View>
            <View style={{ padding: 10 }}>
                {data.map((item, index) => <RankItem item={item} index={index} key={index} hideDivider={data.length - 1 == index} />)}
            </View>
        </View>
    )
}

const SmallTribeItem = ({ tribe, hideDivider, gradient }) => {
    return (
        <View style={{ borderRadius: 15, flex: 1, backgroundColor: '#0860bf', marginTop: 10, ...shadow, marginRight: hideDivider ? 0 : 10 }} >
            <LinearGradient colors={gradient} useAngle angle={95} style={{ padding: 10, borderRadius: 15, alignItems: 'center' }}>
                <Image source={{ uri: tribe.image }} style={{ height: 70, width: 70, borderRadius: 25 }} />
                <Text style={{ fontWeight: '500', color: Colors.WHITE, paddingTop: 5 }} >#{tribe.rank} {tribe.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' , paddingTop : 5}}>
                    <Text style={{ fontWeight: '500', color: Colors.WHITE }} >{tribe.totalCredits}</Text>
                    <ImageIcon name={'carbon'} size={20} />
                </View>
            </LinearGradient>
        </View>
    )
}