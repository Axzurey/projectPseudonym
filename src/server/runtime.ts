import { Players, MessagingService, DataStoreService, Workspace, TweenService, RunService, HttpService } from "@rbxts/services"
import { entity, debuff, debuffs } from "server/entities"
import { console } from "shared/quark"
import { mathService } from "shared/services"
import { modifiers } from "./modifiers"
import { sphere } from "shared/shapesf"
import {} from 'server/game/database'
import {recipes, charging, extraction} from 'server/game/recipes'

export namespace requests {
    interface requestParams {
        method : "POST" | "GET" | "DELETE" | "PUT" | "PATCH" | "HEAD"
        url : string
        headers? : {[key : string] : any}
        body? : any
    }
    export class request {
        params : requestParams
        constructor(requestParams : requestParams) {
            this.params = requestParams
        }
        requestAsync() : Promise<RequestAsyncResponse> {
            return new Promise((resolve, reject) => {
                try {
                    let n = HttpService.RequestAsync({
                        Url : this.params.url,
                        Method : this.params.method,
                        Headers : this.params.headers,
                        Body : this.params.body
                    })
                    resolve(n)
                } catch(e) {
                    reject(e)
                }
            })
        }
        set(type : 'method' | 'url' | 'headers' | 'body', value : any) {
            this.params[type] = value
        }
        get(type : 'method' | 'url' | 'headers' | 'body') {
            return this.params[type]
        }
    }
}

export namespace workbench {
    export function getRecipe(item : string) {
        return recipes[item]
    }
    export function getCharging(item : string) {
        return charging[item]
    }
    export function getExtraction(item : string) {
        return extraction[item]
    }
}

export namespace cache {
    let needyOverflow : number = 20 //#Recommended; if this is a non zero number, when additional instances are required it will create (x) extra instances
    let newBin = function() : Instance {
        let n = new Instance("Folder")
        n.Name = "#cachbin"
        n.Parent = Workspace
        return n
    }
    let cachedParts : Part[] = []
    let cachedAttachments : Attachment[] = []
    let cachebin = Workspace.FindFirstChild("#cachebin") || newBin()
    export function allocateParts(parts : number) {
        for (let i=0; i < parts; i++) {
            let n = new Instance("Part")
            n.Transparency = 1
            n.Anchored = true
            n.CanCollide = false
            n.CanTouch = false
            n.Size = new Vector3(0, 0, 0)
            n.Position = new Vector3(0, -100000, 0)
            n.Parent = cachebin
            cachedParts.push(n)
        }
    }
    export function cacheParts(parts : Part[]) {
        parts.forEach((n : Part) => {
            cachedParts.push(n)
        })
    }
    export function allocateAttachments(attachments : number) {
        for (let i=0; i < attachments; i++) {
            let n = new Instance("Attachment")
            n.Position = new Vector3(0, -100000, 0)
            n.Parent = cachebin
            cachedAttachments.push(n)
        }
    }
    export function getParts(amount : number) : Promise<Part[]> {
        return new Promise((resolve, reject) => {
            let parts : Part[] = []
            if (amount > cachedParts.size()) {
                let size = cachedParts.size()
                allocateParts(needyOverflow ? amount - size + needyOverflow : 
                    amount - size)
            }
            for (let i=0; i < amount; i++) {
                let n = cachedParts[cachedParts.size() - 1]
                cachedParts.pop()
                parts.push(n)
            }
            resolve(parts)
        })
    }
    export function getAttachments(amount : number) : Promise<Attachment[]> {
        return new Promise((resolve, reject) => {
            let attachments : Attachment[] = []
            if (amount > cachedAttachments.size()) {
                let size = cachedAttachments.size()
                allocateAttachments(needyOverflow ? amount - size + needyOverflow : 
                    amount - size)
            }
            for (let i=0; i < amount; i++) {
                let n = cachedAttachments[cachedAttachments.size() - 1]
                cachedAttachments.pop()
                attachments.push(n)
            }
            resolve(attachments)
        })
    }
}

export namespace projectile {
    
    interface projectileConfig {
        reflect? : boolean
        terminateAfter? : number
        velocity : number
        gravity : number
        params? : RaycastParams
        onImpact : (raycastresult : RaycastResult, cframe : CFrame) => void
        canReflect : (raycastresult : RaycastResult, reflections : Number, distance : Number, cframe : CFrame) => boolean
        onTerminate : () => void
        onUpdate : (cframe : CFrame) => void
    }

