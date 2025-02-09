//#version 300 es
precision highp float;

in vec3 vNormal;
in vec3 vPosition;

out vec4 fragColor;

uniform float toonLevels;
uniform vec3 lightColor;
uniform vec3 materialColor;

void main() {
    vec3 lightDirection = normalize(vec3(1.0, 2.0, 1.0));
    float diffuse = max(dot(normalize(vNormal), lightDirection), 0.0);
    diffuse = floor(diffuse * toonLevels) / toonLevels;
    
    vec3 color = materialColor * lightColor * diffuse;
    
    float edge = smoothstep(0.7, 0.9, 1.0 - diffuse);
    color = mix(color, vec3(0.0), edge * 0.5);
    
    fragColor = vec4(color, 1.0);
}