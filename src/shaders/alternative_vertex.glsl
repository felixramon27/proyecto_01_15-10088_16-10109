//#version 300 es
precision mediump float;
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

void main() {
    vec3 newPosition = position;
    newPosition.z += sin(position.x * 2.0 + time) * 0.2;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
