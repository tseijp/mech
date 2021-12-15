import { useRef, Suspense } from "react";
import { render } from "react-dom";
import useRefs from "react-use-refs";
import * as THREE from "three";
import * as DREI from "@react-three/drei";
import * as FIBER from "@react-three/fiber";
import * as CANNON from "@react-three/cannon";
import * as handlers from './handlers'
import { useGeometry } from "./hooks";
import { Wrap, Grid, Box } from "./components";

const Cam = DREI.OrthographicCamera;
const v0 = new THREE.Vector3();

render(<App />, document.getElementById("root"));

function App() {
  const [$0, $1, $2] = useRefs<[any, any, any]>(null)

  return (
    <Wrap margin="2rem">
      <Grid col="auto auto" row="auto auto">
        <canvas ref={$0} />
        <canvas ref={$1} />
        <canvas ref={$2} />
        <FIBER.Canvas style={{ gridRow: 1, gridColumn: 2 }}>
          <ViewPort $={$0} zoom={100} position-y={100} as={Cam} />
          <ViewPort $={$1} zoom={100} position-z={100} as={Cam} />
          <ViewPort $={$2} zoom={100} position-x={100} as={Cam} />
          <Cam makeDefault zoom={75} position={[1, 1, 1]} />
          <DREI.OrbitControls enablePan={false} rotateSpeed={0.15} />
          <DREI.GizmoHelper margin={[50, 50]} alignment="top-right">
            <DREI.GizmoViewport />
          </DREI.GizmoHelper>
          <ambientLight />
          <pointLight />
          <Suspense fallback={null}>
            <CANNON.Physics gravity={[0, -10, 0]}>
              <CANNON.Debug scale={1.1} color="black">
                <Target mass={1} />
                {/* <Plane /> */}
              </CANNON.Debug>
            </CANNON.Physics>
          </Suspense>
          <axesHelper scale={10} position={[0.01, 0.01, 0.01]} />
          <color attach="background" args={["#fff"]} />
        </FIBER.Canvas>
      </Grid>
      <Grid b mm w="150" h="40" col="12 43 10 15 15 15 40" row="7 8 10 15">
        <Box col="1/3" row="1/3" input={document.title} />
        <Box col="3/6" row="1/3" text={handlers.coodDate()} />
        <Box small text="No." />
        <Box small input="1710000" />
        <Box small text="Name" />
        <Box small input="tseijp" />
        <Box col="1/4" text="Title" />
        <Box col="4/5" text="Scale" />
        <Box col="5/7" text="Projection" />
        <Box col="7/8" text="Number" />
        <Box col="1/4" file="V Block" />
        <Box col="4/5" input="1:1" />
        <Box col="5/7" input={"Third Angle"} />
        <Box col="7/8" input="1800" />
      </Grid>
    </Wrap>
  );
}

function ViewPort(props: any): any {
  const { $, as: As, ...other } = props;
  const { gl, scene, viewport } = FIBER.useThree();
  const ref = useRef<any>(null);
  FIBER.useFrame(() => {
    const context = $.current.getContext("2d");
    ref.current.lookAt(v0);
    gl.autoClear = true;
    gl.render(scene, ref.current);
    gl.autoClear = false;
    gl.clearDepth();
    context.drawImage(gl.domElement, 0, 0);
  });
  return FIBER.createPortal(<As ref={ref} {...other} />, viewport);
}

function Target(props: any) {
  const { mass, ...other } = props
  const ref = useRef();
  const geometry = useGeometry();

  return (
    <group ref={ref} {...other}>
      <lineSegments onUpdate={(_) => _.computeLineDistances()}>
        <edgesGeometry args={[geometry]} />
        <lineDashedMaterial
          dashSize={0.3}
          gapSize={0.15}
          color="#000"
          onBeforeCompile={handlers.beforeCompile}
        ></lineDashedMaterial>
      </lineSegments>
      {/* <mesh geometry={geometry}>
        <meshNormalMaterial />
        <meshStandardMaterial transparent color="white" />
      </mesh> */}
    </group>
  );
}

// function Plane(props) {
//   return (
//     <DREI.Reflector
//       ref={CANNON.usePlane(() => props)}
//       {...props}
//       args={[10, 10]}
//       mirror={0.5}
//       mixStrength={1}
//       depthScale={20}
//       resolution={1024}
//     >
//       {(Material, props) => (
//         <Material color="#2e2e2e" metalness={0.5} roughness={1} {...props} />
//       )}
//     </DREI.Reflector>
//   );
// }
