import moment from "moment";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../Common/Colors";
import CustomTabs from "../../Common/CustomTabs";
import ImageIcon from "../../Common/ImageIcon";
import CustomButton from "../../Components/CustomButton";

const directionTabs = [
    { value: 'qr-code', label: '  QR-Code  ' },
    { value: 'map', label: '     Map     ' }
]

export default RedeemedPrizes = ({ navigation }) => {
    const insets = useSafeAreaInsets()
    const [destination, setDestination] = useState(directionTabs[0])

    const Header = () => {
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <View style={{ padding: 15, paddingBottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                        <Icon containerStyle={{ backgroundColor: 'white' }} onPress={() => navigation.goBack()} name="arrow-back-ios" />
                        <TouchableOpacity onPress={()=>navigation.navigate('Purchase History')}>
                        <ImageIcon size={35} name='history' />
                        </TouchableOpacity>
               
                    </View>


                    <View pointerEvents='box-none' style={{ alignItems: 'center', justifyContent: 'center' }} >
                        <CustomTabs containerStyle={{ marginTop: 10, backgroundColor: Colors.GRAY_LIGHT }} tabs={directionTabs} setState={setDestination} selectedTab={destination} />
                    </View>
                </View>

                <FlatList
                    renderItem={PrizeItem}
                    ItemSeparatorComponent={()=> <View style={{height : 15}} />}
                    contentContainerStyle={{ padding: 15, flex: 1 }}
                    data={[]} />
            </View>
        )
    }


    return (
        <View style={{ flex: 1, paddingTop: insets.top }}>
            <Header />
        </View>
    )
}

const PrizeItem = ({ item }) => {
    return (
        <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center'}} >
            <Image style={{ height: 65, width: 65, borderRadius: 24 }} source={{ uri: item.image }} />
            <View style={{paddingLeft : 15}} >
                <Text style={{color : Colors.BLACK_100}} >{item.name}</Text>
                <Text style={{color : Colors.GRAY_DARK}} >{item.place}</Text>
               {item.date && <Text>{moment(item.date).format('DD.MM.YYYY')}</Text>}
            </View>
            <Text style={{color : Colors.BLACK_100, fontSize : 24, marginLeft : 'auto'}} >{item.count}</Text>
            <CustomButton containerStyle={{marginLeft : 20}} fontSize={14} iconSize={16} imageIcon={'qr-code'} label={'CODE'} />
        </TouchableOpacity>
    )
}
