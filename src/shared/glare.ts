import { RunService, Workspace } from "@rbxts/services"
import { t } from "@rbxts/t"
import { console } from "./pkg/quark"

export interface particleParameters {
    particles : BasePart[] | number
    renderBaseParts? : boolean
    container? : Instance
    filter? : {
        type : Enum.RaycastFilterType,
        target : "&p" | Instance | Instance[]
    }
}

export class glareParticle {
    private particleParams : particleParameters
    private particles : BasePart[] = []

    public onUpdate : ((parts : BasePart[], deltaTime : number) => void) | undefined | null = undefined
    public onTouched : ((hit : BasePart, particle : BasePart, results : RaycastResult) => void) | undefined | null

    events : {[key : string] : RBXScriptConnection} = {}
    constructor(_particleParams : particleParameters) {
        this.particleParams = _particleParams
        this.events.render = RunService.RenderStepped.Connect((deltaTime) => {
            this.update(deltaTime)
        })
    }
    public load() {
        return new Promise((resolve, reject) => {
            try {
                if (typeIs(this.particleParams.particles, "number")) {
                    for (let i = 0; i < this.particleParams.particles; i++) {
                        console.log("tis a number")
                        if (this.particleParams.renderBaseParts) {
                            let n = new Instance("Part")
                            n.Size = new Vector3(0, 0, 0)
                            n.Anchored = true
                            n.CanCollide = false
                            n.CanTouch = false
                            n.Transparency = 1
                            n.Parent = Workspace
                            this.particles.push(n)
                        } else {
                            let n = new Instance("Part")
                            n.Size = new Vector3(0, 0, 0)
                            n.Anchored = true
                            n.CanCollide = false
                            n.CanTouch = false
                            n.Transparency = 1
                            n.Parent = Workspace
                            let y = new Instance("ParticleEmitter")
                            y.Parent = n
                            y.Acceleration = new Vector3(0, 0, 0)
                            y.Drag = math.huge
                            y.Size = new NumberSequence(.1)
                            y.Lifetime = new NumberRange(math.huge - 1, math.huge)
                            y.LockedToPart = true
                            y.Emit()
                            this.particles.push(n)
                        }
                    }
                    
                } else {
                    console.log("tis not a number")
                    for (let [i, v] of pairs(this.particles)) {
                        if (!v.Parent) {
                            v.Parent = this.particleParams.container || Workspace
                        }
                        v.Anchored = true
                        v.CanCollide = false
                        v.CanTouch = false
                    }
                }
                resolve(true)
            }
            catch(err) {
                console.raise(err, "didn't work")
                reject(err)
            }
        })
    }
    private detectFromCast(part : BasePart) : BasePart | void {
        let ignore = new RaycastParams()
        ignore.FilterType = Enum.RaycastFilterType.Blacklist
        const instanceArray = t.array(t.Instance)
        if (this.particleParams.filter) {
            if (this.particleParams.filter.target === "&p") {
                ignore.FilterDescendantsInstances = this.particles
            }
            else if(instanceArray(this.particleParams.filter.target)) {
                ignore.FilterDescendantsInstances = this.particleParams.filter.target
            }
            else if(this.particleParams.filter.target instanceof Instance) {
                ignore.FilterDescendantsInstances = [this.particleParams.filter.target]
            }
        }
        let cf = part.CFrame
        let size = part.Size
        let offsets = []
        let cn1 = cf.Position.add(new Vector3(0, size.Y / 2, 0))
        let cn2 = cf.Position.add(new Vector3(size.X / 2, 0, 0))
        let cn3 = cf.Position.add(new Vector3(0, 0, size.Z / 2))
        let cn4 = cf.Position.sub(new Vector3(0, size.Y / 2, 0))
        let cn5 = cf.Position.sub(new Vector3(size.X / 2, 0, 0))
        let cn6 = cf.Position.sub(new Vector3(0, 0, size.Z / 2))
        //00change to region3
        offsets.push(cn1)
        offsets.push(cn2)
        offsets.push(cn3)
        offsets.push(cn4)
        offsets.push(cn5)
        offsets.push(cn6)
        for (let i=0; i < 6; i++) {
            let result = Workspace.Raycast(cf.Position, offsets[i], ignore || undefined)
            if (result) {
                print("is result")
                coroutine.wrap(() => {
                    print("calling")
                    if (this.onTouched && result) {
                        this.onTouched(result.Instance, part, result)
                        print("called")
                    }
                })()
                break
            }
        }
    }
    private update(deltaTime : number) {
        if (this.onUpdate) {
            coroutine.wrap(() => {
                if (this.onTouched) {
                    this.particles.forEach((part) => {
                        this.detectFromCast(part)
                    })
                }
            })()
            this.onUpdate(this.particles, deltaTime)
        }
    }
}