import {textures} from 'shared/pkg/textures'
import {entities, linter, channel, effects, projectile, workbench, touch} from 'server/runtime'
import { console } from 'shared/pkg/quark'
import {Workspace, ReplicatedStorage, ServerScriptService, ServerStorage, RunService, Players} from '@rbxts/services'
import { baseSkill } from 'server/game/base'

//config

let buffs = [
    'regeneration', 'max health up permanent', 'debuff immune'
]

let debuffs = [
    'max health down', 'poisoned', 'stunned', 'spreading fire', 'burned'
]

export default class main extends baseSkill {
    orbs : Model[] = []
    active : boolean = false
    client: Player
    level: number
    constructor(client: Player, level: number) {
        super()
        this.client = client
        this.active = true
        this.level = level
        let orbnames = ['akemi', 'katsu', 'mushi', 'saya', 'yumi']
        orbnames.forEach((name) => {
            let orb : Model = ReplicatedStorage.assets.FindFirstChild('_svnsts')?.FindFirstChild(name) as Model
            let o = orb.Clone()
            o.Parent = Workspace
            this.orbs.push(o)
        })
    }
    async activate(...args : any[]) {
        let character = this.client.Character
        let rootpart = character?.FindFirstChild("HumanoidRootPart") as BasePart
        let r = new Vector3().mul(this.level)
        let reg = new Region3(rootpart.Position.sub(r), rootpart.Position.add(r))
        let parts = Workspace.FindPartsInRegion3WithIgnoreList(reg, [], 999)
    }
    instanceRequest() : Model[] {
        console.log("instance request passed over")
        return this.orbs
    }
}