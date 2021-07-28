import { Players } from "@rbxts/services"
import {calculateNodes} from 'shared/skillTree'

let client = Players.LocalPlayer
calculateNodes(client)