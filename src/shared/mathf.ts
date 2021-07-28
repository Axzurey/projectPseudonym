export function pointsFromEquidistant2(center : Vector2, count : number, radius : number) : Vector2[] {
    let cpo = 360 / count
    let points = []
    for (let i = 1; i <= count; i++) {
        let theta = math.rad(cpo * i)
        let x = math.cos(theta) * radius
        let y = math.sin(theta) * radius
        let position = center.add(new Vector2(x, y))
        points.push(position)
    }
    return points
}

export function magnitudeFromXXYY(x1 : number, x2 : number, y1 : number, y2 : number) : number {
    let n = new Vector2(x1, y1)
    let z = new Vector2(x2, y2)
    return (z.sub(n)).Magnitude
    //return math.sqrt((x1 - x2) ^ 2 + (y1 - y2) ^ 2)
}

export function midPointFromXXYY(x1 : number, x2 : number, y1 : number, y2 : number) : [number, number] {
    return [ (x1 + x2) / 2, (y1 + y2) / 2]
}

export function angleFromXXYY(x1 : number, x2 : number, y1 : number, y2 : number) : number {
    return math.atan2((y1 - y2), (x1 - x2))
}