import * as THREE from 'three';
import GUI from 'lil-gui';
import vertexShader from './shaders/wave_vertex.glsl';
import fragmentShader from './shaders/wave_fragment.glsl';
import altVertexShader from './shaders/alternative_vertex.glsl';
import altFragmentShader from './shaders/alternative_fragment.glsl';

export class App {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private mesh: THREE.Mesh;
    private activeMaterial: THREE.RawShaderMaterial;
    private waveMaterial: THREE.RawShaderMaterial;
    private altMaterial: THREE.RawShaderMaterial;
    private startTime: number;
    private gui: GUI;
    private option: string;

    constructor(option: string) {
        this.option = option;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        const container = document.getElementById('app-container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        } else {
            document.body.appendChild(this.renderer.domElement);
        }

        this.startTime = Date.now();

        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
        window.addEventListener('wheel', (event) => this.onZoom(event));
    }

    public init(): void {
        this.createScene();
        this.setupGUI();
        this.animate();
    }

    private createScene(): void {
        const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
        const geometry = new THREE.PlaneGeometry(2, 2, 50, 50);

        this.waveMaterial = new THREE.RawShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                time: { value: 0.0 },
                amplitude: { value: 0.2 },
                frequency: { value: 4.0 },
                smoothness: { value: 1.0 },
                u_resolution: { value: resolution },
            },
            glslVersion: THREE.GLSL3,
        });

        this.altMaterial = new THREE.RawShaderMaterial({
            vertexShader: altVertexShader,
            fragmentShader: altFragmentShader,
            uniforms: {
                time: { value: 0.0 },
                intensity: { value: 0.5 },
                speed: { value: 2.0 },
                u_resolution: { value: resolution },
            },
            glslVersion: THREE.GLSL3,
        });

        this.activeMaterial = this.option === 'alternative' ? this.altMaterial : this.waveMaterial;
        this.mesh = new THREE.Mesh(geometry, this.activeMaterial);
        this.scene.add(this.mesh);
    }

    private setupGUI(): void {
        if (this.gui) this.gui.destroy();
        this.gui = new GUI();

        if (this.activeMaterial === this.waveMaterial) {
            this.gui.add(this.activeMaterial.uniforms.amplitude, 'value', 0, 1).name('Amplitude');
            this.gui.add(this.activeMaterial.uniforms.frequency, 'value', 1, 10).name('Frequency');
            this.gui.add(this.activeMaterial.uniforms.smoothness, 'value', 0.1, 2).name('Smoothness');
        } else {
            this.gui.add(this.activeMaterial.uniforms.intensity, 'value', 0, 1).name('Intensity');
            this.gui.add(this.activeMaterial.uniforms.speed, 'value', 0, 5).name('Speed');
        }
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());
        this.activeMaterial.uniforms.time.value = (Date.now() - this.startTime) / 1000;
        this.renderer.render(this.scene, this.camera);
    }

    private onResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            const container = document.getElementById('app-container');
            if (container) container.innerHTML = ''; 
            this.gui.destroy();
            window.location.reload();
        }
    }

    private onZoom(event: WheelEvent): void {
        this.camera.position.z += event.deltaY * 0.01;
    }
}
