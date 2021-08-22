import {remoteService} from 'shared/services'
import { Players, ReplicatedStorage, RunService, TweenService, Workspace } from '@rbxts/services'
import { console} from 'shared/pkg/quark'
import { baseSkill } from 'shared/game/base'

let agent = 'Morgan'
let client = Players.LocalPlayer

let toPointsXZ = function(): Vector3[] {
    let t = 1 //360 / amount of points(in this case the points are 360)
    let radius = 7
    let points: Vector3[] = []
    for (let i=1; i <= 360; i++) {
        let theta = math.rad(t * i)
        let x = math.cos(theta) * radius
        let z = math.sin(theta) * radius
        let position = new Vector3(x, 0, z)
        points.push(position)
    }
    return points
}

export default class main extends baseSkill {
    objects : Model[] = []
    active : boolean = false
    constructor() {
        super()
    }
    async activate() {
        this.active = true
        console.log('activated....')
        let character = client.Character
        let runs : {[key: string]: number} = {}
        let points = toPointsXZ()
        print(points)
        coroutine.wrap(() => {
            this.objects.forEach((orb: Model) => {
                coroutine.wrap(() => {
                    orb.GetChildren().forEach((child: Instance) => {
                        let t = TweenService.Create(child as BasePart, new TweenInfo(3), {
                            Size: new Vector3(0, 0, 0)
                        })
                        t.Play()
                    })
                    task.wait(3)
                    let explosion = ReplicatedStorage.assets.FindFirstChild("energy_explosion")?.Clone() as Model
                    explosion.SetPrimaryPartCFrame(orb.GetPrimaryPartCFrame())
                    explosion.GetChildren().forEach((v: Instance) => {
                        let n = v as BasePart
                        n.Color = orb.PrimaryPart?.Color as Color3
                        let size = n.Size
                        n.Size = new Vector3(0, 0, 0)
                        TweenService.Create(n, new TweenInfo(.75), {Orientation: new Vector3(999, 999, 0)}).Play()
                        TweenService.Create(n, new TweenInfo(.75), {Size: size}).Play()
                    })
                    explosion.Parent = Workspace
                    task.wait(1.25)
                    explosion.GetChildren().forEach((v: Instance) => {
                        let n = v as BasePart
                        TweenService.Create(n, new TweenInfo(.5), {Orientation: new Vector3(-999, -999, 0)}).Play()
                        TweenService.Create(n, new TweenInfo(1), {Size: new Vector3(0, 0, 0)}).Play()
                    })
                    task.wait(.5)
                    explosion.Destroy()
                    this.active = false
                })()
            })
        })()
        let delta = 1
        let n = RunService.RenderStepped.Connect((deltaTime) => {
            if (!client.Character || !this.active) {n.Disconnect(); this.destroy(); return}
            delta = math.ceil(delta + 1.45 * deltaTime * 60)
            this.objects.forEach((object, index) => {
                if (!character || !character.PrimaryPart) return
                if (!runs[object.Name] && runs[object.Name] !== 0) {
                    runs[object.Name] = (360 / 5) * index
                    console.log(runs[object.Name])
                }
                let charvector = character.PrimaryPart.Position
                object.SetPrimaryPartCFrame(new CFrame(charvector.add(points[runs[object.Name]])))
                runs[object.Name] += math.clamp(delta, 0, 5)
                if (runs[object.Name] >= 360) {
                    runs[object.Name] = 0
                }
            })
        })
    }
    async load(slot: number) {
        print(slot)
        await remoteService.requestAsync('@skill.load', slot)
        this.objects = await remoteService.requestAsync('@skill.requestObject') as Model[]
        this.activate()
    }
    destroy() {
        this.objects.forEach((o) => {
            o.Destroy()
        })
        remoteService.publishAsync('@skill.drop')
    }
}