    interface scaleCollConfig {
        velocity : number
        terminateAfter : number
        params? : RaycastParams
        onTerminate : () => void
        onUpdate : (cframe : CFrame) => void
        onImpact : (raycastresult : RaycastResult, cframe : CFrame) => void
    }

    export class scaleCollisionSimulation {
        cframe : CFrame
        config : scaleCollConfig
        active : boolean
        constructor(cframe : CFrame, config : scaleCollConfig) {
            let studs = 0
            this.cframe = cframe
            this.config = config
            this.active = true
            let r = RunService.Heartbeat.Connect((deltaTime) => {
                if (!this.active) {r.Disconnect(); return}
                let increment = config.velocity * deltaTime * 60
                studs += increment
                if (config.terminateAfter && studs >= config.terminateAfter) {config.onTerminate(); return}
                let result = Workspace.Raycast(this.cframe.Position, 
                    this.cframe.LookVector.mul(config.velocity), this.config.params || undefined)
                if (result) {
                    this.config.onImpact(result, this.cframe)
                    this.terminate()
                }
                else {
                    this.cframe = CFrame.lookAt(this.cframe.Position.mul(this.cframe.LookVector.mul(increment)), 
                    this.cframe.LookVector.mul(increment))
                    this.config.onUpdate(this.cframe)
                }
            })
        }
        terminate() {
            this.active = false
            this.config.onTerminate
        }
    }
    export class projectileSimulation { //#todo: add gravity
        cframe : CFrame
        config : projectileConfig
        active : boolean
        constructor(cframe : CFrame, config : projectileConfig) {
            let studs = 0
            let reflections = 0
            this.cframe = cframe
            this.config = config
            this.active = true
            let r = RunService.Heartbeat.Connect((deltaTime) => {
                if (!this.active) {r.Disconnect(); return}
                let increment = config.velocity * deltaTime * 60
                studs += increment
                if (config.terminateAfter && studs >= config.terminateAfter) {config.onTerminate(); return}
                let result = Workspace.Raycast(this.cframe.Position, 
                    this.cframe.LookVector.mul(config.velocity), this.config.params || undefined)
                if (result) {
                    let normal = result.Normal
                    if (this.config.reflect && this.config.canReflect(result, reflections, studs, this.cframe)) {
                        reflections += 1
                        this.cframe = CFrame.lookAt(this.cframe.Position, mathService.refract(this.cframe.LookVector, normal))
                        this.config.onUpdate(this.cframe)
                    }
                    else {
                        this.config.onImpact(result, this.cframe)
                        this.terminate()
                    }
                }
                else {
                    this.cframe = CFrame.lookAt(this.cframe.Position.mul(this.cframe.LookVector.mul(increment)), 
                    this.cframe.LookVector.mul(increment))
                    this.config.onUpdate(this.cframe)
                }
            })
        }
        terminate() {
            this.active = false
            this.config.onTerminate()
        }
    }
}

export namespace database {

}

export namespace effects {
    let fireFlies = []
    let effects = Workspace.FindFirstChild("#visual/effects") || new Instance("Folder")
    effects.Name = "#visual/effects"
    effects.Parent = Workspace
    let anchor = effects.FindFirstChild("@visual/effects.anchor") as Part || new Instance("Part")
    anchor.CanCollide = false
    anchor.CanTouch = false
    anchor.Anchored = true
    anchor.Transparency = 1
    anchor.Size = new Vector3(0, 0, 0)
    anchor.Name = "@visual/effects.anchor"
    anchor.Parent = effects
    class fireFly {
        object : Part
        effect : PointLight
        active : Boolean = false
        anchor : Vector3
        constructor(anc : Vector3) {
            this.anchor = anc
            this.active = true
            this.object = new Instance("Part")
            this.object.Anchored = true
            this.object.Position = anc
            this.object.Size = new Vector3(.3, .3, .3)
            this.object.Shape = Enum.PartType.Ball
            this.object.Color = Color3.fromRGB(255, 255, 0)
            this.object.Material = Enum.Material.Neon
            this.object.CanCollide = false
            this.object.CanTouch = false
            this.object.Parent = anchor
            this.effect = new Instance("PointLight")
            this.effect.Parent = this.object
            this.effect.Color = Color3.fromRGB(255, 255, 0)
            this.effect.Range = 5
            let random = new Random()
            this.effect.Brightness = random.NextNumber(.1, 15)
            coroutine.wrap(() => {
                while (this.active) {
                    TweenService.Create(this.effect, new TweenInfo(1), {Brightness : random.NextNumber(.1, 15)}).Play()
                    task.wait(1 + random.NextNumber(-1, 1.5))
                }
            })()
            this.fly()
        }
        fly() {
            coroutine.wrap(() => {
                let n = new Random()
                while (this.active) {
                    let bounds = 5
                    let [x, y, z] = [this.anchor.X + n.NextNumber(-bounds, bounds), this.anchor.Y + n.NextNumber(-bounds, bounds), 
                    this.anchor.Z + n.NextNumber(-bounds, bounds)]
                    let position = new Vector3(x, y, z)
                    let distance = this.object.Position.sub(position).Magnitude
                    let velocity = 1
                    TweenService.Create(this.object, new TweenInfo(distance / velocity), {Position : position}).Play()
                    task.wait((distance / velocity) + n.NextNumber(.25, 3))
                }
            })()
        }
        destroy() {
            this.active = false
            this.object.Destroy()
        }
    }
    export function createFireFlies(count : number) {
        for (let i = 0; i < count; i++) {
            let n = new fireFly(new Vector3(0, 20, 0))
            fireFlies.push(n)
        }
    }
}

