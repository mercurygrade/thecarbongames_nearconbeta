import React, { useMemo, useState } from 'react'
import { Dimensions, ScrollView, StatusBar, Text, View } from 'react-native'
import { Icon } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

import { LineChart } from "react-native-chart-kit";
import Colors from '../../Common/Colors';
import CustomTabs from '../../Common/CustomTabs';

const scopeTabs = [
    { value: 'one week', label: '1W' },
    { value: 'one month', label: '1M' },
    { value: 'three months', label: '3M' },
    { value: 'six months', label: '6M' },
    {value : 'one year', label: '1Y'}
]

export default Statistics = ({navigation}) => {
    const insets = useSafeAreaInsets()
    const [scope, setScope] = useState(scopeTabs[0])
    const chartLabels = useMemo(() => {
        switch (scope.value) {
            case 'Day': return ['12pm', '4pm', '8pm', '12am', '4am', '8am']
            case 'Month': return ['01', '04', '09', '13', '19', '21', '25']
            case 'Year': return ['Jan', 'Feb', 'Apr', 'May', 'Aug', 'Sep', 'Dec']
            default: return ["S", "M", "T", "W", "T", "F", "S"]
        }
    }, [scope])
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 15, paddingBottom:15+20,paddingTop : insets.top  }} style={{ backgroundColor: 'white' }}>
            <View style={{ alignItems: 'flex-start' }}>
                <Icon containerStyle={{ backgroundColor: 'white', marginBottom: 10 }} onPress={() => navigation.goBack()} name="arrow-back-ios" />

                <Text style={{ fontSize: 28, color: 'black' }} >Statistics</Text>
            </View>
            
            <CustomTabs itemStyle={{flex : 1, alignItems : 'center'}} containerStyle={{backgroundColor : Colors.GRAY_LIGHT, marginTop : 20}} tabs={scopeTabs} selectedTab={scope} setState={setScope} />
         

            <View  >
                <LineChart
                    data={{
                        labels: chartLabels,
                        datasets: [
                            {
                                data: [
                                    Math.random() * 24,
                                    Math.random() * 24,
                                    Math.random() * 24,
                                    Math.random() * 24,
                                    Math.random() * 24,
                                    Math.random() * 24,
                                    Math.random() * 24
                                ]
                            }
                        ],


                    }}
                    width={Dimensions.get("window").width - 20} // from react-native
                    height={200}
                    yAxisInterval={1} // optional, defaults to 1

                    segments={4}
                    fromNumber={24}
                    withHorizontalLines={false}
                    chartConfig={{
                        backgroundColor: "blue",
                        backgroundGradientFrom: 'white',
                        backgroundGradientTo: 'white',
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => Colors.PRIMARY,
                        labelColor: (opacity = 1) => Colors.GRAY,
                        style: {
                            elevation: 5,
                            shadowOpacity: 1
                        },
                        strokeWidth: 2,
                        fillShadowGradientOpacity: 1,
                        propsForLabels: { fontSize: 8 },
                        propsForDots: {
                            r: "4",
                            strokeWidth: "2",
                            stroke: Colors.PRIMARY,
                            fill: 'white'
                        },

                    }}
                    bezier
                    style={{
                        elevation: 5,
                        shadowColor: Colors.PRIMARY,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: .5,
                        backgroundColor: 'white',
                        borderRadius: 20,
                        // paddingLeft : 20,
                        paddingRight: 50,
                        paddingTop: 20,
                        paddingBottom: 15,
                        overflow: 'hidden'
                    }}
                />
                <Text style={{  bottom: 10, elevation: 20, textAlign: 'center', left: 0, right: 0, fontSize: 10 }}>Days</Text>
                {/* <Text style={{ position: 'absolute', bottom: 100, top: 100, textAlignVertical: 'center', elevation: 20, textAlign: 'center', left: 0, fontSize: 10, transform: [{ rotate: '270deg' }] }}>Times</Text> */}
            </View>

            {/* <Text style={{ fontSize: 17, opacity: .4, marginTop: 30 }}>Hear Rate</Text>
            <Text style={{ fontSize: 15, fontFamily: FONT.SEMI_BOLD, marginTop: 10 }}>Heart rate is the speed of the heartbeat measured by the number of contractions (beats) of the heart per minute (bpm). The heart rate can vary according to the body’s physical needs, including the need to absorb oxygen and excrete carbon dioxide.</Text>

            <View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'space-between' }}>
                <View>
                    <Text style={{ fontSize: 17, opacity: .4 }}>Date</Text>
                    <Text style={{ fontSize: 17, fontFamily: FONT.SEMI_BOLD }}>99 - 130</Text>
                    <Text style={{ fontSize: 17, fontFamily: FONT.SEMI_BOLD }}>95 - 120</Text>
                </View>
                <View style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 12, opacity: .4 }}>Show all</Text>
                    <Text style={{ fontSize: 12, fontFamily: FONT.SEMI_BOLD }}>12 / 10 / 2018</Text>
                    <Text style={{ fontSize: 12, fontFamily: FONT.SEMI_BOLD }}>05 / 06 /2019</Text>
                </View>
            </View>

            <View style={{ marginTop: 30 }}>
                <Text style={{ fontSize: 17, opacity: .4 }}>Data Sources</Text>
                <Text style={{ fontSize: 15, fontFamily: FONT.SEMI_BOLD }}>John's iPhone</Text>
                <Text style={{ fontSize: 15, fontFamily: FONT.SEMI_BOLD }}>Fitness Device</Text>
            </View> */}



        </ScrollView>
    )
}

const TopBtn = ({ label, onPress, selected }) => (
    <TouchableOpacity onPress={onPress} style={{ height: 30, paddingHorizontal: 20, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: .5, borderColor: Colors.PRIMARY, backgroundColor: selected ? Colors.PRIMARY : 'white' }}>
        <Text style={{ fontSize: 14, color: selected ? 'white' : 'black' }} >{label}</Text>
    </TouchableOpacity>
)
