import React, { useContext, useEffect, useState } from "react";
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from "./AuthProvider";

export const CompanyContext = React.createContext()

const companyColRef = firestore().collection('companies')

export default CompanyProvider = ({ children }) => {

    const { user } = useContext(AuthContext)
    const [companies, setCompanies] = useState([])

    useEffect(() => companyColRef.onSnapshot(async snapshot => {
        let companies = snapshot.docs.map(doc => ({id :doc.id, ...doc.data()}))
        setCompanies(companies)
    }), [])

    const getBranchesByCompany = ()=>{

    }

    return (
        <CompanyContext.Provider
            value={{
                companies,
            }} >
            {children}
        </CompanyContext.Provider>
    )
}