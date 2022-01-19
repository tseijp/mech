import { useRef, StrictMode, Suspense } from "react";
import { render } from "react-dom";
import useRefs from "react-use-refs";
import * as DREI from "@react-three/drei";
import * as FIBER from "@react-three/fiber";
import * as THREE from "three";
import { animated } from "@react-spring/three";
import { useGestures } from "./hooks"
import { useGeometry } from "./hooks";
import { Grid, Box, Style, Symbol } from "./components";

const date = (_: any) => `${_.getFullYear()}.${_.getMonth()+1}.${_.getDate()}`;
const style = {touchAction: "none", margin: 0};
const center = new THREE.Vector3();
const Camera = DREI.OrthographicCamera;
const USER = "https://github.com/tseijp/";
const REPO = USER + "mech"


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
    camera.current.lookAt(center);
    gl.autoClear = true;
    gl.render(scene, camera.current);
    gl.autoClear = false;
    gl.clearDepth();
    context.canvas.width += 0; // render canvas
    context.drawImage(gl.domElement, 0, 0);
  });
  // @ts-ignore
  return FIBER.createPortal(<As ref={camera} {...other} />, viewport);
}

function App() {
  const [$0, $1, $2, camera] = useRefs<[any, any, any, any]>(null);
  const [state, bind] = useGestures();
  const [$, _] = useGeometry();
  return (
    <Grid $top $j="auto auto" theme={{isDarkMode: $.isMesh}} margin="10mm">
      <Style $d={$.isMesh} />
      <Grid $i="auto auto" $j="auto auto"> {/* $w="150mm"*/}
        <canvas ref={$0} {...bind(1)} style={style} />
        <canvas ref={$1} {...bind(2)} style={style} />
        <canvas ref={$2} {...bind(0)} style={style} />
        <FIBER.Canvas style={{gridRow: "1/2", gridColumn: "2/3"}}>
          <ViewPort $={$0} zoom={100} position-y={100} as={Camera} />
          <ViewPort $={$1} zoom={100} position-z={100} as={Camera} />
          <ViewPort $={$2} zoom={100} position-x={100} as={Camera} />
          <Camera ref={camera} makeDefault zoom={75} position={[1, 1, 1]} />
          <DREI.OrbitControls enablePan={false} rotateSpeed={0.15} />
          <DREI.GizmoHelper margin={[50, 50]} alignment="top-right">
            <DREI.GizmoViewport />
          </DREI.GizmoHelper>
          <ambientLight />
          <pointLight />
          <Suspense fallback={null}>
            <animated.group {...state}>
              <lineSegments onUpdate={(_) => _.computeLineDistances()}>
                { $.geometry && <edgesGeometry args={[$.geometry]} />}
                <lineDashedMaterial
                  dashSize={0.3}
                  gapSize={0.15}
                  color="#222933"
                  onBeforeCompile={beforeCompile}
                />
              </lineSegments>
              { $.isMesh && (
                <mesh geometry={$.geometry}>
                  <meshStandardMaterial transparent color="white" />
                </mesh>
              )}
            </animated.group>
          </Suspense>
          <axesHelper scale={10} position={[0.01, 0.01, 0.01]} />
          <color attach="background" args={[$.isMesh? "#222933": "#fff"]} />
        </FIBER.Canvas>
      </Grid>
      <Grid $b $mm $i="12 43 10 15 15 15 40" $j="7 8 10 15">
        <Box $i="1/3" $j="1/3" $to={REPO}>{document.title}</Box>
        <Box $i="3/6" $j="1/3">{date(new Date())}</Box>
        <Box $i="6/7" $sm>No.</Box>
        <Box $i="7/8" $sm>1710000</Box>
        <Box $i="6/7" $sm>Name</Box>
        <Box $i="7/8" $sm $to={USER}>tseijp</Box>
        <Box $i="1/4">Title</Box>
        <Box $i="4/5">Scale</Box>
        <Box $i="5/7">Projection</Box>
        <Box $i="7/8">Number</Box>
        <Box $i="1/4" {..._({type: "file"})}>{$.name || "V Block"}</Box>
        <Box $i="4/5">1:1</Box>
        <Box $i="5/7" {..._({type: "mesh"})}><Symbol $d={$.isMesh}/></Box>
        <Box $i="7/8">{$.size || "1800"}</Box>
      </Grid>
    </Grid>
  );
}

render(<StrictMode><App /></StrictMode>, document.getElementById("root"));
