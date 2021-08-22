import { console } from "shared/pkg/quark"

const serializations = {
    "CFrame": function(cf: CFrame) {
        return ["CFrame", ...cf.GetComponents()]
    },
    "Vector3": function(v3: Vector3) {
        return ["Vector3", v3.X, v3.Y, v3.Z]
    },
    "Vector2": function(v2: Vector2) {
        return ["Vector2", v2.X, v2.Y]
    },
    "Color3": function(c: Color3) {
        return ["Color3", c.R, c.G, c.B]
    },
    "UDim": function(u: UDim) {
        return ["UDim", u.Scale, u.Offset]
    },
    "UDim2": function(u2: UDim2) {
        return ["UDim2", u2.X.Scale, u2.X.Offset, u2.Y.Scale, u2.Y.Offset]
    },
    "Enum": function(e: Enum) {
        return ["Enum", tostring(e).gsub("Enum.", "")]
    }
}

const deserializations = {
    "CFrame": function(cf: [number, number, number, number, number, number, number, number, number, number, number, number]) {
        return new CFrame(...cf)
    },
    "Vector3": function(v3: number[]) {
        return new Vector3(v3[0], v3[1], v3[2])
    },
    "Vector2": function(v2: number[]) {
        return new Vector2(v2[0], v2[1])
    },
    "Color3": function(c: number[]) {
        return new Color3(c[0], c[1], c[2])
    },
    "UDim": function(u: number[]) {
        return new UDim(u[0], u[1])
    },
    "UDim2": function(u2: number[]) {
        return new UDim2(u2[0], u2[1], u2[3], u2[4])
    }
}

function inser(v: any): boolean {
    for (const [i, val] of pairs(serializations)) {
        if (i === (typeOf(v) as keyof typeof serializations)) {
            return true
        }
    }
    return false
}

function deinser(v: string): boolean {
    for (const [i, val] of pairs(deserializations)) {
        if (i === v) {
            return true
        }
    }
    return false
}

function iterate(t: {[key: string] : any}) {
    for (const [index, value] of pairs(t)) {
        if (inser(value)) {
            t[index as string] = serializations[typeOf(value) as keyof typeof serializations](value as any)
        }
        else if (typeOf(value) === "table") {
          t[index as string] = iterate(value)
        }
        else {
            throw `unable to serialize instances of type ${typeOf(value)}`
        }
    }
    return t
}

type destype = [number, number, number, number, number, number, number, number, number, number, number, number] & number[] & number

function deiterate(t: {[key: string] : any}) {
    for (const [index, value] of pairs(t)) {
        let typ = (value as any[])[0]
        let val = value as any[]
        if (deinser(typ as unknown as string)) {
            val.shift()
            let v = deserializations[typ as keyof typeof deserializations](val as destype)
            t[index as string] = v
        }
        else if (typeOf(typ) === "table") {
            t[index as string] = deiterate(val)
        }
        else {
            throw `unable to deserialize instance of type: ${typ}`
        }
    }
    return t
}

export function serialize(t: {[key: string]: any}) {
    return iterate(t)
}

export function deserialize(t: {[key: string]: any}) {
    return deiterate(t)
}