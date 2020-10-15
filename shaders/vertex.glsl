#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d)

//
// Based on @thespite's article:
// 
// "Vertex displacement with a noise function using GLSL and three.js"
// Source: https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/
//

varying float noise;
uniform float time;

float turbulence( vec3 p ) {

  float w = 100.0;
  float t = -.5;

  for (float f = 1.0 ; f <= 10.0 ; f++ ){
    // noise
    t += sin(pnoise3( vec3(p), vec3( 1.0, 1.0, 1.0 ) ));
    // dot
    // t += sin(dot( vec3(p), vec3( 1.0, 1.0, 1.0 ) ));
  }

  return t;
}

float calculateOffset(float y) {
  return sin(y + time * 2.0);
}

void main() {
  //noise = turbulence( cross(vec3(1.0,1.0,1.0),normal) + time / 3.0 );
  //float displacement =  noise / 40.0;
  float displacement = (calculateOffset(position.y) / 4.0) + 0.5;

  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}


