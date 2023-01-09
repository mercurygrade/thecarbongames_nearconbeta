import React, {  } from "react";
import { Text, View } from "react-native";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { getInitials } from "../Common/Utitliy";
import ImageIcon from "../Common/ImageIcon";
import Colors from "../Common/Colors";

export default Ranking = ({ data, name }) => {

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

