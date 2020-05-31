import Chance from 'chance';
import * as THREE from 'three';
import Stats from 'stats-js';
import ParticleFamily from "./ParticleFamily";
import Particle from "./Particle";

export default class Simulation {
    constructor() {
        this.is_running = false;
        this.seed = null;
        this.chance = null;
        this.world_width = 0;
        this.world_height = 0;
        this.particles = [];
        this.families = [];

        this.stats = new Stats();
        this.stats.showPanel(0);

        this.camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 2000);
        this.camera.position.z = 4;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.family_meshes_group = new THREE.Group();
        this.family_meshes_arr = [];
        this.scene.add(this.camera);
        this.scene.add(this.family_meshes_group);

        this.setSeed(Math.random());
        this.setSizeAuto();
        this.generateFamilies();
        for (let i = 0; i < 500; i++) this.addRandomParticle();
        this.particles[0].verbose = true;
        console.log(this);
    }

    getCanvas()
    {
        return this.renderer.domElement;
    }

    getStats()
    {
        return this.stats.dom;
    }

    clear()
    {
        this.particles = [];
    }

    generateFamilies(count = 10)
    {
        for (let i = 0; i < count; i++)
        {
            this.families.push(new ParticleFamily(this.chance.color({format: 'hex'}), i, this));
        }

        this.families.forEach(family => {
            family.randomizeAttraction();

            let material = new THREE.PointsMaterial({
                color: family.color,
                size: 10
            });

            let geom = new THREE.Geometry();
            let mesh = new THREE.Points(geom, material);

            this.family_meshes_arr.push(mesh);
            this.scene.add(mesh);
        })

        this.family_meshes_arr.forEach(family => console.log(family));
    }

    setSize(width, height)
    {
        this.world_width = width;
        this.world_height = height;

        this.camera.right = width;
        this.camera.bottom = height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    setSizeAuto()
    {
        this.setSize(window.innerWidth, window.innerHeight);
    }

    addRandomParticle()
    {
        let family_index = this.chance.integer({min: 0, max: this.families.length - 1});
        // let x = this.chance.integer({min: 0, max: this.world_width - 1});
        // let y = this.chance.integer({min: 0, max: this.world_height - 1});
        let x = this.world_width / 2 + Math.random() * 2;
        let y = this.world_height / 2 + Math.random() * 2;

        this.addParticle(new Particle(x, y, this.families[family_index], this));
    }

    addParticle(particle)
    {
        this.particles.push(particle);

        let family_index = particle.fam.index;
        let mesh = this.family_meshes_arr[family_index];
        mesh.geometry.vertices.push(particle.position);
        mesh.geometry.elementsNeedUpdate = true;
    }

    setSeed(seed)
    {
        this.seed = seed;
        this.chance = new Chance(this.seed);
    }

    start()
    {
        this.is_running = true;
        this.frame();
    }

    frame()
    {
        if (this.is_running) requestAnimationFrame(this.frame.bind(this));

        this.stats.begin();

        // for (let i = 0; i < 10; i++)
        this.particles.forEach(particle => particle.update());

        this.renderer.render(this.scene, this.camera);
        this.stats.end();
    }

    stop()
    {
        this.is_running = false;
    }
}