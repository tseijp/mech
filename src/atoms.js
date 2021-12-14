import React from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { atom, useAtom } from "jotai";

const filesAtom = atom([]);

const geometryAtom = atom(defaltGeometry());

export function File(props) {
  const { htmlFor = "", ...other } = props;
  const [files, set] = useAtom(filesAtom);
  const onChange = (e) => set(Array.from(e.target.files));
  return (
    <div>
      <input hidden type="file" {...other} {...{ htmlFor, onChange }} />
      {files.length ? files.map((f) => f.name).join(", ") : htmlFor}
    </div>
  );
}

const loadErrorMessage = "Load Error: This file is not supported by Loaders";

const loadFunctions = {
  stl: (f, g) => g.push(new STLLoader(f.name)),
  obj: (f, g) => g.push(new OBJLoader(f.name)),
  glsl: (f, g) => g.push(new GLTFLoader(f.name)),
  draco: (f, g) => g.push(new DRACOLoader(f.name))
};

export function useGeometry() {
  const [files] = useAtom(filesAtom);
  const [g, set] = useAtom(geometryAtom);

  React.useEffect(() => {
    if (!files.length) return;
    const geometries = [];
    files.forEach((file) => {
      const ext = file.name.split(".").pop();
      const fun = loadFunctions[ext];
      if (!ext || !fun) return;
      fun(file, geometries);
    });
    if (geometries.length === 1) return set(geometries[0]);
    if (geometries.length <= 1) return console.error(loadErrorMessage);
    set(THREE.BufferGeometryUtils.mergeBufferGeometries(geometries));
  }, [files, set]);

  return g;
}

function defaltGeometry(props = {}) {
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
  ].forEach((pos) => shape.lineTo(...pos));
  const matrix4 = new THREE.Matrix4().makeTranslation(-0.5, -0.5, -0.5);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    steps: 1,
    depth: 1,
    bevelEnabled: false
  });
  return geometry.applyMatrix(matrix4);
}
