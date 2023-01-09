import React, { useContext, useEffect, useMemo, useState } from "react";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import { Alert } from "react-native";
import { changeStack } from "../Navigation";
import { AppContext } from "./AppProvider";
import Cars from "../Utils/Cars";
import { User } from "../Models/User";

const companiesColRef = firestore().collection('companies')
const usersColRef = firestore().collection('users')

export const AuthContext = React.createContext()

export default AuthProvider = ({ children }) => {

    const { setLoading } = useContext(AppContext)
    const [user, setUser] = useState();
    const userDataRef = useMemo(() => user ? firestore().doc('users/' + user?.uid) : null, [user])
    const [userData, setUserData] = useState()
    const [company, setCompany] = useState()

    useEffect(() => {
        // companiesColRef.add(dummyCompany)
        // dummyUserProfiles.forEach((item, index) => firestore().collection('users').doc(dummyUIDs[index]).set(JSON.parse(JSON.stringify(item))))
        const subscriber = auth().onAuthStateChanged(setUser);
        return subscriber; // unsubscribe on unmount
    }, []);

    useEffect(() => { // listen to user data
        if (!user) return

        const subscriber = userDataRef.onSnapshot(
            snapshot => setUserData(new User(snapshot.data())),
            err => console.error(err)
        )

        return subscriber
    }, [user])

    useEffect(() => {
        if (!userData || !userData.company) return
        companiesColRef.doc(userData.company).get().then(value => setCompany(value.data()))
    }, [userData])

    const signIn = ({ email, password }, onSuccess) => {
        setLoading(true)
        auth().signInWithEmailAndPassword(email, password)
            .then(onSuccess)
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') Alert.alert('Sign In', 'That email address is already in use!')

                if (error.code === 'auth/user-not-found') Alert.alert('Sign In', 'There was no user found with the email you used!')

                if (error.code === 'auth/wrong-password') Alert.alert('Sign In', 'Wrong password! Please try again.')

                if (error.code === 'auth/invalid-email') Alert.alert('Sign In', 'That email address is invalid!')

                console.log(error);
            }).finally(() => setLoading(false))
    }

    const signUp = async (data, onSuccess) => {
        try {
            setLoading(true)
            const res = await auth().createUserWithEmailAndPassword(data.email, data.password)
            if (data.car?.make) {
                const car = Cars.find(car => car.make == data.car.make && car.model == data.car.model && car.year == data.car.year)
                const carDocRef = await firestore().collection('cars').add(car)
                delete data.car
                data.cars = [carDocRef.id]
            }
            await usersColRef.doc(res.user.uid).set(JSON.parse(JSON.stringify(data)))
            onSuccess()
        } catch (error) {
            console.log(error)
            
            if (error.code === 'auth/email-already-in-use') Alert.alert('Sign Up', 'That email address is already in use!')

            if (error.code === 'auth/operation-not-allowed') Alert.alert('Sign Up', 'Operation not allowed!')

            if (error.code === 'auth/weak-password') Alert.alert('Sign Up', 'Please insert a stronger password.')

            if (error.code === 'auth/invalid-email') Alert.alert('Sign Up', 'That email address is invalid!')
        } finally {
            setLoading(false)
        }
    }

    const signOut = () => {
        const onYes = () => {
            auth().signOut()
                .then(() => changeStack('Auth Stack'))
                .catch(err => {
                    Alert.alert('Sign Out', 'Error signing out. Please try again.')
                    console.log(err)
                })
        }
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Yes', onPress: onYes },
            { text: 'No' }
        ])
    }

    const updateUserData = (data, { onSuccess = () => { }, showLoading = true } = {}) => {
        if (showLoading) setLoading(true)
        userDataRef.update(data)
            .then(() => onSuccess())
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                signIn,
                signOut,
                userData,
                updateUserData,
                company,
                signUp
            }} >
            {children}
        </AuthContext.Provider>
    )
}
