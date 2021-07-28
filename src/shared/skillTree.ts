import { ReplicatedStorage, StarterGui } from "@rbxts/services";

type xyn = {
    description : "Reduce equip time by 5%",
    unlocks : {
        level : number,
        name : string
    }[],
    levels : {[name : number] : {
        [name : string] : {
            points : number,
            requires : string[]
        }
    }},
    base? : boolean | undefined
}

export function calculateNodes(client : Player) {
    let clientUi = client.WaitForChild("PlayerGui")
    let main = clientUi
        .WaitForChild("main")
        .WaitForChild("menu")
        .WaitForChild("mainframe")
    let _tree = main.WaitForChild("skills")
    let _branch = ReplicatedStorage.guiAssets.branch
    let _node = ReplicatedStorage.guiAssets.node
    let nodes : {[name : string] : Instance} = {}
    
    tree.forEach((value : xyn, key : string) => {
        nodes[key] = _node.WaitForChild(key)
    })
}

let tree : Map<any, any> = new Map()
tree.set("Quick Draw", {
    base : true,
    description : "Reduce equip time by 5%",
    unlocks : [
        {
            level : 1,
            name : "Steady Hands"
        }
    ],
    levels : {
        [1] : {
            points : 3,
            required : []
        },
        [2] : {
            points : 3,
            required : []
        },
    },
})
tree.set("Steady Hands", {
    description : "Increase accuracy by 10%",
    unlocks : [
        {
            level : 1,
            name : "Agility"
        }
    ],
    levels : {
        [1] : {
            points : 3,
            required : [
                "Quick Draw"
            ]
        },
        [2] : {
            points : 3,
            required : [
                "Quick Draw"
            ]
        },
    },
})
tree.set("Agility", {
    description : "Increase agility by 5%",
    levels : {
        [1] : {
            points : 3,
            required : [
                "Steady Hands"
            ]
        },
        [2] : {
            points : 3,
            required : [
                "Quick Draw"
            ]
        },
    },
})
tree.set("Taboo", {
    base : true,
    description : "Chance to apply curse effect[-5% Max Health][stackable] when attacking [humanoid] enemies",
    unlocks : [
        {
            level : 1,
            name : "Vampirism"
        }
    ],
    levels : {
        [1] : {
            points : 3,
            required : []
        },
        [2] : {
            points : 3,
            required : []
        },
    },
})
tree.set("Dark Arts", {
    base : true,
    description : "Chance to inflict curse effect[-10% Attack Damage and -10% Agility][stackable]",
    unlocks : [
        {
            level : 1,
            name : "Vampirism"
        }
    ],
    levels : {
        [1] : {
            points : 3,
            required : []
        },
        [2] : {
            points : 3,
            required : []
        },
    },
})
tree.set("Vampirism", {
    levels : {
        [1] : {
            points : 3,
            required : []
        },
        [2] : {
            points : 3,
            required : []
        },
    },
    description : "Chance to apply regeneration[+0.5% Health][stackable] for 30 seconds when killing [living] enemies",
})