//#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform float amplitude;
uniform float frequency;
uniform float smoothness;

out vec2 vUv;

void main() {
    vec3 pos = position;
    pos.z += sin(pos.x * frequency + time) * amplitude * smoothness;
    
    vUv = uv; 
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
