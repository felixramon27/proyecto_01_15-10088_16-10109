//#version 300 es
precision highp float;

// Input attributes
in vec3 position;
in vec3 normal;

// Uniforms
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition; // Se añade la posición de la cámara

// Output varyings
out vec3 vNormal;
out vec3 vPosition;
out vec3 vViewDir; // Se envía la dirección de la cámara correctamente

void main() {
    // Posición en espacio mundial
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vPosition = worldPosition.xyz;

    // Matriz normal para evitar distorsión si hay escalado no uniforme
    mat3 normalMatrix = transpose(inverse(mat3(modelMatrix)));
    vNormal = normalMatrix * normal;

    // Dirección hacia la cámara en espacio mundial
    vViewDir = normalize(cameraPosition - vPosition);

    // Transformación final a clip space
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
