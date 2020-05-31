import * as THREE from 'three';

export default class Particle {
    constructor(x, y, fam, sim, verbose = false) {
        this.x = x;
        this.y = y;
        this.fam = fam;
        this.vx = 0;
        this.vy = 0;
        this.sim = sim;
        this.verbose = verbose;

        this.position = new THREE.Vector3(this.x, this.y, 0);
    }

    update()
    {
        this.sim.particles.forEach(other => {
            let dx = other.x - this.x;
            let dy = other.y - this.y;

            if (dx > this.sim.world_width / 2)
            {
                dx -= this.sim.world_width;
            }
            else if (dx < -this.sim.world_width / 2)
            {
                dx += this.sim.world_width;
            }

            if (dy > this.sim.world_height / 2)
            {
                dy -= this.sim.world_height;
            }
            else if (dy < -this.sim.world_height / 2)
            {
                dy += this.sim.world_height;
            }

            let dist2 = dx * dx + dy * dy;
            if (dist2 > this.fam.radius_max * this.fam.radius_max || dist2 < 0.01) return;
            let force = 0;

            if (Math.abs(dx) < 5)
            {

            }


            let reducer = Math.sqrt(dist2);
            let dx2 = dx / reducer;
            let dy2 = dy / reducer;

            if (reducer > this.fam.radius_min)
            {
                let numer = 2 * Math.abs(reducer - .5 * (this.fam.radius_max + this.fam.radius_min));
                let denom = this.fam.radius_max - this.fam.radius_min;

                force = this.fam.attraction[other.fam.index] * (1 - numer / denom);
            }
            else
            {
                force = 2 * this.fam.radius_min * (1 / (this.fam.radius_min + 2) - 1 / (reducer + 2));
            }

            if (force !== 0)
            {
                this.vx += force * dx2;
                this.vy += force * dy2;
            }
        });

        this.calculatePosition();
    }

    calculatePosition()
    {
        this.x += this.vx;
        this.y += this.vy;

        this.vx *= .95;
        this.vy *= .95;

        if (this.x < 0) this.x += this.sim.world_width;
        if (this.y < 0) this.y += this.sim.world_height;
        if (this.x >= this.sim.world_width) this.x -= this.sim.world_width;
        if (this.y >= this.sim.world_height) this.y -= this.sim.world_height;

        this.position.x = this.x;
        this.position.y = this.y;

        if (this.verbose) console.log(this.x, this.y, this.vx, this.vy);

        this.sim.family_meshes_arr[this.fam.index].geometry.verticesNeedUpdate = true;

        if (this.verbose) console.log(this.sim.family_meshes_arr[this.fam.index]);
        this.verbose = false;
    }
}