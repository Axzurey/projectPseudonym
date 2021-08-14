import {Workspace, ReplicatedStorage, ServerScriptService, ServerStorage, RunService, Players} from '@rbxts/services'
import {remoteService} from 'shared/services'
import {entities, linter, channel, effects, projectile, workbench} from 'server/runtime'
import { console } from 'shared/quark'
import { clientEntity } from './game/client'

remoteService.load()

let clientData : {[key : string] : any} = {}

effects.createFireFlies(100)

remoteService.listenAsync('@client.requestLoadout', (client : Player) => {
    console.log("data requested for: ", client.Name)
    return clientData[client.Name]
}) 

remoteService.listenAsync('itemEquip', (client : Player, slot : string) => {
    let module = clientData[client.Name].module as clientEntity
    module.equipItem(slot)
})

remoteService.listenAsync("itemButton1", (client : Player) => {
    console.log("used item!")
    let n = clientData[client.Name].module as clientEntity
    n.useItem()
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
            {
                name : 'Raiden',
                color : 'blue',
                damage : 44,
                attackSpeed : .55,
                modifiers : [
                    'mechanical'
                ],
                originalOwner : 0, //the userid of the player to first own the item
                killsWith : 23,
                experience : 34, //a function that converts experience to level ;)
            }
        ],
        module : new clientEntity(client),
        hotbar : {
            slot1 : {
                index : 0
            }
        }
    }
    clientData[client.Name] = cdata
})

Players.PlayerRemoving.Connect((client : Player) => {

})