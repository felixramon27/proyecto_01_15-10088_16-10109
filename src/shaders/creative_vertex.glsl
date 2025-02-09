//#version 300 es
precision highp float;

in vec3 position;
in vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform float inflate;
uniform float waveAmplitude;
uniform float waveSpeed;

out vec3 vNormal;
out vec3 vPosition;

void main() {
    vec3 newPosition = position + normal * inflate * 0.5;
    newPosition.y += sin(time * waveSpeed + position.x * 5.0) * waveAmplitude;
    
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vPosition = modelPosition.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}