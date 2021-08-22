import { entity } from "server/entities"
import { channel } from "server/runtime"
import { baseMelee, baseGun, meleeConstructor, gunConstructor } from "./items"
import {items} from './itemJoint'


export class clientEntity extends entity {
    client : Player
    equippedItem : baseMelee | baseGun | undefined
    constructor(client : Player) {
        super()
        this.client = client
        this.id = client.UserId
        this.health = 100
        this.maxHealth = 100
        this.object = client.Character
        this.events.newCharacter = client.CharacterAdded.Connect((character) => {
            this.object = character
            this.rootPart = character.WaitForChild("HumanoidRootPart") as BasePart
            this.humanoid = character.WaitForChild("Humanoid") as Humanoid
        })
        let character = client.Character
        this.object = character
        this.rootPart = character?.WaitForChild("HumanoidRootPart") as BasePart
        this.humanoid = character?.WaitForChild("Humanoid") as Humanoid
    }
    unequipItem() {
        if (this.equippedItem) {
            this.equippedItem.destroy()
        }
    }
    useItem(...args: unknown[]) {
        if (this.equippedItem) {
            this.equippedItem.activate(args)
        }
    }
    async equipItem(slot : string) {
        this.unequipItem()

        let data = await channel.requestAsync('getDataForUsername', this.client.Name) as {inventory : [], hotbar : {[key : string] : any}}
        let hotbar = data.hotbar
        let inventory = data.inventory
        let item = hotbar[slot] as {name: string}

        let object = items[item.name as keyof typeof items]

        let _module = new object(this.client, item as unknown as meleeConstructor & gunConstructor)
        this.equippedItem = _module
    }
}