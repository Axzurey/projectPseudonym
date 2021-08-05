export class Agent {
    baseSpeed : number = 0
    baseHealth : number = 0
    constructor() {

    }
}

class Morgan extends Agent {
    baseSpeed = 14
    baseHealth = 100
    constructor() {
        super()
    }
}

export const agents = {
    Morgan : Morgan
}