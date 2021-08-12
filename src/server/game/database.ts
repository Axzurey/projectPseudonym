export interface baseItem {
    amount : number
    timeAcquired : number
    originalOwner : number
    name : string
    rarity : number
}

export interface baseFluid {
    toxic : boolean
}

export interface craftItem {
    
}

export interface modifiable {
    modifiers : {
        name : string,
        level : number,
        isBase : boolean
    }[]
}

export interface multiColored {
    color : {r : number, b : number, g : number}
}

export interface fluidContainer extends baseItem {
    fluid: string
    maximumFluidAmount : number
    fluidAmount : number
}

export interface baseGun extends baseItem {
    ammo : number
    maxAmmo : number
    reloadtime : number
    weight : number
}

//specific items

export interface battery extends baseItem, craftItem {
    maximumCharge : number
    charge : number
}

//specific fluids

export interface spinalFluid extends baseFluid, craftItem {
    
}