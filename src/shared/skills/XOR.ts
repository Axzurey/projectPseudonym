import { ReplicatedStorage, RunService, TweenService, Workspace } from "@rbxts/services"

let iterations = 0
let random = new Random()

let calculateArmsCount = function() : number {
    let max = 4
    let min = 0
    if (iterations >= 20) {
        max = 2
    }
    if (iterations >= 50) {
        max = 0
    }
    if (iterations < 10) {
        min = 2
    }
    return math.floor(math.abs(math.random() - math.random()) * (1 + max - min) + min)
}

let goldenRatio = 1 + math.sqrt(5) / 4
let angleIncrement = math.pi * 2 * goldenRatio
let multiplier = 10

function generatePoints(n : number) : Vector3[] {
    let points : Vector3[] = []
    for (let i=1; i <= n; i++) {

        let distance = i / n
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

/*
for (let i=0; i < 360; i++) {
    let point : Vector3 = p[i]
    let part = new Instance("Part")
    part.Size = new Vector3(1, 1, 1)
    part.Shape = Enum.PartType.Ball
    part.Position = new Vector3(point.X, point.Y + 20, point.Z)
    part.Anchored = true
    part.Parent = Workspace
}*/

let createNode = function(position : Vector3) {
    iterations += 1
    let arms = calculateArmsCount()
    let n = ReplicatedStorage.assets.wireframecube.Clone()
    n.Color = new Color3(0, 0, 0)
    n.Anchored = true
    n.Size = new Vector3(0, 0, 0)
    TweenService.Create(n, new TweenInfo(1), {Size : new Vector3(1, 1, 1)}).Play()
    n.Position = position
    n.Transparency = 0
    n.Name = "Connector"
    n.Parent = Workspace
    coroutine.wrap(() => {
        let axisx = random.NextNumber(0, 180)
        let axisy = random.NextNumber(0, 180)
        let axisz = random.NextNumber(0, 180)
        let increment = .01
        RunService.Stepped.Connect((deltaTime) => {
            n.CFrame = n.CFrame.Lerp(n.CFrame.mul(CFrame.Angles(math.rad(axisx), math.rad(axisy), math.rad(axisz))), increment)
        })
    })()
    if (arms === 0) {
        
    }
    else {
        for (let i=0; i < arms; i++) {
            coroutine.wrap(() => {
                let p: Vector3[] = generatePoints(360)
                print(math.random(0, p.size() - 1))
                let point2 = position.add(p[math.random(0, p.size() - 1)])
                let magnitude = position.sub(point2).Magnitude
                let n = new Instance("Beam")
                n.Color = new ColorSequence(Color3.fromRGB(0, 255, 255))
                n.Width0 = .1
                n.Width1 = .1
                n.FaceCamera = true
                n.Segments = 1
                n.Transparency = new NumberSequence(0)
                let a = new Instance("Attachment")
                let b = new Instance("Attachment")
                a.WorldCFrame = new CFrame(position)
                b.WorldCFrame = new CFrame(position)
                n.Attachment0 = a
                n.Attachment1 = b
                let l = CFrame.lookAt(position, point2)
                b.WorldCFrame = l
                n.Parent = Workspace.Terrain
                b.Parent = Workspace.Terrain
                a.Parent = Workspace.Terrain
                let z = 0
                while (z < magnitude) {
                    z += .1
                    b.WorldCFrame = l.add(l.LookVector.mul(z))
                    RunService.Heartbeat.Wait()
                }
                createNode(point2)
            })()
        }
    }
}

export function call() {
    createNode(new Vector3(0, 10, 0))
}
