//#version 300 es
precision highp float;

in vec2 vUv;
in vec3 vNormal;
in vec3 vPosition;

uniform float time;
uniform float amplitude;
uniform float frequency;
uniform float smoothness;

out vec4 fragColor;

void main() {
    // Base color con gradiente vertical
    float verticalGradient = 0.5 + 0.5 * sin(vUv.x * frequency * 2.0 + time);
    vec3 baseColor = mix(
        vec3(0.1, 0.2, 0.6),  // Azul oscuro
        vec3(1.0, 1.0, 1.0),   // Blanco puro
        // vec3(0.2, 0.3, 0.8), // Azul
        // vec3(0.8, 0.5, 0.2), // Naranja
        verticalGradient
    );

    // Iluminación difusa
    vec3 lightDir = normalize(vec3(0.5, 0.7, 1.0));
    float diffuse = max(dot(normalize(vNormal), lightDir), 0.0);
    
    // Efecto specular
    vec3 viewDir = normalize(-vPosition);
    vec3 reflectDir = reflect(-lightDir, normalize(vNormal));
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    
    // Color final con iluminación
    vec3 finalColor = baseColor * (diffuse + 0.5) + spec * 0.3;

    fragColor = vec4(finalColor, 1.0);
}
