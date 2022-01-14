import { useRef, StrictMode, Suspense } from "react";
import { render } from "react-dom";
import useRefs from "react-use-refs";
import * as THREE from "three";
import * as DREI from "@react-three/drei";
import * as FIBER from "@react-three/fiber";
import { animated as a } from "@react-spring/three"
import { useGestures } from "./hooks"
import { useGeometry } from "./hooks";
import { Wrap, Grid, Box } from "./components";

const Cam = DREI.OrthographicCamera;
const v0 = new THREE.Vector3();
const style = {touchAction: "none", margin: 0}
const coodDate = (date = new Date()) => `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`

function beforeCompile(shader: any) {
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
          // TODO FIX
          if ( mod( vLineDistance, totalSize ) > dashSize ) {
            discard;
          }
        }`
  );
}

function ViewPort(props: any): any {
  const { $, as: As, ...other } = props;
  const { gl, scene, viewport } = FIBER.useThree();
  const camera = useRef<any>(null);
  FIBER.useFrame(() => {
    const context = $.current.getContext("2d");
    camera.current.lookAt(v0);
    gl.autoClear = true;
    gl.render(scene, camera.current);
    gl.autoClear = false;
    gl.clearDepth();
    context.canvas.width += 0;
    context.drawImage(gl.domElement, 0, 0);
  });
  // @ts-ignore
  return FIBER.createPortal(<As ref={camera} {...other} />, viewport);
}

function App() {
  const [$0, $1, $2, cam] = useRefs<[any, any, any, any]>(null)
  const [$, _] = useGeometry({$0, $1, $2, cam})
  const [state, bind] = useGestures({$0, $1, $2, cam})
  return (
    <Wrap $d={$.isMesh} margin="2rem">
      <Grid $d={$.isMesh} $i="auto auto" $j="auto auto" $w="150mm">
        <canvas ref={$0} {...bind(1)} style={style} />
        <canvas ref={$1} {...bind(2)} style={style} />
        <FIBER.Canvas>
          <ViewPort $={$0} zoom={100} position-y={100} as={Cam} />
          <ViewPort $={$1} zoom={100} position-z={100} as={Cam} />
          <ViewPort $={$2} zoom={100} position-x={100} as={Cam} />
          <Cam ref={cam} makeDefault zoom={75} position={[1, 1, 1]} />
          <DREI.OrbitControls enablePan={false} rotateSpeed={0.15} />
          <DREI.GizmoHelper margin={[50, 50]} alignment="top-right">
            <DREI.GizmoViewport />
          </DREI.GizmoHelper>
          <ambientLight />
          <pointLight />
          <Suspense fallback={null}>
            <a.group {...state}>
              <lineSegments onUpdate={(_) => _.computeLineDistances()}>
                { $.geometry && <edgesGeometry args={[$.geometry]} />}
                <lineDashedMaterial
                  dashSize={0.3}
                  gapSize={0.15}
                  color="#000"
                  onBeforeCompile={beforeCompile}
                />
              </lineSegments>
              { $.isMesh && (
                <mesh geometry={$.geometry}>
                  <meshStandardMaterial transparent color="white" />
                </mesh>
              )}
            </a.group>
          </Suspense>
          <axesHelper scale={10} position={[0.01, 0.01, 0.01]} />
          <color attach="background" args={["#fff"]} />
        </FIBER.Canvas>
        <canvas ref={$2} {...bind(0)} style={style}/>
      </Grid>
      <Grid $b $mm $w="150" $h="40" $i="12 43 10 15 15 15 40" $j="7 8 10 15">
        <Box $i="1/3" $j="1/3" href="https://github.com/tseijp/mech" />
        <Box $i="3/6" $j="1/3" select="" text={coodDate()} />
        <Box $i="6/7" $sm text="No." />
        <Box $i="7/8" $sm input="1710000" />
        <Box $i="6/7" $sm text="Name" />
        <Box $i="7/8" $sm input="tseijp" />
        <Box $i="1/4" text="Title" />
        <Box $i="4/5" text="Scale" />
        <Box $i="5/7" text="Projection"/>
        <Box $i="7/8" text="Number" />
        <Box $i="1/4" file={$.name||"V Block"} {..._("file")}/>
        <Box $i="4/5" input={`1:${$.scalez||1}`} />
        <Box $i="5/7" mesh="Third Angle"  {..._("mesh")}/>
        <Box $i="7/8" input={$.size||"1800"} />
      </Grid>
    </Wrap>
  );
}

render(<StrictMode><App /></StrictMode>, document.getElementById("root"));
