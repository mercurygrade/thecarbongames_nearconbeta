import React, { useContext, useEffect, useMemo, useState } from "react";
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from "./AuthProvider";
import { UserContext } from "./UserProvider";

export const TribeContext = React.createContext()

const tribesColRef = firestore().collection('tribes')

export default TribeProvider = ({ children }) => {

    const { user } = useContext(AuthContext)
    const { getUsers } = useContext(UserContext)
    const [tribes, setTribes] = useState([])
    const myTribe = useMemo(() => tribes.find(tribe => tribe?.members?.map(member => member.id)?.includes(user?.uid)), [tribes])

    // listen to tribes collection
    useEffect(() => tribesColRef.onSnapshot(async snapshot => {
        if (!user) return
        let tribes = snapshot.docs.map(doc => doc.data())
        tribes = await Promise.all(tribes.map(item => getTribeDetails(item)))
        tribes.sort((a, b) => a.totalCredits < b.totalCredits)
        tribes = tribes.map((tribe, index) => ({ ...tribe, rank: index + 1 }))
        setTribes(tribes)
}), [user])

    const getTribeDetails = async (tribe) => {
        const members = await getUsers(tribe.members)

        const details = {
            ...tribe,
            totalCredits: members.reduce((t, c) => t + (c.totalCredits || 0), 0),
            averageCredits: members.reduce((t, c) => t + (c.credits || 0), 0) / members.length,
            members: members
        }
        return details
    }

    return (
        <TribeContext.Provider
            value={{
                tribes,
                myTribe
            }} >
            {children}
        </TribeContext.Provider>
    )
}
