import {Workspace, ReplicatedStorage, ServerScriptService, ServerStorage, RunService, Players} from '@rbxts/services'

import {entities, observer, linter} from 'server/runtime'
import { console } from 'shared/quark'

observer.hook('get', ReplicatedStorage.FindFirstChild("remotes")?.FindFirstChild("get") as RemoteEvent)

let clientData : {[key : string] : any} = {}

observer.watch('get', (client : Player) => {
    
})

linter.lintEffects('inflict corrosion for 10 to baxza5b3')

Players.PlayerAdded.Connect((client : Player) => {
    clientData[client.Name] = {
        inventory : {},
        module : undefined,
        hotbar : {}
    }
})

Players.PlayerRemoving.Connect((client : Player) => {

})