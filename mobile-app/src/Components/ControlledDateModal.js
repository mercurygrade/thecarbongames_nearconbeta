import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Modal } from 'react-native'
import { TouchableOpacity } from 'react-native'
import DatePicker from 'react-native-date-picker'
import Colors from '../Common/Colors'


export default DateModal = ({ dismiss, confirm, value, initialDate }) => {
    const [date, setDate] = useState(value || initialDate || new Date())

    const onConfirm = () => {
        confirm(date)
        dismiss()
    }
    return (
        <View >
            <Modal
                transparent={true}
                hardwareAccelerated
                statusBarTranslucent
                animationType="fade">
                <TouchableOpacity activeOpacity={1} onPress={dismiss} style={{ flex: 1, backgroundColor: "#00000080", alignItems: 'center', justifyContent: 'center' }} >
                    <TouchableOpacity activeOpacity={1} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, padding: 10, position: 'absolute' }}>
                        <DatePicker
                            androidVariant="nativeAndroid"
                            mode="date"
                            date={date}
                            onDateChange={setDate}
                            style={{ width: 250 }}
                        />
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={dismiss} style={{ padding: 10, borderRadius: 5, flex: 1, borderWidth: 2, borderColor: Colors.PRIMARY + '50' }}>
                                <Text style={{ fontWeight : '500', textAlign: 'center' }}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={{ width: 10 }} />
                            <TouchableOpacity onPress={onConfirm} style={{ backgroundColor: Colors.PRIMARY, padding: 10, borderRadius: 5, flex: 1 }}>
                                <Text style={{ fontWeight : '500', textAlign: 'center', color: 'white' }}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}
