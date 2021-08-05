import { glareParticle } from "shared/glare"
import {pointsFromEquidistanceSphere} from 'shared/mathf'
import { console } from "shared/quark"

let particle = new glareParticle({
    particles: 16,
    filter : {
        type : Enum.RaycastFilterType.Blacklist,
        target : "&p"
    }
})

async function load() {
    await particle.load()
}
load()

let points = 0

particle.onUpdate = function(parts : BasePart[], deltaTime : number) {
    parts.forEach((part) => {
        part.Position = new Vector3(1.54, 0.5, 36.606)
    })
}
particle.onTouched = function(hit : BasePart, part : BasePart, result : RaycastResult) {
    print(part, result)
}