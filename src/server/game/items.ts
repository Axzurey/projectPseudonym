import { Players, ReplicatedFirst, ReplicatedStorage, RunService, UserInputService, Workspace } from '@rbxts/services'
import {console, gamef} from 'shared/pkg/quark'
//import { dropItem } from 'server/gameFunctions'
import { entities } from 'server/runtime'

export type meleeConstructor = {
    damage : number
    attackSpeed : number
    modifiers : {[key : string] : {
        level : number,
        name : string
    }}[]
}

export type gunConstructor = {
    damage: number
    firerate: number
    modifiers : {[key : string] : {
        level : number,
        name : string
    }}[]
}

export const items : {[key : string] : baseMelee} = {
    
}

export class baseGun {
    client : Player
    name : string | undefined
    damage : number
    attacking : boolean = false
    equipped : boolean
    events : {[key : string] : RBXScriptConnection} = {}
    firerate : number
    attackAnimation : AnimationTrack | undefined
    modifiers : {[key : string] : {
        level : number,
        name : string
    }}[]
    object : Model | undefined
    motor : Motor6D | undefined
    activate(...args: unknown[]) {
        
    }
    constructor(client : Player, objectData : gunConstructor) {
        this.damage = objectData.damage
        this.firerate = objectData.firerate
        this.modifiers = objectData.modifiers
        this.client = client
        this.equipped = false
    }
    destroy() {
        this.unequip()
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
            value.Disconnect()
        }
    }
    loadEvents() {
        this.events.stepped = RunService.Stepped.Connect((deltaTime) => {

        })
    }
    loadMotors() {
        this.motor = new Instance("Motor6D")
        this.motor.Name = "weapon"
        this.motor.Part0 = this.client.Character?.FindFirstChild("Torso") as BasePart
        this.motor.Part1 = this.object?.FindFirstChild("handle") as BasePart
        this.motor.Parent = this.client.Character?.FindFirstChild("Torso") as BasePart
        console.log("gun motors loaded 😀")
    }
    finishLoad() {
        let character = this.client.Character
        let humanoid = character?.FindFirstChild("Humanoid") as Humanoid
        if (humanoid) {
            let anim = ReplicatedStorage.FindFirstChild("animations")?.FindFirstChild(this.name as string)
            ?.FindFirstChild("fire") as Animation
            this.attackAnimation = (humanoid.FindFirstChild("Animator") as Animator).LoadAnimation(anim)
        }
    }
}

export class baseMelee {
    client : Player
    name : string | undefined
    damage : number
    attacking : boolean = false
    equipped : boolean
    events : {[key : string] : RBXScriptConnection} = {}
    attackSpeed : number
    attackAnimation : AnimationTrack | undefined
    modifiers : {[key : string] : {
        level : number,
        name : string
    }}[]
    object : Model | undefined
    motor : Motor6D | undefined
    activate(...args: unknown[]) {
        if (this.object && this.attackAnimation) {
            this.attackAnimation.Play()
            let blade = this.object.FindFirstChild("hitbox") as BasePart
            let n = os.clock()
            let picked : Humanoid[] = []
            while (os.clock() - n < this.attackAnimation.Length) {
                let region = gamef.partToRegion3(blade)
                let parts = Workspace.FindPartsInRegion3WithIgnoreList(region, [], 999)
                parts.forEach((part) => {
                    let object = part.Parent
                    let humanoid = object?.FindFirstChild("Humanoid") as Humanoid
                    if (object && object.IsA("Model") && humanoid &&! Players.GetPlayerFromCharacter(object) && picked.indexOf(humanoid) !== -1) {
                        console.log(`object found: ${object}`)
                        picked.push(humanoid)
                        let entity = entities.entityFromModel(object)
                        if (entity) {
                            entity.takeDamage(this.damage)
                        }
                        else {
                            humanoid.TakeDamage(this.damage)
                        }
                    }
                })
                task.wait()
            }
            console.log("swing ended")
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
        this.unequip()
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
            value.Disconnect()
        }
    }
    loadEvents() {
        this.events.stepped = RunService.Stepped.Connect((deltaTime) => {

        })
    }
    loadMotors() {
        this.motor = new Instance("Motor6D")
        this.motor.Name = "weapon"
        this.motor.Part0 = this.client.Character?.FindFirstChild("Torso") as BasePart
        print(this.object, 'object line')
        this.motor.Part1 = this.object?.FindFirstChild("handle") as BasePart
        this.motor.Parent = this.client.Character?.FindFirstChild("Torso") as BasePart
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