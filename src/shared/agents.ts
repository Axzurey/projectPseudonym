export class Agent {
    baseSpeed : number = 0
    baseHealth : number = 0
    baseJumpHeight : number = 0
    skills : {[key : string] : {
        name : string,
        cooldown : number,
        description : string,
        icon : string
    }} = {}
    info : {
        baseModifiers : string[]
    } = {
        baseModifiers : []
    }
    constructor() {

    }
}

class Morgan extends Agent {
    baseSpeed = 14
    baseHealth = 100
    baseJumpHeight = 1.5

    skills = {
        skill1 : {
            name : "Frivolous Summer Sky",
            cooldown : 120,
            description : "Deal damage to nearby enemies and inflict Charm effect on nearby [male] enemies",
            icon : "",
        },
        skill2 : {
            name : "Subliminal Sunbeam",
            description : "Deal heavy damage to all nearby enemies and inflict [burn] effect to all nearby [biological] and [mechanical] enemies",
            cooldown : 60,
            icon : ""
        },
        skill3 : {
            name : "Fate-Bound Eclipse",
            description : "Heal all allies and inflict [regeneration] to all allies for 45 seconds",
            cooldown : 60,
            icon : ""
        }
    }
    info = {
        baseModifiers : [
            'female', 'sentient', 'biological', 'humanoid'
        ]
    }

    constructor() {
        super()
    }
}

export const agents = {
    Morgan : Morgan
}