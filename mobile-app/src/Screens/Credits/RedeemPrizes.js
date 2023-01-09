import React, { useContext, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import Colors from "../../Common/Colors";
import ImageIcon from "../../Common/ImageIcon";
import { shadow } from "../../Common/Styles";
import { Image } from "react-native";
import { PrizeContext } from "../../Providers/PrizeProvider";
import { AuthContext } from "../../Providers/AuthProvider";

export default RedeemPrizes = () => {
    const { prizes } = useContext(PrizeContext)
    const Header = () => {
        return (
            <View style={{ padding: 15 }} >
                <Title text={'Department Rewards'} />
                <PrizeItem item={prizes[0]} />
            </View>
        )
    }
    return (
        <ScrollView style={{ backgroundColor: Colors.WHITE }} contentContainerStyle={{ flexGrow: 1 }}>
            <Header />
            <View style={{ paddingHorizontal: 15 }}>
                <Title text={'Most Popular'} />
            </View>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: Colors.WHITE }}
                contentContainerStyle={{ flexGrow: 1, padding: 15, paddingTop: 0 }}
                ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                data={prizes.slice(1)}
                renderItem={({ item }) => <SmallPrizeItem item={item} />} />
            <View style={{ paddingHorizontal: 15 }}>
                <Title text={'Prizes for Tribes'} />
            </View>

            <FlatList
                horizontal
                style={{ backgroundColor: Colors.WHITE }}
                contentContainerStyle={{ flexGrow: 1, padding: 15, paddingTop: 0, paddingBottom: 35 }}
                ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                data={prizes.slice(1).sort((a, b) => a.name < b.name)}
                renderItem={({ item }) => <SmallPrizeItem item={item} />} />
        </ScrollView>
    )
}

const PrizeItem = ({ item }) => {
    const { userData } = useContext(AuthContext)
    return (
        <View style={{ backgroundColor: Colors.BLACK_60, borderRadius: 20, ...shadow }}>
            <Image style={{ height: 150, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} source={{ uri: item.image }} />
            <View style={{ padding: 10 }}>
                <View style={{ marginBottom: 10, flexDirection: 'row', backgroundColor: Colors.WHITE }}>
                    <View style={{ height: 5, backgroundColor: Colors.PRIMARY, borderTopRightRadius: 2, borderBottomRightRadius: 2, width: Math.random() * 100 + '%' }} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: Colors.WHITE, fontSize: 18 }} >{item.name}</Text>
                    <ImageIcon containerStyle={{ marginLeft: 'auto' }} size={23} name="carbon" color={Colors.WHITE} />
                    <Text style={{ color: Colors.WHITE, fontSize: 18 }}>{userData.credits_balance} of {item.price}</Text>
                </View>
                <Text style={{ color: Colors.WHITE }} >{item.from}</Text>
            </View>
        </View>
    )
}

const SmallPrizeItem = ({ item }) => {
    const { userData } = useContext(AuthContext)
    return (
        <View style={{ backgroundColor: Colors.WHITE, borderRadius: 20, ...shadow, width: 200 }}>
            <Image style={{ height: 150, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} source={{ uri: item.image }} />
            <View style={{ padding: 10 }}>
                <View style={{ marginBottom: 10, flexDirection: 'row', backgroundColor: Colors.GRAY_LIGHT }}>
                    <View style={{ height: 5, backgroundColor: Colors.PRIMARY, borderTopRightRadius: 2, borderBottomRightRadius: 2, width: Math.random() * 100 + '%' }} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: Colors.BLACK_80, fontSize: 18 }} >{item.name}</Text>
                </View>
                <Text style={{ color: Colors.BLACK_60 }} >{item.from}</Text>
            </View>
        </View>
    )
}

const Title = ({ text }) => <Text style={{ fontSize: 20, paddingBottom: 15 }} >{text}</Text>