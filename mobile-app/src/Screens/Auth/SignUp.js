import React, { useContext, useEffect, useMemo, useState } from "react"
import { Alert, Image, Platform, ScrollView, StatusBar, Text, useWindowDimensions, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Colors from "../../Common/Colors"
import CustomButton from "../../Components/CustomButton"
import { AuthContext } from "../../Providers/AuthProvider"
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import logo from '../../Assets/logo.png'
import ControlledInput from "../../Components/ControlledInput"
import { useForm } from "react-hook-form"
import ControlledPicker from "../../Components/ControlledPicker"
import ControlledTab from "../../Components/ControlledTab"
import { CompanyContext } from "../../Providers/CompanyProvider"
import ControlledDateModal from "../../Components/ControlledDateModal"
import moment from "moment"
import { changeStack } from "../../Navigation"
import { EventContext } from "../../Providers/EventProvider"
import { CheckBox } from "react-native-elements"
import Cars from "../../Utils/Cars"
import useGeolocation from "../../Hooks/useGeolocation"
import { STATUSES } from "../../Providers"

export default Signup = ({navigation}) => {
    const { signUp } = useContext(AuthContext)
    const { events } = useContext(EventContext)
    const { companies } = useContext(CompanyContext)
    const [passwordVisible, setPasswordVisibility] = useState()
    const insets = useSafeAreaInsets()
    const { position, retry } = useGeolocation({showLoading : true})

    const [eventDate, setEventDate] = useState();
    const [datePickerVisible, setDatePickerVisibility] = useState(false);

    const { control, handleSubmit, formState: { errors }, reset, watch, } = useForm({ defaultValues: { account_type: 1 } });

    const { account_type, company, car = {} } = watch()

    const [carOwner, setCarOwner] = useState(false)

    const branches = useMemo(() => {
        if (!company) return []
        else return companies.find(c => c.id == company).branches
    }, [company])

    useEffect(() => {
        changeNavigationBarColor('white', true, true)
    }, [])

    const onSubmit = (data) => {
        console.log('sign up data', data)
        if (position == STATUSES.error) return Alert.alert('Location', 'Please give access to your location to continue.', [
            { text: 'Okay', onPress: retry },
            { text: 'Cancel' }
        ])

        const home_coordinates = position.coords.latitude + ',' + position.coords.longitude
        signUp({ ...data, home_coordinates }, () => changeStack('Bottom Tabs')) 
    }

    return (
        <View style={{ flex: 1 }} >

            {datePickerVisible && (
                <ControlledDateModal
                    value={eventDate}
                    initialDate={new Date()}
                    confirm={setEventDate}
                    dismiss={() => setDatePickerVisibility(false)}
                />
            )}

            <ScrollView style={{ backgroundColor: Colors.BLACK_20, flex: 1 }} contentContainerStyle={{ flexGrow: 1, padding: 15, paddingTop: insets.top + 15, }} >
                <StatusBar backgroundColor={Colors.BLACK_20} barStyle='dark-content' />

                <Text style={{ paddingBottom: 15, fontSize: 24, fontWeight: 'bold', color: Colors.PRIMARY }} >Sign Up</Text>

                <ControlledInput
                    label={'Full name'}
                    textInputProps={{}}
                    controllerProps={{ name: 'full_name', control, errors, rules: { required: true }, }}
                    containerStyle={{ marginBottom: 20, }} />

                <ControlledInput
                    label={'Email'}
                    textInputProps={{ keyboardType: 'email-address', autoCapitalize: 'none' }}
                    controllerProps={{ name: 'email', control, errors, rules: { required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ }, }}
                    containerStyle={{ marginBottom: 20, }} />

                <ControlledInput
                    label={'Password'}
                    rightIconProps={{ name: 'visibility', containerStyle: { marginRight: 5 }, onPress: () => setPasswordVisibility(cv => !cv) }}
                    textInputProps={{ autoCapitalize: 'none', secureTextEntry: !passwordVisible }}
                    controllerProps={{ name: 'password', control, errors, rules: { required: true }, }}
                    containerStyle={{ marginBottom: 20, }} />

                <View style={{ flexDirection: 'row' }} >
                    <ControlledPicker
                        options={genders}
                        controllerProps={{ name: 'gender', control, errors, rules: { required: true }, }}
                        label={'Gender'}
                        emptyMessage={'Please make sure to select a gender first.'}
                        containerStyle={{ marginBottom: 20, flex: 1 }} />

                    <View style={{ width: 15 }} />

                    <ControlledInput
                        label={'Age'}
                        textInputProps={{ keyboardType: 'numeric', autoCapitalize: 'none' }}
                        controllerProps={{ name: 'age', control, errors, rules: { required: true }, }}
                        containerStyle={{ marginBottom: 20, flex: 1 }} />
                </View>

                <ControlledTab
                    options={accountTypes}
                    controllerProps={{ name: 'account_type', control, errors, rules: { required: true }, }}
                    label={'Account Type'}
                    emptyMessage={'Please make sure to select a gender first.'}
                    containerStyle={{ marginBottom: 20 }} />

                {
                    account_type == accountTypes[0].value && <View>
                        <ControlledPicker
                            options={companies.map(company => ({ label: company.name, value: company.id }))}
                            controllerProps={{ name: 'company', control, errors, rules: { required: true }, }}
                            label={'Company'}
                            containerStyle={{ marginBottom: 20 }} />

                        <ControlledPicker
                            options={branches.map(branch => ({ label: branch.name, value: branch.id }))}
                            controllerProps={{ name: 'branch', control, errors, rules: { required: true }, }}
                            label={'Branch'}
                            emptyMessage={'Please make sure to select a company first.'}
                            containerStyle={{ marginBottom: 20 }} />
                    </View>
                }

                {
                    account_type == accountTypes[1].value && <View>
                        <ControlledPicker
                            options={events.map(event => ({ label: `${event.name} | ${event.venue}`, value: event.id }))}
                            controllerProps={{ name: 'event', control, errors, rules: { required: true }, }}
                            label={'Event'}
                            containerStyle={{ marginBottom: 20 }} />

                        <ControlledInput
                            label={'Affiliation'}
                            controllerProps={{ name: 'affiliation', control, errors, rules: { required: true }, }}
                            containerStyle={{ marginBottom: 20, }} />
                    </View>
                }

                <View style={{ borderWidth: 1, borderRadius: 8, borderColor: Colors.BLACK_30, backgroundColor: Colors.WHITE }}>
                    <CheckBox
                        checked={carOwner}
                        checkedColor={Colors.PRIMARY}
                        uncheckedColor={Colors.PRIMARY}
                        onPress={() => setCarOwner(value => !value)}
                        containerStyle={{ backgroundColor: Colors.WHITE, borderWidth: 0, padding: 8 }}
                        textStyle={{ fontWeight: '500' }}
                        title={'I own a car'} />

                    {
                        carOwner && <View>
                            <View style={{ height: 1, backgroundColor: Colors.BLACK_30 }} />
                            <View style={{ flexDirection: 'row' }} >

                                <ControlledPicker
                                    style={{ borderWidth: 0 }}
                                    resetOn={[carOwner]}
                                    options={Cars.map(car => car.make).filter((make, index, arr) => arr.indexOf(make) == index).map(make => ({ label: make, value: make }))}
                                    controllerProps={{ name: 'car.make', control, errors, rules: { required: true }, }}
                                    label={'Make'}
                                    containerStyle={{ flex: 1 }} />

                                <View style={{ width: 1, backgroundColor: Colors.BLACK_30 }} />

                                <ControlledPicker
                                    style={{ borderWidth: 0 }}
                                    resetOn={[car.make, carOwner]}
                                    options={Cars.filter(c => c.make == car.make).map(car => car.model).filter((model, index, arr) => arr.indexOf(model) == index).map(model => ({ label: model, value: model }))}
                                    controllerProps={{ name: 'car.model', control, errors, rules: { required: true }, }}
                                    label={'Model'}
                                    emptyMessage={'Please make sure to select a car make first.'}
                                    containerStyle={{ flex: 1 }} />

                                <View style={{ width: 1, backgroundColor: Colors.BLACK_30 }} />

                                <ControlledPicker
                                    style={{ borderWidth: 0 }}
                                    resetOn={[car.make, car.model, carOwner]}
                                    options={Cars.filter(c => c.make == car.make && c.model == car.model).map(car => car.year).filter((year, index, arr) => arr.indexOf(year) == index).map(year => ({ label: year, value: year }))}
                                    controllerProps={{ name: 'car.year', control, errors, rules: { required: true }, }}
                                    label={'Year'}
                                    emptyMessage={'Please make sure to select a car model first.'}
                                    containerStyle={{ flex: 1 }} />

                            </View>
                        </View>
                    }
                </View>

            </ScrollView>
            <View style={{ height: 1, backgroundColor: Colors.BLACK_30 }} />
            <View style={{ padding: 15, paddingBottom: insets.bottom + 15 }} >
                <CustomButton disabled={position == STATUSES.loading} onPress={handleSubmit(onSubmit)} label={'SIGNUP'} containerStyle={{ alignSelf: 'stretch' }} />
                <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={{ marginTop: 20, alignSelf: 'center' }} >
                    <Text >Already have an account? <Text style={{ fontWeight: 'bold', color: Colors.PRIMARY }} >Sign In</Text></Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

const accountTypes = [
    { label: 'Corporate', value: 1 },
    { label: 'Event', value: 2 }
]

const genders = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
]