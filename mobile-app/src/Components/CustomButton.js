import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import Colors from "../Common/Colors";
import ImageIcon from "../Common/ImageIcon";

export default CustomButton = ({ label, onPress, containerStyle, icon, disabled, secondary, imageIcon, iconSize, fontSize }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        borderWidth : 2,
        borderColor : Colors.PRIMARY,
        padding: 8,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: secondary ? Colors.WHITE : Colors.PRIMARY,
        opacity: disabled ? .6 : 1,
        ...containerStyle
      }} >
      {icon && <Icon size={iconSize} color={secondary ? Colors.PRIMARY : Colors.WHITE} name={icon} />}
      {imageIcon && <ImageIcon size={iconSize} name={imageIcon} /> }
      <Text style={{ color: secondary ? Colors.PRIMARY : Colors.WHITE, fontSize:fontSize|| 16, paddingHorizontal: 3 }} >{label}</Text>
    </TouchableOpacity>
  )
}