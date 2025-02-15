import * as THREE from 'three';
import GUI from 'lil-gui';
import vertexShader from './shaders/wave_vertex.glsl';
import fragmentShader from './shaders/wave_fragment.glsl';
import blinnPhongVertexShader from './shaders/blinn_phong_vertex.glsl';
import blinnPhongFragmentShader from './shaders/blinn_phong_fragment.glsl';
import creativeVertexShader from './shaders/creative_vertex.glsl';
import creativeFragmentShader from './shaders/creative_fragment.glsl';

export class App {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private mesh: THREE.Mesh;
    private activeMaterial: THREE.RawShaderMaterial;
    private waveMaterial: THREE.RawShaderMaterial;
    private blinnPhongMaterial: THREE.RawShaderMaterial;
    private creativeMaterial: THREE.RawShaderMaterial;
    private startTime: number;
    private gui: GUI;
    private option: string;

    constructor(option: string) {
        this.option = option;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
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
        // 1. Determinar la geometría según la opción seleccionada
        let geometry: THREE.BufferGeometry;
        if (this.option === 'creative') {
            geometry = new THREE.SphereGeometry(1, 32, 32);
        } else {
            geometry = new THREE.PlaneGeometry(2, 2, 50, 50);
        }

        // 2. Calcular normales para ambas geometrías
        geometry.computeVertexNormals();

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
        this.blinnPhongMaterial = new THREE.RawShaderMaterial({
            vertexShader: blinnPhongVertexShader,
            fragmentShader: blinnPhongFragmentShader,
            uniforms: {
                time: { value: 0.0 },
                lightColor: { value: new THREE.Color(1, 1, 1) },
                materialColor: { value: new THREE.Color(0.2, 0.5, 1.0) },
                specularColor: { value: new THREE.Color(1, 1, 1) },
                shininess: { value: 32.0 },
                lightPosition: { value: new THREE.Vector3(5, 5, 5) },
            },
            glslVersion: THREE.GLSL3,
        });

        this.creativeMaterial = new THREE.RawShaderMaterial({
            vertexShader: creativeVertexShader,
            fragmentShader: creativeFragmentShader,
            uniforms: {
                time: { value: 0.0 },
                inflate: { value: 0.5 },
                waveAmplitude: { value: 0.2 },
                waveSpeed: { value: 1.0 },
                toonLevels: { value: 3.0 },
                lightColor: { value: new THREE.Color(1, 1, 1) },
                materialColor: { value: new THREE.Color(0.2, 0.5, 1.0) },
                modelMatrix: { value: new THREE.Matrix4() },
                viewMatrix: { value: new THREE.Matrix4() },
                projectionMatrix: { value: new THREE.Matrix4() }
            },
            glslVersion: THREE.GLSL3,
        });

        // this.activeMaterial = this.option === 'alternative' ? this.altMaterial : this.waveMaterial;
        // Actualiza la lógica de selección de material
        switch(this.option) {
            case 'blinn-phong':
                this.activeMaterial = this.blinnPhongMaterial;
                break;
            case 'creative':
                this.activeMaterial = this.creativeMaterial;
                break;
            default:
                this.activeMaterial = this.waveMaterial;
        }
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
        } else if (this.activeMaterial === this.creativeMaterial) {
            this.gui.add(this.activeMaterial.uniforms.inflate, 'value', 0, 1).name('Inflate');
            this.gui.add(this.activeMaterial.uniforms.waveAmplitude, 'value', 0, 0.5).name('Wave Amp');
            this.gui.add(this.activeMaterial.uniforms.waveSpeed, 'value', 0, 3).name('Wave Speed');
            this.gui.add(this.activeMaterial.uniforms.toonLevels, 'value', 1, 10).step(1).name('Toon Levels');
            
            // Agrega controles de color
            const lightColor = { color: '#ffffff' };
            const materialColor = { color: '#3399ff' };
            
            this.gui.addColor(lightColor, 'color').onChange(val => {
                this.activeMaterial.uniforms.lightColor.value.setHex(val);
            }).name('Light Color');
            
            this.gui.addColor(materialColor, 'color').onChange(val => {
                this.activeMaterial.uniforms.materialColor.value.setHex(val);
            }).name('Material Color');
        } else if (this.activeMaterial === this.blinnPhongMaterial) {
            this.gui.add(this.activeMaterial.uniforms.shininess, 'value', 1, 128).name('Shininess');
            this.gui.addColor({ color: '#ffffff' }, 'color').onChange(val => this.activeMaterial.uniforms.lightColor.value.set(val)).name('Light Color');
            this.gui.addColor({ color: '#3399ff' }, 'color').onChange(val => this.activeMaterial.uniforms.materialColor.value.set(val)).name('Material Color');
            this.gui.addColor({ color: '#ffffff' }, 'color').onChange(val => this.activeMaterial.uniforms.specularColor.value.set(val)).name('Specular Color');
        }else {
            this.gui.add(this.activeMaterial.uniforms.intensity, 'value', 0, 1).name('Intensity');
            this.gui.add(this.activeMaterial.uniforms.speed, 'value', 0, 5).name('Speed');
        }

    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());

       this.activeMaterial.uniforms.time.value = (Date.now() - this.startTime) / 1000;
        this.renderer.render(this.scene, this.camera);

        // Actualizar matrices de transformación
        this.mesh.updateMatrixWorld();
        if (this.activeMaterial === this.creativeMaterial) {
            this.activeMaterial.uniforms.modelMatrix.value = this.mesh.matrixWorld;
            this.activeMaterial.uniforms.viewMatrix.value = this.camera.matrixWorldInverse;
            this.activeMaterial.uniforms.projectionMatrix.value = this.camera.projectionMatrix;
        }
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
