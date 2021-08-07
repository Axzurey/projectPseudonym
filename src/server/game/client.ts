import { entity } from "server/entities"
import { channel } from "server/runtime"
import { baseMelee } from "./items"


export class clientEntity extends entity {
    client : Player
    equippedItem : baseMelee | undefined
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
    useItem() {
        if (this.equippedItem) {
            this.equippedItem.attack()
        }
    }
    async equipItem(slot : string) {
        this.unequipItem()

        let data = await channel.requestAsync('getDataForUsername', this.client.Name) as {inventory : [], hotbar : {[key : string] : {
            index : number
        }}}
        let hotbar = data.hotbar
        let inventory = data.inventory
        let index = hotbar[slot].index
        let item = inventory[index]

        let object = await import('server/itemModules/Raiden')

        let _module = new object.main(this.client, item)
        this.equippedItem = _module
    }
}