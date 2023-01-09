import React, { useContext, useEffect, useMemo, useState } from "react";
import firestore from '@react-native-firebase/firestore'
import functions from '@react-native-firebase/functions'
import { GoogleMapsApi } from ".";
import { AppContext } from "./AppProvider";
import { AuthContext } from "./AuthProvider";
import { CARPOOL_STATUSES, CARPOOL_USER_STATUSES, VEHICLE_TYPES } from "../Common/Contstants";
import { swapArray } from "../Common/Utitliy";
import useGeoFire from "../Hooks/useGeoFire";
import useLoadingFn from "../Hooks/useLoadingFn";
import { USER_TYPES } from "../Models/User";
import { EventContext } from "./EventProvider";
import { Carpool } from "../Models/Carpool";

export const TransportContext = React.createContext()

const carpoolOffersColRef = firestore().collection('carpools')
const savedRoutesColRef = firestore().collection('saved_routes')

// const nearByCarpools=[]

export default TransportProvider = ({ children }) => {

  const { accessToken, setLoading } = useContext(AppContext)
  const { userData, user, company } = useContext(AuthContext)
  const { event } = useContext(EventContext)
  const [defaultParams, setDefaultParams] = useState({ type: 'goto work' })
  const [carpoolOffers, setCarpoolOffers] = useState([])
  const [completedCarpoolOffers, setCompletedCarpoolOffers] = useState([])
  const { nearByCarpools } = useGeoFire(defaultParams)

  const myCarpool = useMemo(() => new Carpool(carpoolOffers.find(carpool => carpool.owner == user?.uid), user?.uid), [user, carpoolOffers])
  const activeCarpool = useMemo(() => carpoolOffers.find(carpool => carpool.owner != user?.uid && carpool.passengerIds?.includes(user?.uid)), [user, carpoolOffers])

  const changeDefaultParams = (type) => {
    console.log('type', type, userData.type)
    let coordinates
    if (userData.type == USER_TYPES.CORPORATE) coordinates = company?.branches?.find(branch => branch.id == userData.branch)?.coordinates
    else if (userData.type == USER_TYPES.EVENT) coordinates = event?.coordinates
    switch (type) {
      case 'goto work': return setDefaultParams(cv => ({ ...cv, type, destination: coordinates, origin: userData?.home_coordinates }))
      case 'goto home': return setDefaultParams(cv => ({ ...cv, type, origin: coordinates, destination: userData?.home_coordinates }))
    }
  }

  useEffect(() => {
    if (!userData) return
    if (!company && userData.type == USER_TYPES.CORPORATE) return
    if (!event && userData.type == USER_TYPES.EVENT) return
    changeDefaultParams(defaultParams.type)
  }, [userData, company, event])

  useEffect(() => {
    if (!user) return
    const listener = carpoolOffersColRef.where('passengerIds', 'array-contains', user.uid).onSnapshot(
      async snapshot => setCompletedCarpoolOffers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))),
      err => console.error('completed carpool offers listening err', err))

    return listener
  }, [user])




  useEffect(() => {

    const carpoolCollectionSubscriber = carpoolOffersColRef.where('status', '!=', CARPOOL_STATUSES.COMPLETED).onSnapshot(async snapshot => {
      let data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      setCarpoolOffers(data.filter(carpool => nearByCarpools.includes(carpool.id)))
    }, err => console.error('carpool offers listening err', err))

    return carpoolCollectionSubscriber

  }, [nearByCarpools])

  const carpoolRouting = async (carpool) => {
    if (!carpool) return
    const isOwner = carpool?.userData?.id == user.uid

    const passengerSelector = (passenger) => {

      if (!passenger || passenger.id == carpool.userData?.id) return false

      if (isOwner) {
        switch (carpool.status) {
          case CARPOOL_STATUSES.CONFIRMED: return passenger.status == CARPOOL_USER_STATUSES.CONFIRMED
          default: return passenger.status == CARPOOL_USER_STATUSES.CHECKED
        }
      } else {
        return true
      }

    }

    const passengers = carpool?.passengerData.filter(passengerSelector)

    try {
      const params = new URLSearchParams({
        ...defaultParams,
        origin: carpool.userData.coordinates,
        waypoints: passengers.length > 0 ? passengers.map(passenger => passenger.coordinates).reduce((p, c) => p + '|' + c, 'optimize:true') : undefined
      })
      console.log(params.toString())
      carpool?.passengerData.filter(passenger => passenger && passenger.id != carpool.userData.id && (passenger.status == CARPOOL_USER_STATUSES.CONFIRMED || passenger.status == CARPOOL_USER_STATUSES.JOINED)).forEach(passenger => params.append('via', passenger.coordinates))
      params.append('via', userData.home_coordinates)
      const res = await GoogleMapsApi.get('https://maps.googleapis.com/maps/api/directions/json?' + params.toString())
      console.log('CARPOOL ROUTING', res.data?.routes?.[0]?.waypoint_order)
      if (res.data?.routes?.[0]?.waypoint_order?.length > 0) {
        const reorderedPassengerList = swapArray(carpool?.passengerData.splice(1), res.data?.routes?.[0]?.waypoint_order, passengerSelector)
        console.log('reorder', reorderedPassengerList)
        carpool.passengerData = [carpool?.passengerData[0], ...reorderedPassengerList]
      }
      return { ...res.data, ...carpool }
    } catch (error) {
      console.log(error)
      console.log('carpoolRouting > ', JSON.stringify(error.response, null, 2))
      return { ...carpool, data: 'data' }
    }
  }

  const carpoolCredits = async (carpool) => {
    if (!carpool) return
    try {
      const isOwner = carpool?.userData?.id == user.uid

      const passengerSelector = (passenger) => {

        if (!passenger || passenger.id == carpool.userData?.id) return false

        if (isOwner) {
          switch (carpool.status) {
            case CARPOOL_STATUSES.CONFIRMED: return passenger.status == CARPOOL_USER_STATUSES.CONFIRMED
            default: return passenger.status == CARPOOL_USER_STATUSES.CHECKED || passenger.status == CARPOOL_USER_STATUSES.CONFIRMED
          }
        } else {
          return true
        }
      }

      const getCreditAndCO2ForPassenger = async (passenger) => {
        const distance = await getDistance({ origin: passenger.coordinates, destination: defaultParams.destination })
        const co2Amount = calculateCo2Amount({ fuelType: 'diesel', distance })
        const credits = calculateCredits({ fuelType: carpool.vehicleType == 'carbon-emitting' ? 'diesel' : 'electric', distance, sizeOfCar: carpool?.passengerData.length })
        return { credits, co2Amount }
      }

      const passengers = carpool?.passengerData.filter(passengerSelector)
      const distance = await getDistance(defaultParams)
      const passengerCreditsAndCO2 = await Promise.all([carpool.passengerData[0], ...passengers].map(passenger => getCreditAndCO2ForPassenger(passenger)))
      const co2Amount = calculateCo2Amount({ fuelType: 'diesel', distance })
      const credits = isOwner ? (Math.max(...passengerCreditsAndCO2.map(p => p.credits), 8) * 2) : calculateCredits({ fuelType: carpool.vehicleType == 'carbon-emitting' ? 'diesel' : 'electric', distance, sizeOfCar: carpool?.passengerData.length })
      return { ...carpool, credits, co2Amount, carpoolCo2Amount: passengerCreditsAndCO2.map(p => p.co2Amount).reduce((t, c) => t + c, 0) }

    } catch (error) {
      console.log('carpoolCredits', error, error?.response)
      return { ...carpool, credits: 0 }
    }
  }

  const getDistance = async ({ origin, destination }) => {
    const res = await GoogleMapsApi.get('https://maps.googleapis.com/maps/api/directions/json?' + new URLSearchParams({ origin, destination }).toString())
    return res.data?.routes?.[0]?.legs?.[0]?.distance?.value / 1000
  }

  const calculateCo2Amount = ({ distance, }) => 0.07 * distance * 2.64

  const calculateCredits = ({ fuelType, distance, sizeOfCar }) => {

    const maxPossibleCarSize = 7
    const averageCommuteDistance = 18
    const defaultStartingCredit = 8

    const fuelWeight = () => {
      switch (fuelType) {
        case 'diesel': return .7
        case 'gasoline': return .76
        case 'electric': return 1.5
      }
    }

    const carSizeWeight = (sizeOfCar / maxPossibleCarSize) + 1

    const distanceWeight = (distance / averageCommuteDistance) + 1

    const credits = defaultStartingCredit * carSizeWeight * distanceWeight * fuelWeight()

    return parseFloat(credits.toFixed(1))

  }

  const offerCarpool = useLoadingFn(async () => {
    const instance = functions().httpsCallable('offerCarpool')
    return await instance(defaultParams)
  })

  const cancelCarpool = useLoadingFn(async (carpoolId) => {
    const instance = functions().httpsCallable('cancelCarpool')
    return await instance({ carpoolId })
  })

  const getCarpoolPreview = useLoadingFn(async (carpoolId) => {
    const instance = functions().httpsCallable('getCarpoolPreview')
    return await instance({ carpoolId })
  })

  const joinCarpool = useLoadingFn(async (params) => {
    const instance = functions().httpsCallable('joinCarpool')
    return await instance(params)
  })

  const leaveCarpool = useLoadingFn(async (carpoolId) => {
    const instance = functions().httpsCallable('leaveCarpool')
    return await instance({ carpoolId })
  })

  const startCarpool = useLoadingFn(async (carpoolId) => {
    const instance = functions().httpsCallable('startCarpool')
    return await instance({ carpoolId })
  })

  const completeCarpool = useLoadingFn(async (carpoolId) => {
    const instance = functions().httpsCallable('completeCarpool')
    return await instance({ carpoolId })
  })

  const setCheckedPassengers = useLoadingFn(async (params) => {
    const instance = functions().httpsCallable('setCheckedPassengers')
    return await instance(params)
  }, { loadingText: 'Recalculating Route' })

  const onSaveRoute = (alternative) => {
    const isSaved = savedRoutes.find(savedRoute => alternative.id == savedRoute.id) ? true : false
    if (isSaved) savedRoutesColRef.doc(alternative.id).delete()
    else savedRoutesColRef.doc(alternative.id).set(JSON.parse(JSON.stringify({ ...alternative, user_id: user?.uid })))
  }

  const checkCarpoolPassenger = async (carpool, passenger) => {
    const newPassengerArray = [...carpool?.passengers]
    for (let i = 0; i < newPassengerArray.length; i++)  if (newPassengerArray[i]?.id == passenger?.id) newPassengerArray[i].status = CARPOOL_USER_STATUSES.CHECKED
    await carpoolOffersColRef.doc(carpool.id).update({ passengers: newPassengerArray })
  }

  const unCheckCarpoolPassenger = async (carpool, passenger) => {
    const newPassengerArray = [...carpool?.passengers]
    for (let i = 0; i < newPassengerArray.length; i++)  if (newPassengerArray[i]?.id == passenger?.id) newPassengerArray[i].status = CARPOOL_USER_STATUSES.JOINED
    await carpoolOffersColRef.doc(carpool.id).update({ passengers: newPassengerArray })
  }

  return (
    <TransportContext.Provider
      value={{
        carpoolOffers,
        myCarpool,
        activeCarpool,
        leaveCarpool,
        offerCarpool,
        defaultParams,
        joinCarpool,
        onSaveRoute,
        changeDefaultParams,
        setDefaultParams,
        checkCarpoolPassenger,
        unCheckCarpoolPassenger,
        completeCarpool,
        completedCarpoolOffers,
        carpoolCredits,
        cancelCarpool,
        getCarpoolPreview,
        setCheckedPassengers,
        startCarpool
      }} >
      {children}
    </TransportContext.Provider>
  )
}

const createUrl = (carpool, confirmedPassengers, destination) => {
  const baseurl = 'https://www.google.com/maps/dir/?api=1&'
  const params = new URLSearchParams({ origin: carpool?.passengerData[0].coordinates, destination, waypoints: confirmedPassengers.map(c => c.coordinates).reduce((p, c) => p + '|' + c) })
  const url = baseurl + params.toString()
  console.log(url)
  return url
}
