import { RunService, Workspace } from "@rbxts/services"
import { console } from "./quark"

let ScaleToOffset = function(Scale : number[]) {
	let ViewPortSize = Workspace.Camera.ViewportSize
	return [ViewPortSize.X * Scale[0], ViewPortSize.Y * Scale[1]]
}


let OffsetToScale = function(Offset : number[]) {
	let ViewPortSize = Workspace.Camera.ViewportSize
	return [Offset[0] / ViewPortSize.X, Offset[1] / ViewPortSize.Y]
}

export type constructorParams = {
    x? : number | string
    y? : number | string
    w? : number | string
    h? : number | string
    isClient? : boolean
    client? : Player
    parent? : ScreenGui
}

type schemaProperties = 'backgroundColor' | 'primaryColor' | 'borderColor' | 'font' | 'corner' | 'transparency'
| 'borderMode' | 'borderSize' | 'rotation' | 'selectable' | 'zindex' | 'textTransparency' | 'secondaryColor'

export type schemaParams = Map<schemaProperties, any>

export class schema {
    objects : schemaParams = new Map<schemaProperties, any>()
    constructor(params : {[key : string] : any}) {
        this.objects.set('backgroundColor', new Color3(1, 1, 1))
        this.objects.set('primaryColor', new Color3(0, 0, 0))
        this.objects.set('borderColor', new Color3(1, 1, 1))
        this.objects.set('font', Enum.Font.SourceSans)
        this.objects.set('corner', 0)
        this.objects.set('transparency', 0)
        this.objects.set('textTransparency', 0)
        this.objects.set('borderMode', Enum.BorderMode.Outline)
        this.objects.set('borderSize', 1)
        this.objects.set('rotation', 0)
        this.objects.set('selectable', false)
        this.objects.set('zindex', 1)
        this.objects.set('secondaryColor', Color3.fromRGB(128, 128, 128))
        for (const[key, value] of pairs(params)) {
            let i = key as unknown as schemaProperties
            this.objects.set(i, value)
        }
    }
}

/*
    .../---Components---\...
*/

export class window {
    x : number | string
    y : number | string
    w : number | string
    h : number | string
    isClient : boolean
    client : Player | undefined
    parent : ScreenGui

    scheme : schema | undefined | null

    instances : {
        base : Frame | undefined,
    } = {
        base : undefined
    }

    cornerInstace : UICorner = new Instance("UICorner")

    private connections : {[key : string] : RBXScriptConnection} = {}

    constructor(buildParams : constructorParams, scheme : schema | undefined | null) {
        this.x = buildParams.x || 0
        this.y = buildParams.y || 0
        this.w = buildParams.w || 200
        this.h = buildParams.h || 150
        this.client = buildParams.client || undefined
        this.isClient = buildParams.isClient || true
        this.instances.base = new Instance("Frame")
        this.scheme = scheme
        this.parent = buildParams.parent || new Instance("ScreenGui")
        if (!buildParams.parent) {
            if (this.client) {
                this.parent.Parent = this.client.FindFirstChild("PlayerGui")
            }
            else {
                console.raise("Unable to find a suitable parent for this node")
            }
        }
        this.connections.render = RunService.Stepped.Connect((deltaTime) => this.update(deltaTime))
    }
    private extractNum(input : string) : number {
        let n = string.match(input, "[%d%.]+") as number
        return tonumber(n) as number
    }
    private isScale(input : string) : boolean {
        let n = string.find(input, "%%")[0]
        if (n && type(n) === "number") {
            return true
        }
        else {
            return false
        }
    }
    public destroy() {
        for (const [_, value] of pairs(this.connections)) {
            value.Disconnect()
        }
        if (this.instances.base) {
            this.instances.base.Destroy()
        }
    }
    private update(deltaTime : number) {
        let x : string | number = 0
        let y : string | number = 0
        let w : string | number = 0
        let h : string | number = 0
        let x2 : boolean = false
        let y2 : boolean = false
        let w2 : boolean = false
        let h2 : boolean = false
        if (type(this.x) === "string") {
            let iS = this.isScale(tostring(this.x))
            let value = this.extractNum(tostring(this.x))
            x = value
            if (iS) {
                x = value / 100
                x2 = true
            }
        }
        else if(type(this.x) === "number") {
            x = this.x
        }
        if (type(this.y) === "string") {
            let iS = this.isScale(tostring(this.y))
            let value = this.extractNum(tostring(this.y))
            y = value
            if (iS) {
                y = value / 100
                y2 = true
            }
        }
        else if(type(this.y) === "number") {
            y = this.y
        }
        if (type(this.w) === "string") {
            let iS = this.isScale(tostring(this.w))
            let value = this.extractNum(tostring(this.w))
            w = value
            if (iS) {
                w = value / 100
                w2 = true
            }
        }
        else if(type(this.w) === "number") {
            w = this.w
        }
        if (type(this.h) === "string") {
            let iS = this.isScale(tostring(this.h))
            let value = this.extractNum(tostring(this.h))
            h = value
            if (iS) {
                h = value / 100
                h2 = true
            }
        }
        else if(type(this.h) === "number") {
            h = this.h
        }

        let x0 = tonumber(x)
        let y0 = tonumber(y)
        let w0 = tonumber(w)
        let h0 = tonumber(h)
        if (this.instances.base) {
            if (this.instances.base.Parent !== this.parent) {
                this.instances.base.Parent = this.parent
            }
            if (x0 && y0) {
                let c = x2 ? [x0, 0] : [0, x0]
                let z = y2 ? [y0, 0] : [0, y0]
                let a0 = c[0]
                let a1 = c[1]
                let a2 = z[0]
                let a3 = z[1]
                this.instances.base.Position = new UDim2(a0, a1, a2, a3)
            }
            if (h0 && w0) {
                let c = w2 ? [w0, 0] : [0, w0]
                let z = h2 ? [h0, 0] : [0, h0]
                let a0 = c[0]
                let a1 = c[1]
                let a2 = z[0]
                let a3 = z[1]
                this.instances.base.Size = new UDim2(a0, a1, a2, a3)
            }
        }
        if (this.scheme && this.instances.base) {
            this.instances.base.BackgroundColor3 = this.scheme.objects.get("backgroundColor")
            this.instances.base.BackgroundTransparency = this.scheme.objects.get("transparency")
            this.instances.base.BorderColor3 = this.scheme.objects.get("borderColor")
            this.instances.base.BorderSizePixel = this.scheme.objects.get("borderSize")
            this.instances.base.BorderMode = this.scheme.objects.get("borderMode")
            this.instances.base.Rotation = this.scheme.objects.get("rotation")
            this.instances.base.Selectable = this.scheme.objects.get("selectable")
            this.instances.base.ZIndex = this.scheme.objects.get("zindex")
            //this.instances.base.font = this.scheme.objects.get("font")
            //this.instances.base.Transparency = this.scheme.objects.get("textTransparency")
            //this.instances.base.TextColor = this.scheme.objects.get("textColor")
            let corner = this.scheme.objects.get("corner")
            if (this.cornerInstace) {

            }
            else {
                this.cornerInstace = new Instance("UICorner")
            }
            this.cornerInstace.CornerRadius = new UDim(corner, 0)
        }
    }
}