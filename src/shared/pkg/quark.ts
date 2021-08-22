export namespace stringf {
    export function camelCase(str: string): string {
        let c = string.split(str, ' ')
        let out : string[] = []
        c.forEach((s, i) => {
            if (i === 0) {
                let ch = s.sub(1, 1)
                let r = s.sub(2)
                out.push(ch.upper() + r)
            }
            else {
                out.push(s)
            }
        })
        return out.join(' ')
    }
    export function pascalCase(str: string): string {
        let c = string.split(str, ' ')
        let out : string[] = []
        c.forEach((s, i) => {
            let ch = s.sub(1, 1)
            let r = s.sub(2)
            out.push(ch.upper() + r)
        })
        return out.join(' ')
    }
}

export namespace console {

    type cb = {
        callback : (s : string) => any,
        once : boolean
    }

    let _events : {[key : string] : cb[]} = {
        stdout : []
    }
    
    export function on(event : string, callback : any) {
        let lm = {
            callback : callback,
            once : false
        }
        if (_events.stdout) {
            _events.stdout.push(lm)
        }
    }
    let _stdout = function(s : string) {
        _events.stdout.forEach((value, index) => {
            coroutine.wrap(() => {
                value.callback(s)
            })()
        })
    }
    export function raise(...parameters : any[]) {
        let tp : any[] = []
        parameters.forEach((value, index) => {
            if (type(value) === "string" || type(value) === "number" || type(value) === "boolean") {
                tp.push(value)
            }
            else if (type(value) === "nil") {
                tp.push('nil')
            }
            else if (typeOf(value) === "Instance") {
                tp.push((value as Instance).Name as string)
            }
            else if (typeOf(value) === "function") {
                tp.push(tostring(value))
            }
            else {
                tp.push(value)
            }
        })
        let embed = false
        for (let i=0; i < 5; i++) {
            let z = debug.info(i, "f")
            _events.stdout.forEach((value) => {
                if (value.callback === z[0]) {
                    embed = true
                }
            })
        }
        if (!embed) {
            _stdout(tp.join(' '))
        }
        error(tp.join(' '))
    }
    export function log(...parameters : any[]) {
        let tp : any[] = []
        parameters.forEach((value, index) => {
            if (type(value) === "string" || type(value) === "number" || type(value) === "boolean") {
                tp.push(value)
            }
            else if (type(value) === "nil") {
                tp.push('nil')
            }
            else if (typeOf(value) === "Instance") {
                tp.push((value as Instance).Name as string)
            }
            else if (typeOf(value) === "function") {
                tp.push(tostring(value))
            }
            else {
                tp.push(value)
            }
        })
        print(tp.join(' '))
        let embed = false
        for (let i=0; i < 5; i++) {
            let z = debug.info(i, "f")
            _events.stdout.forEach((value) => {
                if (value.callback === z[0]) {
                    embed = true
                }
            })
        }
        if (!embed) {
            _stdout(tp.join(' '))
        }
    }
}

export namespace gamef {
    export function partToRegion3(part : BasePart) : Region3 {
        let abs = math.abs

        let size = part.Size
        let cframe = part.CFrame

        let sx = size.X
        let sy = size.Y
        let sz = size.Z

        let components = cframe.GetComponents()
        let x = components[0]
        let y = components[1]
        let z = components[2]

        let r00 = components[3]
        let r01 = components[4]
        let r02 = components[5]

        let r10 = components[6]
        let r11 = components[7]
        let r12 = components[8]

        let r20 = components[9]
        let r21 = components[10]
        let r22 = components[11]
        //let x, y, z, R00, R01, R02, R10, R11, R12, R20, R21, R22 = cframe.GetComponents()
    
        let wsx = 0.5 * (abs(r00) * sx + abs(r01) * sy + abs(r02) * sz)
	    let wsy = 0.5 * (abs(r10) * sx + abs(r11) * sy + abs(r12) * sz)
	    let wsz = 0.5 * (abs(r20) * sx + abs(r21) * sy + abs(r22) * sz)

        let minx = x - wsx
        let miny = y - wsy
        let minz = z - wsz

        let maxx = x + wsx
        let maxy = y + wsy
        let maxz = z + wsz

        let minv = new Vector3(minx, miny, minz)
        let maxv = new Vector3(maxx, maxy, maxz)
	    return new Region3(minv, maxv)
    }
}