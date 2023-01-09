import React from "react";
import firestore from '@react-native-firebase/firestore'
import Ranking from "../Components/Ranking";

export const UserContext = React.createContext()

const usersColRef = firestore().collection('users')

export default UserProvider = ({ children }) => {

    const getUsers = async (ids) => ids ? await Promise.all(ids.map(id => getUser(id))) : []

    const getUser = async (id) => ({ ...(await usersColRef.doc(id).get()).data(), id })

    const getUsersByCompany = async company => {
       let docs = (await usersColRef.where('company', '==', company).get()).docs
      return docs.map(doc => ({...doc.data(), id : doc.id})).sort((a, b) => a.credits_balance < b.credits_balance).map((user, index)=>({...user, rank : index+1}))
    }

    return (
        <UserContext.Provider
            value={{
                getUsers,
                getUser,
                getUsersByCompany
            }} >
            {children}
        </UserContext.Provider>
    )
}
