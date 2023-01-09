export class User {
    constructor(data) {

        this.raw = data
        Object.assign(this, data)

    }

    get first_name(){
        return this.full_name.split(' ')[0]
    }

    get last_name(){
        return this.full_name.split(' ')[1]
    }

    get type(){
       return this.company ? USER_TYPES.CORPORATE : USER_TYPES.EVENT
    }

}

export const USER_TYPES = { 
    CORPORATE : 'Corporate',
    EVENT : 'Event'
}