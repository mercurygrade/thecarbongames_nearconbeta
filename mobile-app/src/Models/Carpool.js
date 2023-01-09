import moment from "moment"
import { CARPOOL_STATUSES, CARPOOL_USER_STATUSES } from "../Common/Contstants"

export class Carpool {
    constructor(data, userId) {
        this.raw = data
        this.userId = userId
        Object.assign(this, data)
    }

    get me() {
        return this.passengers.find(passenger => passenger.id == this.userId)
    }

    get duration() {
        return this?.directions?.routes?.[0]?.legs?.reduce((total, leg) => total + leg.duration.value, 0)
    }

    get departure_time() {
        return moment(Date.now()).format('HH:mm')
    }

    get estimated_arrival() {
        return moment(Date.now() + (this.duration * 1000)).format('HH:mm')
    }

    get markers() {
        return this?.passengers?.filter(passenger => passenger.id != this.userId)?.map(passenger => ({
            ...passenger,
            coordinates: {
                latitude: parseFloat(passenger.coordinates.split(',')[0]),
                longitude: parseFloat(passenger.coordinates.split(',')[1])
            }
        }))
    }

    get occupation() {
        const passengers = this?.passengers?.filter(passenger=>typeof passenger.seat == 'number')
        return this.car.seat == passengers.length ? 'Full' : `${passengers.length} of ${this.car.seat}`
    }

    get checkedPassengers(){
        return this?.passengers?.filter(passenger => passenger?.status == CARPOOL_USER_STATUSES.CHECKED)
    }

    get confirmedPassengers(){
        return this?.passengers?.filter(passenger => passenger?.status == CARPOOL_USER_STATUSES.CONFIRMED)
    }

    get joinedPassengers(){
        return this?.passengers?.filter(passenger => passenger?.status == CARPOOL_USER_STATUSES.JOINED)
    }

    get myPassengers(){
        if(this.userId!=this.owner) return this.passengers
        return this?.passengers?.filter(passenger=>passenger.id!=this.owner)
    }

}