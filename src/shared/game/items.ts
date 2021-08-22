import { Players, RunService, UserInputService, Workspace } from "@rbxts/services"
import { console } from "shared/pkg/quark"
import { remoteService } from "shared/services"
import { framework } from "./framework"

export interface meleeConstructor {
    attackSpeed: number
    cooldown: number
}

export interface gunConstructor {
    firerate: number
    cooldown: number
}

export class baseGun {
    client : Player
    name : string | undefined
    events : {[key : string] : RBXScriptConnection} = {}
    firerate : number
    attackAnimation : AnimationTrack | undefined
    reloadAnimation: AnimationTrack | undefined
    unionSuccessful : boolean = false
    env : framework
    mousedown: boolean = false
    mouse: PlayerMouse = Players.LocalPlayer.GetMouse()
    camera: Camera = Workspace.CurrentCamera as Camera
    attack() {
        this.attackAnimation?.Play()
        remoteService.publishAsync("itemButton1", this.camera.CFrame.LookVector)
    }
    reload() {

    }
    constructor(slot : string, objectData : gunConstructor, env : framework) {
        this.firerate = objectData.firerate
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
                    this.mousedown = true
                }
            }
        })
        this.events.inpend = UserInputService.InputEnded.Connect((input) => {
            if (input.UserInputType === Enum.UserInputType.MouseButton1) {
                this.mousedown = false
            }
        })
        this.events.render = RunService.RenderStepped.Connect(() => {
            if (tick() - env.activationCooldown < this.firerate / (60 ^ 2)) return
            env.activationCooldown = tick()
            this.attack()
        })
    }
    destroy() {
        for (let [index, value] of pairs(this.events)) {
            value.Disconnect()
        }
    }
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
                    if (tick() - env.activationCooldown < this.attackSpeed) return
                    env.activationCooldown = tick()
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