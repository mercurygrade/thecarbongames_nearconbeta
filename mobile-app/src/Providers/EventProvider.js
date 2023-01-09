import React, { useContext, useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from './AuthProvider'

export const EventContext = React.createContext()

const eventsColRef = firestore().collection('events')

export default EventProvider = ({ children }) => {

    const {userData} = useContext(AuthContext)

    const [events, setEvents] = useState([])
    const [event, setEvent] = useState()

    useEffect(() => {
        getEvents()
    }, [])

    useEffect(()=>{
        getMyEvent()
    },[userData])

    const getEvents = async () => {
        const snapshot = await eventsColRef.get()
        setEvents(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }

    const getMyEvent = async () =>{
        if(!userData?.event) return
        const snapshot = await eventsColRef.doc(userData.event).get()
        setEvent(snapshot.data())
    }

    return (
        <EventContext.Provider value={{
            events,
            event
        }} >
            {children}
        </EventContext.Provider>
    )
}