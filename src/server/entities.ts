export type validDebuff = 'corrosion'

export class debuff {
    level : number = 0
    name : string | undefined
    entity : entity
    active : boolean = false
    trigger : () => void = () => {}
    cancel : () => void = () => {}
    constructor(entity : entity, level : number) {
        this.level = level
        this.entity = entity
    }
}

class corrosion extends debuff {
    constructor(entity : entity, level : number) {
        
        super(entity, level)

        this.name = "corrosion"
        this.active = true

        this.cancel = function() {
            this.active = false
        }

        this.trigger = function() {
            for (let i=0; i < 10; i++) {
                if (!this.active) break
                this.entity.takeDamage(10 * this.level)
                task.wait((2 / this.level) + 1)
            }
        }
    }
}

export const debuffs : {[key : string] : any} = {
    corrosion : corrosion,
    poison : true
}

export class entity {
    id : string = ""
    maxHealth : number = 1
    health : number = 0
    buffs : [] = []
    debuffs : debuff[] = []
    object : Model | undefined
    humanoid : Humanoid | undefined
    rootPart : BasePart | undefined
    constructor() {
        
    }
    applyDebuff(debuff : validDebuff, level : number) {
        let d = new debuffs[debuff](this, level)
        this.debuffs.push(d)
    }
    removeDebuff(debuff : debuff | string) {
        if (type(debuff) === "string") {
            this.debuffs.forEach((value, index) => {
                if (value.name === debuff) {
                    this.debuffs.remove(index)
                }
            })
        }
        else {
            this.debuffs.forEach((value, index) => {
                if (value === debuff) {
                    this.debuffs.remove(index)
                }
            })
        }
    }
    takeDamage(damage : number) {
        let c = this.health - damage
        this.health = math.clamp(c, 0, c)
    }
    heal(health : number) {
        let c = this.health + health
        this.health = math.clamp(c, c, this.maxHealth)
    }
}