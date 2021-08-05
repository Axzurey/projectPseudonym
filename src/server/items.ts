import { ReplicatedFirst, ReplicatedStorage, RunService, UserInputService, Workspace } from '@rbxts/services'
import {gamef} from 'shared/quark'
import { entities, observer } from 'server/runtime'
import { dropItem } from './gameFunctions'

export type meleeConstructor = {
    damage : number
    attackSpeed : number
    modifiers : {[key : string] : {
        level : number,
        name : string
    }}[]
}

export class baseMelee {
    client : Player
    name : string | undefined
    damage : number
    equipped : boolean
    events : {[key : string] : RBXScriptConnection | observer.watcher} = {}
    attackSpeed : number
    attackAnimation : AnimationTrack | undefined
    modifiers : {[key : string] : {
        level : number,
        name : string
    }}[]
    object : Model | undefined
    motor : Motor6D | undefined
    attack() {
        if (this.object && this.attackAnimation) {
            let blade = this.object.FindFirstChild("hitbox") as BasePart
            let n = os.clock()
            while (os.clock() - n < this.attackAnimation.Length) {
                let region = gamef.partToRegion3(blade)
                let parts = Workspace.FindPartsInRegion3WithIgnoreList(region, [], 999)
                parts.forEach((part) => {
                    let object = part.Parent
                    let humanoid = object?.FindFirstChild("Humanoid") as Humanoid
                    if (object && object.IsA("Model") && humanoid) {
                        let entity = entities.entityFromModel(object)
                        if (entity) {
                            entity.takeDamage(30)
                        }
                    }
                })
                task.wait()
            }
        }
    }
    constructor(client : Player, objectData : meleeConstructor) {
        this.damage = objectData.damage
        this.attackSpeed = objectData.attackSpeed
        this.modifiers = objectData.modifiers
        this.client = client
        this.equipped = false
    }
    destroy() {
        this.motor?.Destroy()
        this.object?.Destroy()
    }
    equip() {
        this.equipped = true
        this.loadMotors()
        this.loadEvents()
    }
    unequip() {
        this.equipped = false
        if (this.motor) {
            this.motor.Destroy()
        }
        for (let [index, value] of pairs(this.events)) {
            if (value instanceof observer.watcher) {
                value.disconnect()
            }
            else {
                value.Disconnect()
            }
        }
    }
    loadEvents() {
        this.events.stepped = RunService.Stepped.Connect((deltaTime) => {

        })
        let vui = ReplicatedStorage.FindFirstChild("remotes")?.FindFirstChild("validUserInput") as RemoteEvent
        this.events.userInput = observer.watch("validUserInput", (client : Player, direction : 1 | 0, key : Enum.UserInputType  | Enum.KeyCode) => {
            if (this.client !== client) return
        })
    }
    loadMotors() {
        this.motor = new Instance("Motor6D")
        this.motor.Name = "weapon"
        this.motor.Part0 = this.client.Character?.FindFirstChild("HumanoidRootPart") as BasePart
        this.motor.Part1 = this.object?.FindFirstChild("Handle") as BasePart
    }
    finishLoad() {
        let character = this.client.Character
        let humanoid = character?.FindFirstChild("Humanoid") as Humanoid
        if (humanoid) {
            let anim = ReplicatedStorage.FindFirstChild("animations")?.FindFirstChild(this.name as string)
            ?.FindFirstChild("attack") as Animation
            this.attackAnimation = (humanoid.FindFirstChild("Animator") as Animator).LoadAnimation(anim)
        }
    }
}