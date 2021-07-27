import {clientModule, inventory} from 'server/dataModules'
export type clientData = {
    client : Player | undefined,
    level : Number | undefined,
    experience : Number | undefined,
    module : clientModule | undefined,
    inventory : inventory | undefined
}

export type inventoryItem = {
    name : String,
    timeEarned? : Number,
    originalOwner? : Number,
    amount? : Number,
    ammo? : Number,
    modifiers? : [any : {
        timeEarned : Number,
        level : Number
    }]
}