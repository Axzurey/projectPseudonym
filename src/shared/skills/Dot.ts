export class main {
    rangeDamping : number = 1
    baseDamage : number = 100
    range : number = 30
    levelMultiplier : number = 5
    description = ""
    clientData : {}
    client : Player
    constructor(client : Player, clientData : {key : any}) {
        this.client = client
        this.clientData = clientData
    }
}