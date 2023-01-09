import React, { useContext, useMemo } from "react";
import storage from '@react-native-firebase/storage';
import { AuthContext } from "./AuthProvider";

export const StorageContext = React.createContext()

export default StorageProvider = ({ children }) => {

    const { user } = useContext(AuthContext)


    const upload = (filePath, onSuccess) => {
        const reference = storage().ref(`users/${user?.uid}/profile_image.jpg`)
        reference.putFile(filePath)
        .then(value=>reference.getDownloadURL().then(onSuccess))
        .catch(err=>console.error(err))
    }


    return (
        <StorageContext.Provider
            value={{
                upload
            }} >
            {children}
        </StorageContext.Provider>
    )
}