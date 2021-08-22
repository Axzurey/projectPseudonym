import { console } from "./pkg/quark"

export namespace skills {
    export function requirementParser(requirements : string[]) {
        let greater = "(%a+) (%&%+)"
        for (let i=0; i < requirements.size(); i++) {
            let req = requirements[i]
            for (const value of string.gmatch(req, greater)) {
                console.log(value)
            }
        }
        
    }
    let skillTree = {
        ["Quick Draw"] : {
            levels : {
                [1] : {
                    points : 3,
                    requires : [
                        'level &+ 3'
                    ]
                }
            }
        }
    }
}