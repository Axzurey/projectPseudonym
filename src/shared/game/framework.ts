import { RunService, ReplicatedStorage, TweenService, Debris, Players, UserInputService, Workspace, ContextActionService } from "@rbxts/services"
import {enums} from 'shared/enums'
import {Agent, agents} from 'shared/agents'
import { remoteService } from "shared/services"
import { meleeConstructor, baseMelee } from "./items"
import { console } from "shared/pkg/quark"
import { allSkills } from "./skillJoint"
import { baseSkill } from "./base"
import { items } from "shared/game/itemJoint"

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
    skill : baseSkill | undefined
    inventory : unknown[] = []
    hotbar : {[key : string] : any} = {}
    events : {[key : string] : RBXScriptConnection} = {}
    keybinds : {[key : string] : Enum.KeyCode | Enum.UserInputType} = {
        slot1 : Enum.KeyCode.One,
        slot2 : Enum.KeyCode.Two,
        slot3 : Enum.KeyCode.Three,
        skill1 : Enum.KeyCode.Q,
        skill2 : Enum.KeyCode.C,
        skill3 : Enum.KeyCode.G
    }
    camX = 0
    camY = 0
    upperClamp = 75
    lowerClamp = -75
    offset: Vector3 = new Vector3(4, 1, 7)
    camera: Camera = Workspace.CurrentCamera as Camera
    mouse: PlayerMouse = Players.LocalPlayer.GetMouse()
    activationCooldown: number = 0
    uncloakChar() {
        this.character?.GetDescendants().forEach((ch) => {
            if (ch.IsA("BasePart") && (ch.Parent?.ClassName !== "Model" || ch.Parent === this.character)) {
                ch.LocalTransparencyModifier = 0
            }
        })
    }

    cloakChar() {
        this.character?.GetDescendants().forEach((ch) => {
            if (ch.IsA("BasePart") && (ch.Parent?.ClassName !== "Model" || ch.Parent === this.character)) {
                ch.LocalTransparencyModifier = 1
            }
        })
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
            if (input.KeyCode === this.keybinds.slot2) {
                this.equip('slot2')
            }
            if (input.KeyCode === this.keybinds.skill1) {
                this.equipSkill(1)
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
        
        ContextActionService.BindAction('input.player', (action: string, inputstate: Enum.UserInputState, input: InputObject) => {
            this.playerInput(action, inputstate, input)
        }, false, Enum.UserInputType.MouseMovement, Enum.UserInputType.Touch)

        this.events.render = RunService.RenderStepped.Connect((deltaTime) => {
            let sprintMultipier = this.sprinting ? enums.sprintMultiplier : 1
            let speed = this.agent.baseSpeed * sprintMultipier

            this.humanoid.WalkSpeed = speed
            this.humanoid.AutoRotate = false

            //camera & character

            this.camera.CameraType = Enum.CameraType.Scriptable

            UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter
           
            let start = new CFrame(this.rootPart.CFrame.Position).mul(CFrame.Angles(0, math.rad(this.camX), 0))
                .mul(CFrame.Angles(math.rad(this.camY), 0, 0))

            let rootCFrame = this.rootPart.CFrame

            function nmlz(val: number, min: number, max: number): number {
                return math.clamp((val - min) / (max - min), 0, 1)
            }

            let backmax = 6
            let zerogoal = new Vector3(0, 1, 0)

            let closestParams = new RaycastParams()
            closestParams.FilterDescendantsInstances = [this.character as Instance, this.camera]
            closestParams.FilterType = Enum.RaycastFilterType.Blacklist
            let closestBehind = Workspace.Raycast(
                rootCFrame.Position, rootCFrame.Position.sub(rootCFrame.LookVector.mul(backmax)), closestParams
            )
            let dist = 0
            if (closestBehind) {
                dist = (rootCFrame.Position.sub(closestBehind.Position).Magnitude)
                if (dist > backmax) dist = 0
            }

            let pick = 0
            let pl = 0
            if (dist !== 0) {
                pick = 1 - nmlz(dist, 0, backmax)
                pl = pick
                if (pick > .9) pick = 1
            }
            if (pl > .85) {
                this.cloakChar()
            }
            else {
                this.uncloakChar()
            }

            let offset = this.offset.Lerp(zerogoal, pick)

            let camcf = start.ToWorldSpace(new CFrame(offset.X, offset.Y, offset.Z))

            let focus = start.ToWorldSpace(new CFrame(offset.X, offset.Y, -10000))

            this.camera.CFrame = CFrame.lookAt(camcf.Position, focus.Position)

            this.rootPart.CFrame = new CFrame(this.rootPart.Position).mul(CFrame.Angles(0, math.rad(this.camX), 0))

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
    playerInput(action: string, inputstate: Enum.UserInputState, input: InputObject) {
        if (inputstate === Enum.UserInputState.Change) {
            this.camX = this.camX - input.Delta.X
            this.camY = math.clamp(this.camY - input.Delta.Y * 0.4, this.lowerClamp, this.upperClamp)
            //this.rootPart.CFrame = this.rootPart.CFrame.mul(CFrame.Angles(0, math.rad(-input.Delta.X), 0))
        }
    }
    unequip() {
        if (this.item) {
            remoteService.publishAsync('@item.drop')
            let item = this.item
            item.destroy()
        }
    }
    async equip(slot : string) {
        this.unequip()
        let itemData = this.hotbar[slot]
        let idata = itemData as {name : string}
        let main = items.Raiden
        let item = new main(slot, itemData as meleeConstructor, this)
        this.item = item
        let animator = this.humanoid.FindFirstChild("Animator") as Animator
        let dir = ReplicatedStorage.animations.FindFirstChild(idata.name)
        this.idleAnimation = animator.LoadAnimation(dir?.FindFirstChild("idle") as Animation)
        //this.walkAnimation = animator.LoadAnimation(dir?.FindFirstChild("run") as Animation)
    }
    async equipSkill(slot : number) {
        let skillData = await remoteService.requestAsync('@skill.getName', slot) as {name : string}
        print(skillData)
        let skillName = skillData.name
        let skill = allSkills[skillName as keyof typeof allSkills]
        this.skill = new skill()
        this.skill.load(slot)
    }
    getloadout() {
        remoteService.requestAsync('@client.requestLoadout').then((data) => {
            this.inventory = (data as {
                inventory : {}[],
            }).inventory
            this.hotbar = (data as {
                hotbar : {[key : string] : any}
            }).hotbar
        })
    }
}