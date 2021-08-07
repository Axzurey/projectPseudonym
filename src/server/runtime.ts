import { Players, MessagingService, DataStoreService } from "@rbxts/services"
import { entity, debuff, debuffs } from "server/entities"
import { console } from "shared/quark"
import { modifiers } from "./modifiers"

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