export namespace channel {
    let channels : {
        name : string,
        callback : (...args : unknown[]) => unknown[] | unknown | void
        disconnect : () => void
    }[] = []
    export function requestAsync(name : string, ...args : unknown[]) {
        return new Promise((resolve, reject) => {
            channels.forEach((t) => {
                if (name === t.name) {
                    let n = t.callback(...args)
                    resolve(n)
                }
            })
        })
    }
    export function channel(name : string, callback : (...args : unknown[]) => unknown[] | unknown | void) {
        let n = {
            name : name,
            callback : callback,
            disconnect : () => {
                let i = channels.indexOf(n)
                if (i !== -1) {
                    channels.remove(i)
                }
            }
        }
        channels.push(n)
        return n
    }
}

export namespace nString {
    export const upperCase : String[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
        'T', 'U', 'V', 'W', 'X', 'Y', 'X']

    export const digits : Number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    export const lowerCase : String[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
    't', 'u', 'v', 'w', 'x', 'y', 'z']

    export const numbers : String[] = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']

    export function alphaNum(length : number) : string {
        let str = ''
        for (let i=0; i < length; i++) {
            let t = math.random(3)
            if (t === 2) {
                str += tostring(digits[math.random(0, digits.size() - 1)])
            }
            else if (t === 3) {
                str += upperCase[math.random(0, upperCase.size() - 1)]
            }
            else {
                str += lowerCase[math.random(0, lowerCase.size() - 1)]
            }
        }
        return str
    }
}

export namespace serverService {
    export const currentVersion = '1.0.0'
    export const gameVersions = ['1.0.0']
}

export namespace partyService {
    export let activeParty : party
    type partyData = {
        partyId : string
        leader : string
        members : string[]
    }
    export function inviteListen(client : Player) {
        return MessagingService.SubscribeAsync(`inviteListen${client.UserId}`, (data : any, sent : number) => {
            let partyid = (data as partyData).partyId
            let leader = (data as partyData).leader
            let members = (data as partyData).members
            let party = new partyService.party(leader)
            party.members = members
            party.id = partyid
            activeParty = party
        })
    }
    export function memberLeaveListen(client : Player) {
        return MessagingService.SubscribeAsync(`partyUpdate${client.UserId}`, (data : any, sent : number) => {
            let partyid = (data as partyData).partyId
            let leader = (data as partyData).leader
            let members = (data as partyData).members
            if (activeParty) {
                activeParty.members = members
                activeParty.leader = leader
                activeParty.id = partyid
            }
            else {
                let party = new partyService.party(leader)
                party.members = members
                party.id = partyid
                activeParty = party
            }
        })
    }
    let invite = function(party : party, client : String) {
        let id = Players.GetUserIdFromNameAsync(client as string)
        MessagingService.PublishAsync(`inviteListen${id}`, {
            partyId : party.id,
            leader : party.leader,
            members : party.members
        })
    }
    export class party {
        leader : String = ""
        id : string
        members : String[] = []
        constructor(leader : String) {
            let ds = DataStoreService.GetDataStore(`$partyServiceID${serverService.currentVersion}`)
            let id : string = ""
            let getId = () => {
                id = nString.alphaNum(32)
                if (ds.GetAsync(id)) {
                    getId()
                }
            }
            getId()
            this.id = id
            this.leader = leader
            ds.SetAsync(id, true)
        }
        inviteMember(client : String) {
            invite(this, client)
        }
        joinParty(client : String) {
            this.members.push(client)
        }
        leaveParty(client : String) {
            let n = this.members.indexOf(client)
            if (n === - 1) return
            this.members.remove(n)
            this.members.forEach((username) => {
                coroutine.wrap(() => {
                    let id = Players.GetUserIdFromNameAsync(username as string)
                    MessagingService.PublishAsync(`partyUpdate${id}`, {
                        partyId : this.id,
                        leader : this.leader,
                        members : this.members
                    })
                })()
            })
        }
    }
}

