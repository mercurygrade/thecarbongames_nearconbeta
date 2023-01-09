import React, { useContext } from "react";
import { Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { shadow } from "../../Common/Styles";
import { Icon } from "react-native-elements";
import Colors from "../../Common/Colors";
import ImageIcon from "../../Common/ImageIcon";
import Ranking from "../../Components/Ranking";
import { DepartmentContext } from "../../Providers/DepartmentProvider";

export default Departments = () => {
    const { departments, myDepartment } = useContext(DepartmentContext)
    return (
        <View style={{ flex: 1 }} >
            <DepartmentDetails department={myDepartment} />
            <Ranking data={departments.map(department => ({ ...department, credits: department.totalCredits, }))} name={'Players'} />
        </View>
    )
}


const DepartmentDetails = ({ department }) => {
    return (
        <View style={{ borderRadius: 15, backgroundColor: '#0860bf', marginTop: 20, ...shadow }} >
            <LinearGradient colors={['#0860bf', '#01adef']} useAngle angle={95} style={{ padding: 10, borderRadius: 15 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                    <Text style={{ fontSize: 24, color: 'white', }} >#{department.rank}</Text>
                    <View style={{ flexDirection: 'row', padding: 8, backgroundColor: Colors.WHITE, borderRadius: 40, ...shadow, alignItems: 'center' }} >
                        <Icon size={14} name="arrow-upward" color={Colors.PRIMARY} />
                        <Text style={{ fontSize: 14, color: Colors.PRIMARY }} >+2</Text>
                    </View>
                </View>

                <View style={{ marginLeft: 10, alignItems : 'center' }}>
                    <Text style={{ color: 'white', fontSize: 28 }} >{department.name}</Text>
                    <Text style={{ color: 'white' }} >Your department</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 'auto', marginBottom: 10 }} >
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: 'white', fontSize: 20 }} >{department.totalCredits}</Text>
                            <ImageIcon name='carbon' size={20} />
                        </View>
                        <View style={{ backgroundColor: 'white', width: 1, alignSelf: 'stretch', marginHorizontal: 10 }} />
                        <View style={{}}>
                            <Text style={{ color: 'white', }} >Average</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 16 }} >{department.averageCredits}</Text>
                                <ImageIcon name='carbon' size={16} />
                            </View>
                        </View>
                    </View>
                </View>

            </LinearGradient>
        </View>
    )
}