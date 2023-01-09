import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Icon, Switch } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import Colors from "../../Common/Colors";

const dummyProfilePic = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU'

export default Carpooling = ({ navigation }) => {
    const insets = useSafeAreaInsets()
    const toast = useToast()
    const [offerCarpool, setOfferCarpool] = useState(false)

    useEffect(()=>{
        if(offerCarpool) toast.show('Your ride will now be visible to nearby colleagues to join your carpool. You earn a 30% driver bonus upon every carpool ride completion!',{style : {marginBottom  :100}})
    }, [offerCarpool])

    return (
        <ScrollView contentContainerStyle={{ padding: 15, paddingTop: insets.top + 15 }} >

            <View style={{ alignItems: 'flex-start' }}>
                <Icon containerStyle={{ backgroundColor: 'white', marginBottom: 10 }} onPress={() => navigation.goBack()} name="arrow-back-ios" />
                <Text style={{ fontSize: 28, color: 'black' }} >Carpooling</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 30, alignItems: 'center' }}>
                <View style={{ padding: 3, borderWidth: 3, borderColor: Colors.PRIMARY, borderRadius: 60 }}>
                    <Image source={{ uri: dummyProfilePic }} style={{ height: 90, width: 90, borderRadius: 50 }} />
                </View>

                <View style={{ flexDirection: 'row', borderRadius: 50, padding: 8, alignItems: 'center', paddingHorizontal: 10, marginHorizontal: 30, borderWidth: 1, borderColor: Colors.GRAY }}>
                    <Text style={{ paddingRight: 5 }}>Flowering</Text>
                    <ImageIcon size={16} name={'info-outlined'} />
                </View>
            </View>

            <DetailItem label={'City'} value={'Value'} />
            <DetailItem label={'Home'} value={'Sparkle Water,\nDubai Marina'} />
            <DetailItem label={'Interest'} value={'Sports, UX/UI\ndesign , Ecology'} />
            <DetailItem label={'Work Hours'} value={'09:00 - 17:00'} />

            <View style={{ paddingVertical: 20, flexDirection: 'row', alignItems: 'center' }} >
                <Switch color={Colors.PRIMARY} value={offerCarpool} onValueChange={setOfferCarpool} />
                <Text style={{ color: Colors.BLACK_100, fontSize: 15, paddingLeft: 15 }} >I can offer carpooling</Text>
            </View>

            {offerCarpool &&
                <View>
                    <DetailItem label={'Your driving experience'} value={'2 Years'} />
                    <DetailItem label={'Your car'} value={'Nissan Leaf'} />
                    <DetailItem label={'Fuel type'} value={'Electric'} />
                    <DetailItem label={'Number of passenger'} value={'3'} hideDivider />
                </View>
            }


        </ScrollView>
    )
}

const DetailItem = ({ label, value, hideDivider }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: hideDivider ? Colors.WHITE : Colors.GRAY, alignItems: 'center' }} >
            <Text style={{ color: Colors.BLACK_100, fontSize: 15 }} >{label}</Text>
            <Text style={{ color: Colors.BLACK_100, fontSize: 17, textAlign: 'right' }}  >{value}</Text>
        </View>
    )
}