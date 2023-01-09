import { useNavigation, } from "@react-navigation/native"
import { useContext, useEffect } from "react"
import { AppContext } from "../Providers/AppProvider"
import { AuthContext } from "../Providers/AuthProvider";
import firestore from '@react-native-firebase/firestore'

const carpoolColRef = firestore().collection('carpools')

export default useRedirect = () => {
    const { setLoading } = useContext(AppContext)
    const { user } = useContext(AuthContext)
    const navigation = useNavigation()

    useEffect(() => {
        if (!user) return
        checkCarpools()
    }, [user])

    const checkCarpools = async () => {
        setLoading(true)
        try {
            const activeCarpool = (await carpoolColRef.where('passengerIds', 'array-contains', user.uid).where('owner', '!=', user.uid).get())
            if (activeCarpool.docs.length > 0) return navigation.navigate('Ongoing Carpool', { id: activeCarpool.id })
            const myCarpool = (await carpoolColRef.where('owner', '==', user.uid).where('status', '!=', 'completed').get())
            if (myCarpool.docs.length > 0) return navigation.navigate('My Carpool')
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

}