/* global AFRAME, THREE */

const glsl = require('glslify');
const vertexShader = glsl.file('../shaders/vertex.glsl');
const fragmentShader = glsl.file('../shaders/fragment.glsl');

AFRAME.registerComponent('material-displacement', {
    tick: function (t) {
        this.el.setAttribute("material", "time:" + t);
    }
})

AFRAME.registerShader('displace', {
    schema: {
        time: {
            type: 'number', is: 'uniform', default: 0.0
        }
    },
    vertexShader: `
    uniform time;
float calculateOffset(float y) {
    return sin(y + time);
}

void main() {
    float offset = calculateOffset(position.y);
    vec3 newPosition = position + normal * offset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
  
    `
})
