import React, { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { Alert, FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../Common/Colors";
import { shadow } from "../Common/Styles";
import { Error } from "./ControlledInput";

export default CustomPicker = ({ label, options, containerStyle, controllerProps, leftIconProps, emptyMessage, style, resetOn=[] }) => {
    const [listModalVisible, setListModalVisibility] = useState(false)
    const onPress = () => {
        if (emptyMessage && options.length==0) Alert.alert(label, emptyMessage)
        if(options.length != 0 ) setListModalVisibility(true)
    }
    return (
        <View style={containerStyle} >
            <Controller  {...controllerProps}
                render={({ field: { onChange, onBlur, value } }) => {

                    useEffect(()=> onChange(undefined) , resetOn)

                    return (
                        <View style={{ backgroundColor: 'white', borderRadius: 8, borderColor: Colors.BLACK_30, borderWidth: 1, paddingHorizontal: 5, color: Colors.BLACK_100 , height : 50,...style}}>
                            <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center',flex : 1, paddingLeft : 8}} >
                                {leftIconProps && <Icon containerStyle={{ marginRight: 10, }} {...leftIconProps} color={Colors.PRIMARY} />}
                                <Text style={{ color: value ? 'black' : Colors.GRAY_DARK, flex : 1 }} numberOfLines={1}  >{value ? options?.find(option => option.value == value)?.label : label}</Text>
                                <Icon name='expand-more' containerStyle={{ marginLeft: 'auto' }} size={30} color={Colors.GRAY_DARK} />
                            </TouchableOpacity>
    
                            <ListModal
                                onSelect={onChange}
                                value={value}
                                options={options}
                                dismiss={() => setListModalVisibility(false)}
                                label={label}
                                visible={listModalVisible} />
    
                        </View>
                    )
                }}
            />
            <Error
                error={controllerProps.errors[controllerProps.name]}
                label={label ? label : textInputProps.placeholder}
            />
        </View>
    )
}

const ListModal = ({ visible, dismiss, label, onSelect, value, options }) => {
    const insets = useSafeAreaInsets()
    const onListItemPress = value => {
        onSelect(value)
        dismiss()
    }
    return (
        <Modal visible={visible} transparent statusBarTranslucent presentationStyle='overFullScreen' animationType="slide" >
            <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'flex-end' }} >
                <TouchableOpacity activeOpacity={1} onPressIn={dismiss} style={{ flex: 1 }} />
                <View activeOpacity={1} style={{ maxHeight: 400, backgroundColor: 'white', borderTopLeftRadius: 15, borderTopRightRadius: 15, ...shadow,shadowOpacity : .6, shadowRadius: 40 }} >

                    <View style={{ padding: 15, backgroundColor: Colors.PRIMARY, borderTopLeftRadius: 15, borderTopRightRadius: 15, }} >
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: Colors.WHITE }} >{label}</Text>
                    </View>

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{ overflow: 'hidden', borderRadius: 40, borderTopLeftRadius: 0, borderTopRightRadius: 0, }}
                        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#e5e5e5' }} />}
                        contentContainerStyle={{ paddingBottom: 10 + insets.bottom, flexGrow: 1, }}
                        renderItem={({ item }) => <ListItem selected={value == item.value} item={item} onPress={() => onListItemPress(item.value)} />}
                        data={options}
                    />
                </View>
            </View>
        </Modal >
    )
}

const ListItem = ({ item, onPress, selected }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ padding: 15, backgroundColor: selected ? '#eee' : 'white' }} >
            <Text>{item.label}</Text>
        </TouchableOpacity>
    )
}

