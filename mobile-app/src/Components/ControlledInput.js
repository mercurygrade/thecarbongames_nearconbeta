import React, { useMemo } from 'react';
import { TextInput, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Controller } from 'react-hook-form';
import { Text } from 'react-native';
import Colors from '../Common/Colors';

export default ControlledInput = ({
    label,
    containerStyle,
    textInputProps,
    controllerProps,
    rightIconProps,
    disabled
}) => {
    return (
        <View style={[containerStyle]}>

            <View style={{ backgroundColor: 'white', borderRadius: 8, borderColor: Colors.BLACK_30, borderWidth: 1, paddingHorizontal: 5, color: Colors.BLACK_100 }}>
                <Controller  {...controllerProps}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View
                            style={[
                                {
                                    flexDirection: 'row',
                                    borderRadius: 12,
                                    alignItems: 'center',
                                }
                            ]}>

                            <TextInput
                                editable={!disabled}
                                placeholderTextColor={Colors.GRAY_DARK}
                                onBlur={onBlur}
                                placeholder={label}
                                onChangeText={value => onChange(value)}
                                value={value}
                                {...textInputProps}

                                style={[
                                    {
                                        flex: 1,
                                        color: Colors.BLACK_100,
                                        height: 50,
                                        paddingLeft: 10,
                                        justifyContent: 'center',
                                    },
                                ]}
                            />
                            {rightIconProps && <Icon {...rightIconProps} color={'#bbb'} />}
                        </View>
                    )}
                />
            </View>

            <Error
                error={controllerProps.errors[controllerProps.name]}
                label={label ? label : textInputProps.placeholder}
            />
        </View>
    );
};

export const Error = ({ error, label }) => {
    if (!error) return null;
    const capitalizeFistLetter = string =>
        string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    const errorText = useMemo(() => {
        if (error.type == 'pattern')
            return `Please enter a valid ${label.toLowerCase()}`;
        if (error.type == 'max') return error.message;
        if (error.type == 'min') return error.message;
        if (error.type == 'maxLength') return error.message;
        if (error.type == 'required')
            return `${capitalizeFistLetter(label)} is required`;
    }, [error]);
    return <Text style={{ color: 'red', paddingTop: 5 }}>{errorText}</Text>;
};
