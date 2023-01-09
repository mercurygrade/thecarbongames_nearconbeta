import React, {  } from "react";
import { Controller } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import Colors from "../Common/Colors";
import { Error } from "./ControlledInput";

export default ControlledTab = ({ label, options, containerStyle, controllerProps }) => {

    const TabItem = ({ item, onSelect, selected }) => {
        return (
            <TouchableOpacity style={{backgroundColor : selected ? Colors.PRIMARY : Colors.WHITE, flex : 1, justifyContent : 'center',  height: 40, }} onPress={onSelect} >
                <Text style={{textAlign : 'center', color : selected ? Colors.WHITE : Colors.BLACK_80}} >{item.label}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={containerStyle} >
            <Controller  {...controllerProps}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={{ backgroundColor: 'white', borderRadius: 8, borderColor: Colors.BLACK_30, borderWidth: 1, color: Colors.BLACK_100,overflow : 'hidden' }}>
                        <Text style={{padding : 10, paddingLeft : 15, fontWeight : '500', color : Colors.BLACK_80}} >{label}</Text>
                        <View style={{height : 1, backgroundColor : Colors.BLACK_30}} />
                        <View style={{ flexDirection: 'row', alignItems: 'center'}} >
                            {options.map((item, index) => <TabItem onSelect={()=>onChange(item.value)} selected={value==item.value} item={item} key={index} />)}
                        </View>
                    </View>
                )}
            />
            <Error
                error={controllerProps.errors[controllerProps.name]}
                label={label ? label : textInputProps.placeholder}
            />
        </View>
    )
}