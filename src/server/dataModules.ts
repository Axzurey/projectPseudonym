import { inventoryItem, clientData} from "./dataTypes"

export class clientModule {
    data : clientData = {
        client : undefined,
        level : 0,
        experience : 0,
        module : undefined,
        inventory : undefined
    }
    constructor(client : Player, getData : (client : Player) => inventoryItem[]) {
        this.data.inventory = new inventory()
        print(getData(client))
        this.data.inventory.loadItems(getData(client))
        this.data.client = client
        print(this.data.inventory.content)
    }
}

interface modifier {
    name : string,
    level : number
}

interface itemPickConfig {
    name : string,
    timeEarned? : number,
    originalOwner? : number,
    amount? : number,
    ammo? : number,
    modifiers? : modifier[]
}

export class inventory {
    content : inventoryItem[] = []
    constructor() {
        
    }
    loadItems(items : inventoryItem[]) {
        print(items)
        for (let item of items) {
            let n : inventoryItem = {
                name : item.name,
                timeEarned : item.timeEarned,
                originalOwner : item.originalOwner,
                amount : item.amount,
                ammo : item.ammo,
                modifiers : item.modifiers
            }
            this.content.push(n)
        }
    }
    removeItem(itemdata : itemPickConfig) {
        
    }
}