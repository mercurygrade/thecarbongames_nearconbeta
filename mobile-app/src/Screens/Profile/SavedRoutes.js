import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../Common/Colors";
import ImageIcon from "../../Common/ImageIcon";
import { shadow } from "../../Common/Styles";
import { formatDuration } from "../../Common/Utitliy";
import CustomButton from "../../Components/CustomButton";
import { API, apikey } from "../../Providers";
import { TransportContext } from "../../Providers/TransportProvider";

export default SavedRoutes = ({ navigation }) => {
    const insets = useSafeAreaInsets()
    const { savedRoutes } = useContext(TransportContext)

    const Header = () => {
        return (
                <View style={{ padding: 15, alignItems: 'flex-start' }}>
                    <Icon containerStyle={{ backgroundColor: 'white', marginBottom: 10 }} onPress={() => navigation.goBack()} name="arrow-back-ios" />

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'stretch' }} >
                        <Text style={{ fontSize: 28, }} >Saved Routes</Text>
                        <View style={{ flexDirection: 'row', padding: 8, backgroundColor: Colors.WHITE, borderRadius: 40, ...shadow, alignItems: 'center' }} >
                            <ImageIcon size={20} name="carbon" color={Colors.PRIMARY} />
                            <Text style={{ fontSize: 16, paddingLeft: 5 }} >{savedRoutes.reduce((t, c)=>t+c.credits,0)}</Text>
                        </View>
                    </View>
                </View>
        )
    }


    return (
        <View style={{ flex: 1, paddingTop: insets.top }}>
            <Header />
            <FlatList
                    renderItem={({ item }) => <RouteItem item={item} />}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                    contentContainerStyle={{ padding: 15, flexGrow: 1, paddingBottom: 20 + 15 }}
                    data={savedRoutes} />
        </View>
    )
}

const RouteItem = ({ item }) => {
    console.log(JSON.stringify(item, null, 2))
    const duration = useMemo(() => item?.routes?.[0]?.sections?.reduce((total, section) => total + section.travelSummary.duration, 0), [item])
    const distance = useMemo(() => item?.routes?.[0]?.sections?.reduce((total, section) => total + section.travelSummary.length, 0), [item])

    return (
        <TouchableOpacity style={{ borderRadius: 20, ...shadow, backgroundColor: Colors.WHITE }} >
            <Image style={{ height: 130, width: '100%', borderRadius: 20, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} source={{uri:`https://image.maps.ls.hereapi.com/mia/1.6/mapview?apiKey=${apikey}&ppi=320&sb=km&w=1000&h=500&z=15&c=${item.routes?.[0].sections[0].arrival.place.location.lat},${item.routes?.[0].sections[0].arrival.place.location.lng}`}} />
            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ color: Colors.BLACK_100, fontSize: 16 }} >{item.label}</Text>
                        <Text style={{ color: Colors.BLACK_100, fontSize: 16, marginHorizontal: 10 }}>·</Text>
                        {item.fuel == 'electric' ? <Icon size={20} name="bolt" /> : <Icon size={20} name="local-gas-station" />}
                        {item.access == 'shared' ? <Icon size={20} name="people" /> : <Icon size={20} name="person" />}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }} >
                        <Text style={{ color: Colors.BLACK_100, fontSize: 16 }} >{(distance / 1000).toFixed(1)}kms</Text>
                        <View style={{ width: 1, height: 25, backgroundColor: Colors.GRAY, marginHorizontal: 20 }} />
                        <Text style={{ color: Colors.BLACK_100, fontSize: 16 }} >{formatDuration(duration, { largest: 1 })}</Text>
                    </View>
                </View>

                <CustomButton label={'DIRECTION'} imageIcon='directions' iconSize={20} />

            </View>
            <View style={{ flexDirection: 'row', padding: 8, backgroundColor: Colors.WHITE, borderRadius: 40, ...shadow, alignItems: 'center', position: 'absolute', top: 10, right: 10 }} >
                <Text style={{ fontSize: 16, paddingLeft: 5 }} >+{item.credits}</Text>
                <ImageIcon size={20} name="carbon" color={Colors.PRIMARY} />
            </View>
        </TouchableOpacity>
    )
}
