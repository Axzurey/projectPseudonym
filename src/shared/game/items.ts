import { Players, UserInputService } from "@rbxts/services"
import { console } from "shared/quark"
import { remoteService } from "shared/services"
import { framework } from "./framework"

export interface meleeConstructor {
    attackSpeed : number
}

export class baseMelee {
    client : Player
    name : string | undefined
    events : {[key : string] : RBXScriptConnection} = {}
    attackSpeed : number
    attackAnimation : AnimationTrack | undefined
    unionSuccessful : boolean = false
    env : framework
    attack() {
        remoteService.publishAsync("itemButton1")
    }
    constructor(slot : string, objectData : meleeConstructor, env : framework) {
        this.attackSpeed = objectData.attackSpeed
        this.client = Players.LocalPlayer
        this.env = env
        remoteService.requestAsync('itemEquip', slot).then(() => {
            this.unionSuccessful = true
            console.log("successfull union")
        })
        this.events.input = UserInputService.InputBegan.Connect((input, gp) => {
            if (gp) return
            if (this.unionSuccessful) {
                if (input.UserInputType === Enum.UserInputType.MouseButton1) {
                    this.attack()
                }
            }
        })
    }
    destroy() {
        for (let [index, value] of pairs(this.events)) {
            value.Disconnect()
        }
    }
}