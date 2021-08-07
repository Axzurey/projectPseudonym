import { RunService, ReplicatedStorage, TweenService, Debris, Players, UserInputService } from "@rbxts/services"
import {enums} from 'shared/enums'
import {Agent, agents} from 'shared/agents'
import { remoteService } from "shared/services"
import { meleeConstructor, baseMelee } from "./items"
import { console } from "shared/quark"

export class framework {
    client = Players.LocalPlayer
    character = Players.LocalPlayer.Character
    humanoid : Humanoid
    rootPart : BasePart
    sprinting : boolean = false
    mouseDown : boolean = false
    agent : Agent = new agents.Morgan()
    item : baseMelee | undefined = undefined
    idleAnimation : AnimationTrack | undefined
    walkAnimation : AnimationTrack | undefined
    aiming : boolean = false
    inventory : unknown[] = []
    hotbar : {[key : string] : {
        index : number
    }} = {}
    events : {[key : string] : RBXScriptConnection} = {}
    keybinds : {[key : string] : Enum.KeyCode | Enum.UserInputType} = {
        slot1 : Enum.KeyCode.One,
        slot2 : Enum.KeyCode.Two,
        slot3 : Enum.KeyCode.Three
    }
    constructor() {
        this.humanoid = this.character?.WaitForChild("Humanoid") as Humanoid
        this.rootPart = this.character?.WaitForChild("HumanoidRootPart") as BasePart
        this.events.inputB = UserInputService.InputBegan.Connect((input, gp) => {
            if (gp) return
            if (input.UserInputType === Enum.UserInputType.MouseButton1) {
                this.mouseDown = true
            }
            if (input.UserInputType === Enum.UserInputType.MouseButton2) {
                this.aiming = true
            }
            if (input.KeyCode === this.keybinds.slot1) {
                this.equip('slot1')
            }
        })
        this.events.inputE = UserInputService.InputEnded.Connect((input) => {
            if (input.UserInputType === Enum.UserInputType.MouseButton1) {
                this.mouseDown = false
            }
            if (input.UserInputType === Enum.UserInputType.MouseButton2) {
                this.aiming = false
            }
        })
        this.events.render = RunService.RenderStepped.Connect((deltaTime) => {
            let sprintMultipier = this.sprinting ? enums.sprintMultiplier : 1
            let speed = this.agent.baseSpeed * sprintMultipier
            this.humanoid.WalkSpeed = speed

            if (this.humanoid.MoveDirection.Magnitude === 0) {
                if (!this.idleAnimation?.IsPlaying) {
                    this.idleAnimation?.Play()
                }
                if (this.walkAnimation?.IsPlaying) {
                    this.walkAnimation.Stop()
                }
            }
            else {
                if (this.idleAnimation?.IsPlaying) {
                    this.idleAnimation.Stop()
                }
                if (!this.walkAnimation?.IsPlaying) {
                    this.walkAnimation?.Play()
                }
            }
        })
        this.getloadout()
    }
    unequip() {
        if (this.item) {
            let item = this.item
            item.destroy()
        }
    }
    async equip(slot : string) {
        this.unequip()
        let index = this.hotbar[slot].index
        let itemData = this.inventory[index]
        let idata = itemData as {name : string}
        let main = (await import("shared/itemModules/Raiden")).main
        let item = new main(slot, itemData as meleeConstructor, this)
        this.item = item
        let animator = this.humanoid.FindFirstChild("Animator") as Animator
        let dir = ReplicatedStorage.animations.FindFirstChild(idata.name)
        this.idleAnimation = animator.LoadAnimation(dir?.FindFirstChild("idle") as Animation)
        this.walkAnimation = animator.LoadAnimation(dir?.FindFirstChild("run") as Animation)
    }
    getloadout() {
        remoteService.requestAsync('@client.requestLoadout').then((data) => {
            this.inventory = (data as {
                inventory : {}[],
            }).inventory
            this.hotbar = (data as {
                hotbar : {[key : string] : {
                    index : number
                }}
            }).hotbar
        })
    }
}