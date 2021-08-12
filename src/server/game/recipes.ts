export const recipes : {[key : string] : {[key : string] : any}} = {
    ["Dry Cell Battery"] : {
        ["amount"] : 1,
        ["materials"] : {
            ["Zinc"] : {
                amount : 1
            },
            ["Carbon"] : {
                amount : 1
            },
            ["Sulfuric Acid"] : {
                amount : 40
            },
            ["Distilled Water"] : {
                amount : 10
            }
        }
    },
    ["Plastic Jug"] : {
        ["amount"] : 1,
        ["materials"] : {
            ["HDPE"] : 5
        }
    },
    ["EM Ghost"] : {
        ["amount"] : 1,
        ["materials"] : {
            ["Dry Cell Battery"] : {
                amount : 4
            }
        },
        ["byproducts"] : {}
    }
}

export const charging : {[key : string] : {[key : string] : any}} = { //unit is SR, progresses: SR, KSR, GSR
    ["Dry Cell Battery"] : {
        processRate : 150
    },
    ["EM Ghost"] : {
        processRate : 250
    }
}

export const extraction : {[key : string] : any} = { //liquid product is in PERCENTAGE of input in cases where the input is also a liquid
    ["Distilled Water"] : {
        process : "Distilling",
        products : {
            ["Distilled Water"] : {
                amount : 85
            }
        },
        processRate : 200, //amount a minute(for liquid this is in ml)
    }
}