import React, { useContext, useEffect, useMemo, useState } from "react";
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from "./AuthProvider";
import { UserContext } from "./UserProvider";

export const PrizeContext = React.createContext()

const prizesColRef = firestore().collection('prizes')

export default PrizeProvider = ({ children }) => {

    const [prizes, setPrizes] = useState([])

    return (
        <PrizeContext.Provider
            value={{
                prizes
            }} >
            {children}
        </PrizeContext.Provider>
    )
}
