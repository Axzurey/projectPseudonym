export interface schemaparams {
    required?: boolean
    unique?: boolean
    type: "Color3" | "Vector3" | "Vector2" | "UDim" | "UDim2" | "BrickColor" | "CFrame" |
     "string" | "boolean" | "number" | "dictionary" | "array"
}

export class schema {
    params: {[key: string]: schemaparams}
    constructor(params: {[key: string]: schemaparams}) {
        this.params = params
    }
}