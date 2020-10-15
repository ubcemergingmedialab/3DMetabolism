
float calculateOffset(float y) {
  return sin(y + time);
}

void main() {
  float offset = calculateOffset(position.y);
  vec3 newPosition = position + normal * offset;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
