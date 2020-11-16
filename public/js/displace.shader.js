AFRAME.registerShader('displace', {
    schema: {
        time: {
            type: 'number', is: 'uniform', default: 0.0
        },
        color: {
            type: 'color', is: 'uniform', default: '#AAA'
        },
        active: {
            type: 'number', is: 'uniform', default: 0.0
        }
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
        inverseWorld: { value: new THREE.Matrix4() },
        textureEnv: { type: "t", value: new THREE.TextureLoader().load("textures/env.jpg") }
    },
    vertexShader: `
    void main()
{
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}
    `,
    fragmentShader: `
    uniform float time;
uniform vec2 resolution;
uniform mat4 inverseWorld;

uniform sampler2D textureEnv;

varying mat4 model;

#define STEPS 96
#define STEP_SIZE 1.0 / 96.0
#define EPSILON 0.0001
#define MIN_DIST 0.0
#define MAX_DIST 100.0
#define MAX_MARCHING_STEPS 255


vec3 glow = vec3(0.);
float glow_intensity = .015;
vec3 glow_color = vec3(1.0);

vec3 transformed(vec3 p)
{
    return (inverseWorld * vec4(p, 1.0)).xyz;
}


//Noise defenition
float tri( float x ){
  return abs( fract(x) - .5 );
}

vec3 tri3( vec3 p ){

  return vec3(
      tri( p.z + tri( p.y * 1. ) ),
      tri( p.z + tri( p.x * 1. ) ),
      tri( p.y + tri( p.x * 1. ) )
  );

}


float triNoise3D( vec3 p, float spd , float time){

  float z  = 1.4;
	float rz =  0.;
  vec3  bp =   p;

	for( float i = 0.; i <= 3.; i++ ){

    vec3 dg = tri3( bp * 2. );
    p += ( dg + time * .1 * spd );

    bp *= 1.8;
		z  *= 1.5;
		p  *= 1.2;

    float t = tri( p.z + tri( p.x + tri( p.y )));
    rz += t / z;
    bp += 0.14;

	}

	return rz;

}

//End noise defenition

vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
    vec2 xy = fragCoord - size / 2.0;
    float z = size.y / tan(radians(fieldOfView) / 2.0);
    return normalize(vec3(xy, -z));
}

mat3 viewMatrixBuild(vec3 eye, vec3 center, vec3 up) {
    // Based on gluLookAt man page
    vec3 f = normalize(center - eye);
    vec3 s = normalize(cross(f, up));
    vec3 u = cross(s, f);
    return mat3(s, u, -f);
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float sceneSDF(vec3 samplePoint) {
    vec3 p = transformed(samplePoint);

    float r = 0.2 + pow(triNoise3D(samplePoint * 2.0 + time * vec3(-0.05, 0.1, 0), 1.5, time) * 0.02, 1.0);
    float dt = length(p) - r;

    float d = dt;

    glow += glow_color * .025 / (.01 + d*d);

    return d;
}

vec3 sceneNormal(vec3 p) {
    return normalize(vec3(
        sceneSDF(vec3(p.x + EPSILON, p.y, p.z)) - sceneSDF(vec3(p.x - EPSILON, p.y, p.z)),
        sceneSDF(vec3(p.x, p.y + EPSILON, p.z)) - sceneSDF(vec3(p.x, p.y - EPSILON, p.z)),
        sceneSDF(vec3(p.x, p.y, p.z + EPSILON)) - sceneSDF(vec3(p.x, p.y, p.z - EPSILON))
    ));
}

float shortestDistanceToSurface(vec3 eye, vec3 marchingDirection, float start, float end) {
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        float dist = sceneSDF(eye + depth * marchingDirection);
        if (dist < EPSILON) {
            return depth;
        }
        depth += dist;
        if (depth >= end) {
            return end;
        }
    }
    return end;
}

float fresnel(float bias, float scale, float power, vec3 I, vec3 N)
{
    return bias + scale * pow(1.0 + dot(I, N), power);
}

vec3 raymarch(vec2 p, float s) {
    vec3 viewDir = rayDirection(70.0, resolution.xy, gl_FragCoord.xy);
    vec3 eye = cameraPosition;

    mat3 viewToWorld = viewMatrixBuild(eye, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));

    vec3 worldDir = viewToWorld * viewDir;

    float dist = shortestDistanceToSurface(eye, worldDir, MIN_DIST, MAX_DIST);

    if (dist > MAX_DIST - EPSILON) {
        // Didn't hit anything
        return vec3(0.0, 0.0, 0.0);
    }

    vec3 pos = eye + dist * worldDir;

    vec3 normal = sceneNormal(pos);

    vec3 diff1Color = vec3 ( 1.0, 0.1, 0.1 );
    vec3 diff2Color = vec3 ( 0.0, 0.5, 1.0 );

    vec3 light1Dir = normalize(vec3(0.2, -0.2, 0.4));
    float diffuse1 = max ( dot ( normal, light1Dir ), 0.0 );

    vec3 light2Dir = normalize(vec3(-0.2, 0.2, 0.4));
    float diffuse2 = max ( dot ( normal, light2Dir ), 0.0 );

    float spec1 = pow(diffuse1, 128.);
    float spec2 = pow(diffuse2, 128.);

    float diffuseMain = max ( dot ( normal, -worldDir ), 0.0 );

    vec3 I = normalize(pos - eye);
    float R = fresnel(0.05, 4.0, 4.0, I, normal);

    vec3 light_color = vec3(0.99, 0.8, 0.4);

    vec3 diffResult = vec3(light_color*diffuse1 + light_color*diffuse2) * 0.2;


    vec3 specRay = reflect(transformed(worldDir), normal);

    vec3 colorTexture = texture2D(textureEnv, transformed(specRay).xy).rgb;


    vec3 result = vec3(
        glow*glow_intensity*diff2Color*diffuse2 +
        glow*glow_intensity*diff1Color*diffuse1 +
        diffResult*diffuse1*diffuse2 +
        spec1 * colorTexture * 0.99 +
        spec2 * colorTexture * 0.99 +
        R*0.3
    );

    return result;
}

void main( void ) {

    vec2 p = (-resolution.xy + 2.0*gl_FragCoord.xy) / resolution.y;

    vec3 color = raymarch(p, 0.4);

    gl_FragColor = vec4(color, 1.0);
}
    `
})
