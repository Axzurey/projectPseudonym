import { framework } from "shared/game/framework"
import { baseMelee, meleeConstructor } from "shared/game/items"

export class main extends baseMelee {
    constructor(slot : string, objectdata : meleeConstructor, env : framework) {
        super(slot, objectdata, env)
    }
}