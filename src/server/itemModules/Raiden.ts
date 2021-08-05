import { ReplicatedStorage } from "@rbxts/services"
import { baseMelee, meleeConstructor } from "server/items"

export class main extends baseMelee {
    constructor(client : Player, objectData : meleeConstructor) {
        super(client, objectData)
        this.object = ReplicatedStorage.FindFirstChild("itemModels")?.FindFirstChild("Raiden") as Model
        this.name = script.Name
        this.loadEvents()
        this.loadMotors()
        this.finishLoad()
    }
}