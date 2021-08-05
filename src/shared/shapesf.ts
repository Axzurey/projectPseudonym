export function sphere(count : number) : Vector3[] {
    let goldenRatio = 1 + math.sqrt(5) / 4
    let angleIncrement = math.pi * 2 * goldenRatio
    let multiplier = 10

    let points : Vector3[] = []
    for (let i=1; i <= count; i++) {

        let distance = i / count
        let incline = math.acos(1 - 2 * distance)
        let azimuth = angleIncrement * i

        let x = math.sin(incline) * math.cos(azimuth) * multiplier
        let y = math.sin(incline) * math.sin(azimuth) * multiplier
        let z = math.cos(incline) * multiplier

        let point = new Vector3(x, y, z)
        points.push(point)
    }
    return points
}

export function galaxyish(count : number) : Vector3[] {
    let goldenRatio = 1 + math.sqrt(5) / 4
    let angleIncrement = math.pi * 2 * goldenRatio
    let multiplier = 10

    let points : Vector3[] = []
    for (let i=1; i <= count; i++) {

        let distance = i / count
        let incline = math.acos(1 - 2 * distance)
        let azimuth = angleIncrement * i

        let x = math.tan(incline) * math.sin(azimuth) * multiplier
        let y = math.cos(incline) * math.atan(azimuth) * multiplier
        let z = math.tan(incline) * math.tan(incline) * math.cos(azimuth) * multiplier

        let point = new Vector3(x, y, z)
        points.push(point)
    }
    return points
}

export function doubleHelix(count : number) : Vector3[] {
    let goldenRatio = 1 + math.sqrt(5) / 4
    let angleIncrement = math.pi * 2 * goldenRatio
    let multiplier = 10

    let points : Vector3[] = []
    for (let i=1; i <= count; i++) {

        let distance = i / count
        let incline = math.acos(1 - 2 * distance)
        let azimuth = angleIncrement * i

        let x = math.tan(incline) * math.sin(azimuth) * multiplier
        let y = math.cos(incline) * math.tan(azimuth) * multiplier
        let z = math.sin(incline) * multiplier

        let point = new Vector3(x, y, z)
        points.push(point)
    }
    return points
}

export function spiralThrust(count : number) : Vector3[] {
    let goldenRatio = 1 + math.sqrt(5) / 4
    let angleIncrement = math.pi * 2 * goldenRatio
    let multiplier = 10

    let points : Vector3[] = []
    for (let i=1; i <= count; i++) {

        let distance = i / count
        let incline = math.acos(1 - 2 * distance)
        let azimuth = angleIncrement * i

        let x = math.tanh(incline) * math.cos(azimuth) * multiplier
        let y = math.tan(incline) * math.sin(azimuth) * multiplier
        let z = math.sin(incline) * multiplier

        let point = new Vector3(x, y, z)
        points.push(point)
    }
    return points
}

export function spiralThrust4(count : number) : Vector3[] {
    let goldenRatio = 1 + math.sqrt(5) / 4
    let angleIncrement = math.pi * 2 * goldenRatio
    let multiplier = 10

    let points : Vector3[] = []
    for (let i=1; i <= count; i++) {

        let distance = i / count
        let incline = math.acos(1 - 2 * distance)
        let azimuth = angleIncrement * i

        let x = math.cosh(incline) * math.cos(azimuth) * multiplier
        let y = math.tan(incline) * math.sin(azimuth) * multiplier
        let z = math.tanh(incline) * multiplier

        let point = new Vector3(x, y, z)
        points.push(point)
    }
    return points
}

export function phaso(count : number) : Vector3[] {
    let goldenRatio = 1 + math.sqrt(5) / 4
    let angleIncrement = math.pi * 2 * goldenRatio
    let multiplier = 10

    let points : Vector3[] = []
    for (let i=1; i <= count; i++) {

        let distance = i / count
        let incline = math.acos(1 - 2 * distance)
        let azimuth = angleIncrement * i

        let x = math.sinh(incline) * math.cos(azimuth) * multiplier
        let y = math.tanh(incline) * math.sin(azimuth) * multiplier
        let z = math.cosh(incline) * multiplier

        let point = new Vector3(x, y, z)
        points.push(point)
    }
    return points
}

export function spiralL(count : number) : Vector3[] {
    let goldenRatio = 1 + math.sqrt(5) / 4
    let angleIncrement = math.pi * 2 * goldenRatio
    let multiplier = 10

    let points : Vector3[] = []
    for (let i=1; i <= count; i++) {

        let distance = i / count
        let incline = math.acos(1 - 2 * distance)
        let azimuth = angleIncrement * i

        let x = math.sin(incline) * math.cos(azimuth) * multiplier
        let y = math.sin(incline) * math.tan(azimuth) * multiplier
        let z = math.cos(azimuth) * multiplier

        let point = new Vector3(x, y, z)
        points.push(point)
    }
    return points
}

export function defaults(count : number) : Vector3[] {
    let goldenRatio = 1 + math.sqrt(5) / 4
    let angleIncrement = math.pi * 2 * goldenRatio
    let multiplier = 10

    let points : Vector3[] = []
    for (let i=1; i <= count; i++) {

        let distance = i / count
        let incline = math.acos(1 - 2 * distance)
        let azimuth = angleIncrement * i

        let x = math.sin(incline) * math.cos(azimuth) * multiplier
        let y = math.sin(incline) * math.tan(azimuth) * multiplier
        let z = math.cos(azimuth) * multiplier

        let point = new Vector3(x, y, z)
        points.push(point)
    }
    return points
}