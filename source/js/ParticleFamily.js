export default class ParticleFamily {
    constructor(color, index, sim, radius_min = 5, radius_max = 200) {
        this.color = color;
        this.index = index;
        this.radius_min = radius_min;
        this.radius_max = radius_max;
        this.sim = sim;
        this.radius = 5;
        this.attraction = [];
    }

    randomizeAttraction()
    {
        this.attraction = [];
        this.sim.families.forEach(family => this.attraction.push(this.sim.chance.floating({min: -.05, max: .05})));
    }
}