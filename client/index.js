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
    uniform float time;
float calculateOffset(float y) {
    return sin((y + time/200.0) * 3.0);
}

void main() {
    float offset = (calculateOffset(position.y)/30.0) + 0.05;
    vec3 newPosition = position + normal * offset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
  
    `,
    fragmentShader: `
    
void main() {

    vec3 color = vec3(0.0, 1.0, 0.0);
    gl_FragColor = vec4( color.rgb, 0.2 );
  
  }
    `
})
