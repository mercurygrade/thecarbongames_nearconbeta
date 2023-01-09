import firebaseWeb from "firebase"; // must import this before initializing firebase web 
import '../../firebase'
import { useEffect, useState } from "react";
import { GeoFire } from "geofire";

const originGeoFireRef = new GeoFire(firebaseWeb.database().ref('origin'))
const destinationGeoFireRef = new GeoFire(firebaseWeb.database().ref('destination'))

const originQuery = originGeoFireRef.query({ center: [0, 0], radius: 3 })
const destinationQuery = destinationGeoFireRef.query({ center: [0, 0], radius: 1 })

export default useGeoFire = ({ origin, destination } = {}) => {
    const [nearByCarpools, setNearByCarpools] = useState([])
    const [sameOriginCarpools, setSameOriginCarpools] = useState([])
    const [sameDestinationCarpools, setSameDestinationCarpools] = useState([])

    useEffect(() => {
        if (!origin) return
        const center = [parseFloat(origin?.split(',')[0]), parseFloat(origin?.split(',')[1])]
        originQuery.updateCriteria({ center, radius: 3 })
    }, [origin])

    useEffect(() => {
        if (!origin) return
        const center = [parseFloat(destination?.split(',')[0]), parseFloat(destination?.split(',')[1])]
        destinationQuery.updateCriteria({ center, radius: 1 })
    }, [destination]) 

    useEffect(() => {
        const onOriginEntered = originQuery.on('key_entered', key => sameOriginCarpools.includes(key) ? null : setSameOriginCarpools(cv => [...cv, key]))
        const onOriginExited = originQuery.on('key_exited', key => setSameOriginCarpools(cv => cv.filter(item => key != item)))
        const onDestinationEntered = destinationQuery.on('key_entered', key => sameDestinationCarpools.includes(key) ? null : setSameDestinationCarpools(cv => [...cv, key]))
        const onDestinationExited = destinationQuery.on('key_exited', key => setSameDestinationCarpools(cv => cv.filter(item => key != item)))

        return () => {
            onDestinationEntered.cancel()
            onDestinationExited.cancel()
            onOriginEntered.cancel()
            onOriginExited.cancel()
        }
    }, [])

    useEffect(() => {
        const intersection = sameOriginCarpools.filter(value => sameDestinationCarpools.includes(value));
        setNearByCarpools(intersection)
    }, [sameOriginCarpools, sameDestinationCarpools])

    return { nearByCarpools }

}