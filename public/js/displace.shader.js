AFRAME.registerShader('displace', {
    schema: {
        time: {
            type: 'number', is: 'uniform', default: 0.0
        },
        color: {
            type: 'color', is: 'uniform', default: 'red'
        },
        active: {
            type: 'number', is: 'uniform', default: 0.0
        }
    },
    vertexShader: `
    uniform float time;
float calculateOffset(float y) {
    return sin((y + time/200.0) * 3.0);
}

void main() {
    float offset = ((calculateOffset(position.y)/30.0) + 0.05) * active;
    vec3 newPosition = position + normal * offset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
  
    `,
    fragmentShader: `
    
    uniform vec3 color;
void main() {

    gl_FragColor = vec4( color, 0.2 );
  
  }
    `
})
