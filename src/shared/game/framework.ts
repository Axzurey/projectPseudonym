import { RunService, ReplicatedStorage, TweenService, Debris, Players, UserInputService } from "@rbxts/services"
import {Agent, agents} from 'shared/agents'

let remotes = ReplicatedStorage.FindFirstChild("remotes")
let postremote = remotes?.FindFirstChild("post") as RemoteEvent
let getremote = remotes?.FindFirstChild("get") as RemoteEvent

export class framework {
    client = Players.LocalPlayer
    character = Players.LocalPlayer.Character
    humanoid : Humanoid
    rootPart : BasePart
    sprinting : boolean = false
    agent : Agent | undefined = new agents.Morgan()
    aiming : boolean = false
    inventory : any[] = []
    hotbar : {[key : string] : {
        index : number
    }} = {}
    events : {[key : string] : RBXScriptConnection} = {}
    constructor() {
        this.humanoid = this.character?.WaitForChild("Humanoid") as Humanoid
        this.rootPart = this.character?.WaitForChild("HumanoidRootPart") as BasePart
        this.events.inputB = UserInputService.InputBegan.Connect((input, gp) => {
            if (gp) return
        })
        this.events.inputA = UserInputService.InputEnded.Connect((input) => {

        })
        this.events.render = RunService.RenderStepped.Connect((deltaTime) => {
            let speed = 0
        })
        this.events.onpost = postremote.OnClientEvent.Connect((endpoint : string, data : any[]) => {
            if (endpoint === "loadout") {
                this.inventory = (data as unknown as {inventory : any[]}).inventory
                this.hotbar = (data as unknown as {hotbar : {[key : string] : {
                    index : number
                }}}).hotbar
            }
        })
    }
    getInventory() {
        let get = remotes?.FindFirstChild("get") as RemoteEvent
        get.FireServer()
    }
}