import React, { useState } from "react";
import { ScrollView } from "react-native";
import { View } from "react-native";
import Colors from "../../Common/Colors";
import CustomTabs from "../../Common/CustomTabs";
import Departments from "./Departments";
import Players from "./Players";
import Tribes from "./Tribes";

const tabs = [
    { value: 'players', label: 'Players' },
    { value: 'tribes', label: 'Tribes' },
    { value: 'departments', label: 'Departments' }
]

export default LeaderBoard = () => {
    const [tab, setTab] = useState(tabs[0])

    const Body = ()=>{
        switch (tab.value) {
            case tabs[0].value: return <Players/>
            case tabs[1].value: return <Tribes/>
            case tabs[2].value: return <Departments/>
            default: return null
        }
    }

    return (
        <ScrollView style={{backgroundColor : 'white'}} contentContainerStyle={{ backgroundColor: Colors.WHITE, flexGrow: 1, padding: 20, paddingBottom : 40 }}>
            <CustomTabs itemStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} containerStyle={{ backgroundColor: Colors.GRAY_LIGHT }} tabs={tabs} setState={setTab} selectedTab={tab} />
            <Body/>
        </ScrollView>
    )
} 