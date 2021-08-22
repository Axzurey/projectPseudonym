import { ReplicatedStorage } from "@rbxts/services"
import { baseMelee, meleeConstructor } from "server/game/items"
import { console } from "shared/pkg/quark"

export default class main extends baseMelee {
    constructor(client : Player, objectData : meleeConstructor) {
        super(client, objectData)
        this.object = ReplicatedStorage.FindFirstChild("itemModels")?.FindFirstChild("Raiden")?.Clone() as Model
        this.object.Parent = client.Character
        this.name = script.Name
        this.loadMotors()
        this.loadEvents()
        this.finishLoad()
    }
}