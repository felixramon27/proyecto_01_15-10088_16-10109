//#version 300 es
precision mediump float;
uniform float intensity;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    gl_FragColor = vec4(uv.x, uv.y, intensity, 1.0);
}
