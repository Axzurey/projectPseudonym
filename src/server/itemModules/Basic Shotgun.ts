import { ReplicatedStorage, Workspace } from "@rbxts/services"
import { baseGun, gunConstructor } from "server/game/items"
import { projectile, workbench } from "server/runtime"
import { console } from "shared/pkg/quark"

export default class main extends baseGun {
    constructor(client : Player, objectData : gunConstructor) {
        super(client, objectData)
        this.object = ReplicatedStorage.FindFirstChild("itemModels")?.FindFirstChild("Basic Shotgun")?.Clone() as Model
        this.object.Parent = client.Character
        this.name = script.Name
        this.loadMotors()
        this.loadEvents()
        this.finishLoad()
    }
    activate(...args: unknown[]) {
        this.attackAnimation?.Play()
        let camLook = args[0] as Vector3
        let spread = (args[1] || 4) as number
        let barrel = this.object?.FindFirstChild("barrel") as BasePart
        let random = new Random()
        let dir = CFrame.lookAt(barrel.Position, camLook).mul(CFrame.Angles(
            random.NextNumber(-spread, spread), random.NextNumber(-spread, spread), 0))

        let l = new Instance("Part")
        l.Color = Color3.fromRGB(0, 255, 255)
        l.Size = new Vector3(.1, .1, 2)
        l.Anchored = true
        l.CanCollide = false
        l.CanCollide = false
        l.Parent = Workspace

        let sim = new projectile.projectileSimulation(dir, {
            velocity: 3,
            gravity: 0,
            onImpact: (r: RaycastResult) => {
                console.log(`projectile impacted @${r.Position} #${r.Instance}`)
            },
            onTerminate: () => {
                console.log("projectile terminated")
            },
            onUpdate: (cframe: CFrame) => {
                l.CFrame = cframe
            },
            canReflect: (n: RaycastResult, r: Number, d: Number, c: CFrame) => {
                return false
            }
        })
    }
}