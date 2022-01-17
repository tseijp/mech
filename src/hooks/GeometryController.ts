import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

type Fun = (...args: any[]) => void;
const Loaders = { STLLoader, OBJLoader, GLTFLoader, DRACOLoader };
const loadErrorMessage = "Load Error: This file is not supported by Loaders";

function defaultGeometry(_: any = {}) {
  const shape = new THREE.Shape();
  const { w = 1, h = 1, m = 0.76, n = 0.06, d = 0.6 } = _;
  const points: number[][] = [
    [0, 0],
    [0, h],
    [(w - m) / 2, h],
    [(w - n) / 2, d + n],
    [(w - n) / 2, d],
    [(w + n) / 2, d],
    [(w + n) / 2, d + n],
    [(w + m) / 2, h],
    [w, h],
    [w, 0]
  ]
  points.forEach(([x, y]) => shape.lineTo(x, y));
  const extrudeSettings = { steps: 1, depth: 1, bevelEnabled: false };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const matrix4 = new THREE.Matrix4().makeTranslation(-0.5, -0.5, -0.5);
  return geometry.applyMatrix4(matrix4);
}

export type GeometryState =  Partial<{
  isMesh: boolean
  changed: boolean
  name: string
  type: string
  size: string
  pbar: string
  key: string
  min: number
  max: number
  width: number
  height: number
  depth: number
  scale: number
  reader?: FileReader;
  loader?: THREE.Loader;
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material;
}>

export class GeometryController {
  callback: Fun = () => {};
  state: GeometryState = {};
  target?: any;

  constructor(callback: Fun = () => {}) {
    this.callback = callback;
    this.state.geometry = defaultGeometry();
  }

  effect() {
    if (!this.target || !this.state.changed) return;
    this.compute();
  }

  clean() {
    this.state.material?.dispose();
    this.state.geometry?.dispose();
  }

  bind(_: any) {
    if (_.type === "mesh") _.onClick = _.onDoubleClick = this.click.bind(this);
    if (_.type === "file") _.onChange = this.change.bind(this);
    return _
  }

  change(e: any) {
    this.callback([]);
    this.state.changed = true;
    this.target = e.target;
  }

  click() {
    this.callback([]);
    this.state.isMesh = !this.state.isMesh;
  }

  select(e: any) {
    this.callback([]);
    console.log(e);
  }

  compute() {
    const { state: $ } = this;
    const file = this.target.files[0];
    $.changed = false;
    $.name = file.name || "";
    $.type = $.name!.split(".").slice(-1)[0] || "";
    $.key = $.type.toUpperCase() + "Loader" as keyof (typeof Loaders)

    const FileLoader = (Loaders as any)[$.key];
    if (!file || !FileLoader) return console.warn(loadErrorMessage);
    $.reader = new FileReader();
    $.loader = new FileLoader();
    $.reader.addEventListener("progress", this.progress.bind(this));
    $.reader.addEventListener("load", this.load.bind(this));
    $.reader.readAsArrayBuffer(file);
  }

  progress(e: any) {
    const { state: $ } = this;
    $.size = "(" + ~~Math.floor(e.total / 1000) + " KB)";
    $.pbar = Math.floor((e.loaded / e.total) * 100) + "%";
  }

  load(e: any) {
    this.callback([]);
    const { state: $ } = this;
    $.geometry = ($.loader as any).parse(e.target.result);
    if (!$.geometry) return
    $.geometry.center();
    const { min, max } = $.geometry.boundingBox!
    $.width = max.x - min.x;
    $.height = max.y - min.y;
    $.depth = max.z - min.z;
    $.scale = Math.max($.width, $.height, $.depth);
    $.geometry.scale(1 / $.scale, 1 / $.scale, 1 / $.scale);
  }
}
