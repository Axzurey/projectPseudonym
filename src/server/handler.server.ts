import {Workspace, ReplicatedStorage, ServerScriptService, ServerStorage, RunService, Players} from '@rbxts/services'
import {user} from './datastore'
import { inventoryItem} from "./dataTypes"
import {clientModule} from './dataModules'

let databaseInventory : user = new user("main")
let clientData : Map<String, clientModule> = new Map()

let getData = function (client : Player) {
    let l : inventoryItem[] | any = databaseInventory.getAsync(client.UserId)
    return l
}

let playerAdded = function(client : Player) {
    let data : any = databaseInventory.getAsync(client.UserId)
    clientData.set(client.Name, new clientModule(client, getData))
}

let playerLeaving = function(client : Player) {
    print("leaving triggered")
    let save : inventoryItem[] = [
        {
            name : "cookie slasher"
        },
        {
            name : "man person",
            ammo : 34,
        }
    ]
    databaseInventory.setAsync(client.UserId, save)
    print("my mans left")
}

game.BindToClose(() => {
    for (let client of Players.GetPlayers()) {
        coroutine.wrap(() => {
            print("binding to close for client")
            playerLeaving(client)
        })()
    }
})
Players.PlayerAdded.Connect(playerAdded)
if (!RunService.IsStudio()) {
    Players.PlayerRemoving.Connect(playerLeaving)
}
