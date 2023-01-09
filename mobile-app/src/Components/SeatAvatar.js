import React, {  } from "react";
import { Image } from "react-native";
import { Avatar } from "react-native-elements";
import FastImage from "react-native-fast-image";
import Colors from "../Common/Colors";
import { getInitials } from "../Common/Utitliy";

export default SeatAvatar = ({ userData, containerStyle, disabled, onPress, size=40 }) => {
    return (
        <Avatar
            size={size}
            onPress={!disabled ? onPress : null}
            rounded
            activeOpacity={.7}
            ImageComponent={FastImage}
            key={Date.now()}
            title={getInitials(userData?.name)}
            containerStyle={{ backgroundColor: !userData ? Colors.PRIMARY : Colors.GRAY_DARK, borderColor: 'white', borderWidth: 1, ...containerStyle }}
            source={userData ? { uri: userData.profile_image } : null}
        />
    )
}