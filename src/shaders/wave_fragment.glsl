//#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

void main() {
    float colorFactor = 0.5 + 0.5 * sin(vUv.y * 10.0);
    fragColor = vec4(colorFactor, colorFactor, 1.0, 1.0);
}
