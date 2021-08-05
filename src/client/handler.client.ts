import { ReplicatedStorage, Players } from "@rbxts/services"
import {framework} from "shared/game/framework"

let _framework : framework

let client = Players.LocalPlayer
let characterAdded = function(char : Model) {
    _framework = new framework()
}

if (client.Character) {
    characterAdded(client.Character)
}
client.CharacterAdded.Connect(characterAdded)
