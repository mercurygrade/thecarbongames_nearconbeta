import React, { useContext, useEffect, useMemo, useState } from "react";
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from "./AuthProvider";
import { UserContext } from "./UserProvider";

export const DepartmentContext = React.createContext()

const departmentColRef = firestore().collection('departments')

export default DepartmentProvider = ({ children }) => {

    const { user } = useContext(AuthContext)
    const { getUsers } = useContext(UserContext)
    const [departments, setDepartments] = useState([])
    const myDepartment = useMemo(() => departments.find(tribe => tribe?.members?.map(member => member.id)?.includes(user?.uid)), [departments])

    // listen to tribes collection
    useEffect(() => departmentColRef.onSnapshot(async snapshot => {
        if (!user) return
        let departments = snapshot.docs.map(doc => doc.data())
        departments = await Promise.all(departments.map(item => getTribeDetails(item)))
        departments.sort((a, b) => a.totalCredits < b.totalCredits)
        departments = departments.map((department, index) => ({ ...department, rank: index + 1 }))
        setDepartments(departments)
    }), [user])

    const getTribeDetails = async (department) => {
        const members = await getUsers(department.members)

        const details = {
            ...department,
            totalCredits: members.reduce((t, c) => t + (c.totalCredits || 0), 0),
            averageCredits: members.reduce((t, c) => t + (c.credits || 0), 0) / members.length,
            members: members
        }
        return details
    }

    return (
        <DepartmentContext.Provider
            value={{
                departments,
                myDepartment
            }} >
            {children}
        </DepartmentContext.Provider>
    )
}