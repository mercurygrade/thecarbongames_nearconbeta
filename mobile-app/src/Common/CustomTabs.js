import React, {  } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Colors from '../Common/Colors'
import { shadow } from './Styles'

export default CustomTabs = ({ tabs, selectedTab, setState, containerStyle, itemStyle }) => {
    return (
        <View style={{ backgroundColor: 'rgba(255,255,255,.75)', borderRadius: 40, padding: 3, flexDirection: 'row', alignItems: 'center', ...containerStyle, }} >
            {tabs?.map((item, index) => (
                <TouchableOpacity style={[{ backgroundColor: selectedTab?.value == item.value ? Colors.PRIMARY : Colors.TRANSPARENT, borderRadius: 20 }, itemStyle]} key={index} onPress={() => setState(item)}>
                    <Text style={{ color: selectedTab?.value == item.value ? 'white' : '#999', padding: 8, fontSize: 16 }} >{item.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}