import { createContext, useContext } from "react";
// import * as THREE from "three";
// import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from "three";

type Fun = (...args: any[]) => void

class Controller {
    callback: Fun = ()=>{}
    geometry: any

    constructor (callback: Fun = ()=>{}) {
        this.callback = callback
        this.geometry = defaultGeometry()
        this.callback([])
        this.bind = this.bind.bind(this)
    }

    bind () {
        return {onChange: () => {}}
    }
}

export const CtrlContext = createContext<Controller>(new Controller())
export const useGeometry = () => useContext(CtrlContext)?.geometry;
export const useBindFile = () => useContext(CtrlContext)?.bind;

// const loadErrorMessage = "Load Error: This file is not supported by Loaders";
//
// const loadFunctions = {
//   stl: (f, g) => g.push(new STLLoader(f.name)),
//   obj: (f, g) => g.push(new OBJLoader(f.name)),
//   glsl: (f, g) => g.push(new GLTFLoader(f.name)),
//   draco: (f, g) => g.push(new DRACOLoader(f.name))
// };

const extrudeConfig = {
  steps: 1,
  depth: 1,
  bevelEnabled: false
}

function defaultGeometry (props: any = {}) {
  const { w = 1, h = 1, m = 0.76, n = 0.06, d = 0.6 } = props;
  const shape = new THREE.Shape();
  [
    [0, 0],
    [0, h],
    [(w - m) / 2, h],
    [(w - n) / 2, d + n], // ?
    [(w - n) / 2, d],
    [(w + n) / 2, d],
    [(w + n) / 2, d + n], // ?
    [(w + m) / 2, h],
    [w, h],
    [w, 0]
  ].forEach(([x=0, y=0]) => shape.lineTo(x, y));
  const matrix4 = new THREE.Matrix4().makeTranslation(-0.5, -0.5, -0.5);
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeConfig);
  return geometry.applyMatrix4(matrix4);
}
