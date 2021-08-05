import { ReplicatedStorage } from "@rbxts/services"

export namespace relPack {
    let packs = [
        'bronze', 'silver', 'gold', 'platinum', ''
    ]
    let packDropsChances = {
        bronze : {
            [1] : 55,
            [2] : 31,
            [3] : 11,
            [4] : 3,
            [5] : undefined
        },
        silver : {
            [1] : 40,
            [2] : 30,
            [3] : 20,
            [4] : 9,
            [5] : 1
        },
        gold : {
            [1] : 20,
            [2] : 25,
            [3] : 35,
            [4] : 15,
            [5] : 5
        },
        platinum : {
            [1] : 10,
            [2] : 18,
            [3] : 30,
            [4] : 40,
            [5] : 12
        },
        breaker : {
            [1] : undefined,
            [2] : undefined,
            [3] : undefined,
            [4] : undefined,
            [5] : 100
        }
    }
    type packtype = 'bronze' | 'silver' | 'gold' | 'platinum' | 'breaker'
    function pickRarity(pack : packtype) {
        let arr = []
        for (const [index, value] of pairs(packDropsChances[pack])) {
            for (let i=0; i < value; i++) {
                arr.push(index)
            }
        }
        let pick = math.random(arr.size())
        return arr[pick]
    }
      
    export function roll(packtype : packtype) {
        let rarity = pickRarity(packtype)
        
    }
}

export function dropItem() {
    
}