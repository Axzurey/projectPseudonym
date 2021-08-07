export namespace itemDEU {
    let items : {[key : string] : {[key : string] : any}} = {

    }
    export function baseDataFromName(name : string) : {[key : string] : any} {
        if (items[name]) {
            return items[name]
        }
        else {
            throw `unable to find item: ${name} in database`
        }
    }
}