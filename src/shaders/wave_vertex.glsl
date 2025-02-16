//#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform float amplitude;
uniform float frequency;
uniform float smoothness;

out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;

void main() {
    // Desplazamiento vertical con efecto de onda
    vec3 pos = position;
    float displacement = sin(pos.x * frequency + time) * amplitude;
    pos.z += displacement * smoothness;
    
    // Calcular normales modificadas
    float derivative = cos(pos.x * frequency + time) * frequency * amplitude;
    vec3 modifiedNormal = normalize(vec3(-derivative, 0.0, 1.0));
    
    vUv = uv;
    vNormal = modifiedNormal;
    vPosition = pos;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}