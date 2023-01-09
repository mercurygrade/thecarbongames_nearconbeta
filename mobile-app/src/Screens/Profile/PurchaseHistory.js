import moment from "moment";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../Common/Colors";
import ImageIcon from "../../Common/ImageIcon";

export default PurchaseHistory = ({ navigation }) => {
    const insets = useSafeAreaInsets()

    const Header = () => {
        return (
            <View style={{ flex: 1 }}>
                <View style={{padding: 15, alignItems : 'flex-start'}}>
                        <Icon containerStyle={{ backgroundColor: 'white', marginBottom : 10 }} onPress={() => navigation.goBack()} name="arrow-back-ios" />
                    
                    <Text style={{fontSize : 28, color:'black'}} >Purchase History</Text>
                </View>

                <FlatList
                    renderItem={HistoryItem}
                    ItemSeparatorComponent={()=> <View style={{height : 1, backgroundColor : Colors.GRAY, marginVertical : 15}} />}
                    contentContainerStyle={{ padding: 15, flexGrow: 1, paddingBottom : 20+15 }}
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

const HistoryItem = ({ item }) => {
    return (
        <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center'}} >
            <Image style={{ height: 65, width: 65, borderRadius: 24 }} source={{ uri: item.image }} />
            <View style={{paddingLeft : 15}} >
                <Text style={{color : Colors.BLACK_100}} >{item.name}</Text>
                <Text style={{color : Colors.BLACK_100}}  >{item.place}</Text>
               {item.date && <Text style={{color : Colors.GRAY_DARK}} >{moment(item.date).format('DD.MM.YYYY')}</Text>}
            </View>
           
           <View style={{flexDirection : 'row', marginLeft : 'auto'}} >
               <ImageIcon name={'carbon'} color={Colors.PRIMARY} size={16} />
               <Text style={{color : 'black'}} >150</Text>
           </View>
           
        </TouchableOpacity>
    )
}
