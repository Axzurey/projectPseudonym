import { framework } from "shared/game/framework"
import { baseGun, gunConstructor } from "shared/game/items"

export class BasicShotgun extends baseGun {
    constructor(slot : string, objectdata : gunConstructor, env : framework) {
        super(slot, objectdata, env)
    }
}