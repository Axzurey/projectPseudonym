import { console } from "shared/pkg/quark"
import tulip from "./tulip/init"

console.log("tulip..")

let schema = new tulip.schema({
    currentCFrame: {
        type: "CFrame"
    },
    players: {
        type: "number"
    },
    inventory: {
        type: "dictionary"
    }
})

let database = new tulip.leaf('@testds.test.first', schema)
database.testCreate()