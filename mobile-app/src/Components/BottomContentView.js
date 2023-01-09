import React from "react";
import { Platform, View } from "react-native";
import Colors from "../Common/Colors";
import { DIMENSIONS } from "../Common/Contstants";
import { shadow } from "../Common/Styles";

export default BottomContentView = ({ children, style }) => {
    return (
        <View style={{
            position: 'absolute',
            bottom: 0,
            left: -1,
            right: -1,
            ...shadow,
            borderTopLeftRadius: DIMENSIONS.BOTTOM_TAB_BORDER_RADIUS,
            borderTopRightRadius: DIMENSIONS.BOTTOM_TAB_BORDER_RADIUS,
            backgroundColor: Colors.WHITE,
            borderWidth :Platform.OS=='android' ? 1 : 0, 
            borderBottomWidth : 0,
            borderColor : Colors.GRAY_LIGHT,
        }} >
            <View style={style} >
                {children}
            </View>
            <View style={{ height: DIMENSIONS.BOTTOM_TAB_BORDER_RADIUS }} />
        </View>
    )
}