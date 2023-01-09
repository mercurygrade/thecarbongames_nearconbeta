import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { shadow } from "../../Common/Styles";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Icon } from "react-native-elements";
import Colors from "../../Common/Colors";
import ImageIcon from "../../Common/ImageIcon";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { getInitials } from "../../Common/Utitliy";
import { AuthContext } from "../../Providers/AuthProvider";
import { UserContext } from "../../Providers/UserProvider";


export default Players = () => {
    const {user, userData} = useContext(AuthContext)
    const {getUsersByCompany} = useContext(UserContext)
    const [players,setPlayers] = useState([])

    useEffect(()=>{
        getUsersByCompany(userData?.company).then(setPlayers)
    },[])


    return (
        <View style={{ flex: 1 }} >
            <PlayerDetail player={players.find(player=>player.id==user?.uid)} />
            <Ranking data={players.map(player=>({credits: player.credits_balance, name : `${player.full_name}`, image : player.profileImage||false}))} name={'Players'} />
        </View>
    )
}

const PlayerDetail = ({ player }) => {
    return (
        <View style={{ borderRadius: 15, backgroundColor: '#0860bf', marginTop: 20, ...shadow }} >
            <LinearGradient colors={['#0860bf', '#01adef']} useAngle angle={95} style={{ padding: 10, borderRadius: 15 }}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: Colors.WHITE, }} >#{player?.rank}</Text>
                    <View style={{ flexDirection: 'row', padding: 8, backgroundColor: Colors.WHITE, borderRadius: 40, ...shadow, alignItems: 'center' }} >
                        <Icon size={16} name="arrow-downward" color={Colors.RED} />
                        <Text style={{ fontSize: 14, color: Colors.RED }} >-2</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <AnimatedCircularProgress
                            size={120}
                            width={8}
                            fill={65}
                            rotation={360}
                            tintColor="#00e0ff"
                            tintColorSecondary={Colors.GREEN}
                            onAnimationComplete={() => console.log('onAnimationComplete')}
                            backgroundColor={Colors.WHITE} />
                        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }} >
                            <Text style={{ color: Colors.WHITE, paddingBottom: 5 }}>LEAFLING</Text>
                            <Text style={{ color: Colors.GREEN }}>SEE MORE</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'space-between', paddingLeft: 10 }}>
                        <View>
                            <Text style={{ fontSize: 30, color: Colors.WHITE }} >{player?.full_name}</Text>
                            <Text style={{ color: Colors.WHITE }} >#4th in the ranking</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <Text style={{ color: Colors.WHITE }} >Your balance</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: Colors.WHITE }} >1420</Text>
                                    <ImageIcon name='carbon' size={20} />
                                </View>
                            </View>
                            <View style={{ width: 1, backgroundColor: Colors.WHITE, marginHorizontal: 10 }} />
                            <View>
                                <Text style={{ color: Colors.WHITE }} >Next League</Text>
                                <Text style={{ color: Colors.WHITE }} >Flowering</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    )
}

const Ranking = ({ data, name }) => {

    const RankItem = ({ item, index, hideDivider }) => {
        return (
            <View>
                <View style={{ flexDirection: 'row', alignItems :'center' }}>
                    <View style={{ backgroundColor: Colors.GRAY_LIGHT, height: 30, width: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' , marginRight : 15}}>
                        <Text style={{ fontWeight: '500', fontSize: 15 }} >{index + 1}</Text>
                    </View>
                    {
                        item.image!=undefined && <Avatar
                            size={35}
                            rounded
                            title={getInitials(item.name)}
                            containerStyle={{ backgroundColor: Colors.PRIMARY, marginRight : 10 }}
                            source={item.image ? { uri: item.image } : null}
                        />
                    }
                    <Text style={{}} >{item.name}</Text>
                    <Text style={{marginLeft :'auto', fontSize : 16}} >{item.credits}</Text>
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