export function coodDate() {
  const date = new Date();
  return `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
}

export function beforeCompile(shader: any) {
  shader.vertexShader = `
    varying float isDashed;
    ${shader.vertexShader}
  `.replace(
    `#include <fog_vertex>`,
    `#include <fog_vertex>
        vec3 nor1 = normalize(normalMatrix * normal);
        vec3 vDir = normalize(mvPosition.xyz);
        isDashed = step( 0., dot( vDir, nor1 ) );
    `
  );
  shader.fragmentShader = `
    varying float isDashed;
    ${shader.fragmentShader}
  `.replace(
    `if ( mod( vLineDistance, totalSize ) > dashSize ) {\n\t\tdiscard;\n\t}`,
    `if ( isDashed > 0.0 ) {
          if ( mod( vLineDistance, totalSize ) > dashSize ) {
            discard;
          }
        }`
  );
}