export namespace signal {
    let signals = ['hyperChat', 'inviteParty', 'leaveParty', 'kickParty', 'joinParty', 'startGame']
}

export namespace processor {
    export const commands : {[key : string] : (client : Player, input : string) => string | undefined} = {
        kick : (client : Player, input : string) => {
            let values = input.split(" ")
            if (values[0]) {
                Players.GetPlayers().forEach((player) => {
                    if (player.Name.lower() === values[0].lower()) {
                        if (player === client) {
                            return `you may not kick yourself`
                        }
                        else {
                            player.Kick("The party leader has kicked you from the game")
                            return `${values[0]} has been kicked from the game`
                        }
                    }
                })
                return `${values[0]} is not a valid player`
            }
            else {
                return `missing parameter: [player name]`
            }
        }
    }
}

export namespace entities {
    let entities : entity[] = []
    export function entityFromModel(model : Model) : entity | undefined {
        let n
        entities.forEach((value, index) => {
            if (value.object && value.object === model) {
                n = value
            }
        })
        return n
    }
    export function entityFromId(id : string) : entity | undefined {
        let n
        entities.forEach((value) => {
            if (value.id === id) {
                n = value
            }
        })
        return n
    }
    let entityModifiers : string[] = modifiers

    export function entitiesOfModifierInRange(origin : Vector3, range : number, modifiers : string[]) : entity[] {
        let e : entity[] = []
        entities.forEach((value) => {
            let cf = value.object?.GetPrimaryPartCFrame()
            let position = cf?.Position as Vector3
            if (position.sub(origin).Magnitude <= range) {
                modifiers.forEach((mod) => {
                    if (value.modifiers.indexOf(mod) !== -1) {
                        e.push(value)
                        return
                    }
                })
            }
        })
        return e
    }

    export function entitiesWithAfflictionInRange(origin : Vector3, range : number, affliction : string[]) : entity[] {
        let e : entity[] = []
        entities.forEach((value) => {
            let cf = value.object?.GetPrimaryPartCFrame()
            let position = cf?.Position as Vector3
            if (position.sub(origin).Magnitude <= range) {
                affliction.forEach((afl) => {
                    if (value.hasEffect(afl)) {
                        e.push(value)
                        return
                    }
                })
            }
        })
        return e
    }
}

export namespace linter {
    let _keywords = ['inflict', 'remove']
    let _searches = ['first', 'last', 'all']
    let _modifiers = ['permanent', 'for%s+(%d+)']
    let _id = "to%s+([%d?%a?]+)"
    let _level = "@%s+(%d+)"
    //example: inflict 
    export function lintEffects(parse : string) {
        let keyword : string = ""
        let search : string = "*NOSEARCH"
        let modifier : any = ""
        let effect : string = ""
        let level : number = (tonumber(parse.match(_level)[0]) as number) || 0
        let id : any = parse.match(_id)[0]
        for (let [index] of pairs(debuffs)) {
            if (parse.find(tostring(index))[0]) {
                effect = tostring(index)
            }
        }
        _keywords.forEach((value) => {
            if (parse.find(value)[0]) {
                keyword = value
                return
            }
        })
        _searches.forEach((value) => {
            if (parse.find(value)[0]) {
                search = value
                return
            }
        })
        _modifiers.forEach((value) => {
            if (parse.find(value)) {
                let v = parse.match(value)[0]
                if (v) {
                    modifier = v
                    return
                }
            }
        })
        if (keyword === "inflict") {
            let y = entities.entityFromId(id)
            if (y) {
                let n = new debuffs[effect](y, level)
            }
            else {
                console.raise(`id ${id} does not match a known entity`)
            }
        }
        print(keyword, effect, search, modifier, id)
    }
}