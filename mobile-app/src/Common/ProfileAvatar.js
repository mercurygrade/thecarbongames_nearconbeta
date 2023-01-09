import React from "react";
import { Image } from "react-native";

export default ProfileAvatar = ({ userData }) => {
    return <Image source={{ uri: userData.profile }} style={{ height: 40, width: 40, borderRadius: 25, borderColor: 'white', borderWidth: 1, }} />
}