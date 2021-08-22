import {Workspace, ReplicatedStorage, ServerScriptService, ServerStorage, RunService, Players} from '@rbxts/services'
import {remoteService} from 'shared/services'
import {entities, linter, channel, effects, projectile, workbench, touch} from 'server/runtime'
import { console } from 'shared/pkg/quark'
import { clientEntity } from './game/client'
import {textures} from 'shared/pkg/textures'
import {allSkills} from 'server/game/skillJoint'
import {allAgents} from 'server/game/agentJoint'
import { baseSkill } from './game/base'

remoteService.load()

let clientData : {[key : string] : any} = {}

let newI = new touch.staticWorldIcon({
    cframe : new CFrame(0, 50, 0),
    texture : textures["mushi.world.icon"]
})

remoteService.listenAsync('@client.requestLoadout', (client : Player) => {
    console.log("data requested for: ", client.Name)
    return clientData[client.Name]
})

remoteService.listenAsync('@skill.activate', (client : Player, ...args : unknown[]) => {
    let skill = clientData[client.Name].loadedSkill
    if (skill) {
        skill.activate(...args)
    }
    else {
        console.log("activate: skill is not valid")
    }
})

remoteService.listenAsync('@skill.activate', (client:Player) => {
    if (clientData[client.Name].loadedSkill) {
        let l = clientData[client.Name].loadedSkill as baseSkill
        return l.activate()
    } 
    else {
        console.log("skill not loaded")
    }
})

remoteService.listenAsync('@skill.getName', (client : Player, slot : number) => {
    let agentName = clientData[client.Name].hotbar.agent
    print(agentName)
    let agentClass = allAgents[agentName as keyof typeof allAgents]
    let skills = new agentClass().skills
    let skill = skills[('skill' + slot) as keyof typeof skills]
    if (skill) {
        return skill
    }
    else {
        console.log("getname: skill is not valid")
    }
})

remoteService.listenAsync('@skill.load', (client : Player, slot : number) => {
    let agentName = clientData[client.Name].hotbar.agent
    let agentClass = allAgents[agentName as keyof typeof allAgents]
    let skills = new agentClass().skills
    let skill = skills[('skill' + slot) as keyof typeof skills]
    print(slot)
    if (skill) {
        let currentagent = clientData[client.Name].agent as string
        let sk = new allSkills[skill.name as keyof typeof allSkills](client, 
            clientData[client.Name].agents[currentagent].skillData[slot].level)
        clientData[client.Name].loadedSkill = sk
        console.log("loaded skill successfully")
    }
    else {
        console.log("can not load skill, invalid.")
    }
})

remoteService.listenAsync('@skill.requestObject', (client : Player, slot : number) => {
    if (clientData[client.Name].loadedSkill) {
        let l = clientData[client.Name].loadedSkill as baseSkill
        return l.instanceRequest()
    } 
    else {
        console.log("skill not loaded")
    }
})

remoteService.listenAsync('item.drop', (client: Player) => {
    let module = clientData[client.Name].module as clientEntity
    module.unequipItem()
})

remoteService.listenAsync('itemEquip', (client : Player, slot : string) => {
    let module = clientData[client.Name].module as clientEntity
    module.equipItem(slot)
})

remoteService.listenAsync("itemButton1", (client : Player, ...args: unknown[]) => {
    console.log("used item!")
    let n = clientData[client.Name].module as clientEntity
    n.useItem(args)
})

//linter.lintEffects('inflict corrosion @3 for 10 to baxza5b3')

channel.channel('getDataForUsername', (user : unknown) => {
    console.log("data invoked")
    print(user as string, clientData, clientData[user as string])
    return clientData[user as string]
})

Players.PlayerAdded.Connect((client : Player) => {
    let cdata = {
        inventory : [
            
        ],
        agents : {
            ["Morgan"] : {
                level : 12,
                skillData : {
                    [1] : {
                        level : 3
                    }
                }
            }
        },
        cooldowns : {},
        loadedSkill : undefined,
        module : new clientEntity(client),
        hotbar : {
            agent : 'Morgan',
            slot1 : {
                name : 'Raiden',
                color : 'blue',
                damage : 44,
                attackSpeed : 1.1,
                modifiers : [
                    'mechanical'
                ],
                originalOwner : 0, //the userid of the player to first own the item
                killsWith : 23,
                experience : 34, //a function that converts experience to level ;)
            },
            slot2: {
                name: 'Basic Shotgun',
                color: 'blue',
                damage: 12,
                firerate: 75,
                modifiers : [
                    'mechanical'
                ],
                originalOwner : 0, //the userid of the player to first own the item
                killsWith : 75,
                experience : 12, //a function that converts experience to level ;)
            }
        }
    }
    clientData[client.Name] = cdata
})

Players.PlayerRemoving.Connect((client : Player) => {

})