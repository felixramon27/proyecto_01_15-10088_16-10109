//#version 300 es
precision highp float;

// Input varyings
in vec3 vNormal;
in vec3 vPosition;
in vec3 vViewDir;

// Uniforms
uniform vec3 lightColor;
uniform vec3 materialColor;   // Color base del material
uniform vec3 specularColor;   // Color del brillo especular
uniform float shininess;
uniform vec3 lightPosition;
uniform float ambientStrength; // Intensidad de la luz ambiental

// Output color
out vec4 fragColor;

void main() {
    // Normalización de vectores
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(lightPosition - vPosition);
    vec3 halfwayDir = normalize(lightDir + vViewDir);

    // Componente difusa (mezcla de la luz con el color del material)
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * lightColor * materialColor;

    // Componente especular (brillo)
    float spec = pow(max(dot(normal, halfwayDir), 0.0), shininess);
    vec3 specular = spec * lightColor * specularColor;

    // Componente ambiental (suaviza las sombras)
    vec3 ambient = ambientStrength * lightColor * materialColor;

    // Iluminación total
    vec3 finalColor = ambient + diffuse + specular;
    
    fragColor = vec4(finalColor, 1.0);
}
