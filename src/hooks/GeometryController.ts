import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

type Fun = (...args: any[]) => void;
const loadErrorMessage = "Load Error: This file is not supported.";
const Loaders = { STLLoader, OBJLoader, FBXLoader, GLTFLoader };
const Parsers = {
    STL: (e: any, _: any) => {
        const geometry = _.parse?.(e.target.result)
        const material = new THREE.MeshStandardMaterial();
        return new THREE.Mesh(geometry, material)
    },
    // TODO merge geometries from Group
    OBJ: (e: any, _: any) => _.parse?.(e.target.result),
    FBX: (e: any, _: any) => _.parse?.(e.target.result),
    // TODO merge geometries from Scenes
    GLTF: (e: any, _: any) => {
        const scene = _.parse?.(e.target.result)
        return scene
    }
}

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
  isChanged: boolean // effect if true
  isMesh: boolean // using material if true
  name: string // filename
  type: string // filetype such as STL, FBX, OBJ
  size: string
  pbar: string
  key: string
  min: number
  max: number
  width: number
  height: number
  depth: number
  scale: number
  target?: any
  reader?: FileReader
  loader?: STLLoader | OBJLoader | FBXLoader | GLTFLoader
  parser?: (event: Event, loader: any) => THREE.Mesh
  mesh?: THREE.Mesh
  geometry?: THREE.BufferGeometry
  material?: THREE.Material | THREE.Material[]
}>

export class GeometryController {
  callback: Fun = () => {};
  state: GeometryState = {};

  constructor(callback: Fun = () => {}) {
    this.callback = callback;
    this.state.geometry = defaultGeometry();
  }

  /**
   * Event Hanlders
   */
  bind(_: any) {
    if (_.type === "mesh") _.onClick = _.onDoubleClick = this.click.bind(this);
    if (_.type === "file") _.onChange = this.change.bind(this);
    return _
  }

  change(e: any) {
    this.state.isChanged = true;
    this.state.target = e.target;
    this.callback([]);
  }

  click() {
    this.state.isMesh = !this.state.isMesh;
    this.callback([]);
  }

  /**
   * process each or once render
   */
  effect() {
    const { state: $ } = this;
    if (!this.state.isChanged) return;
    if(!$.target?.files)
      return console.warn("Event Target Files " + loadErrorMessage);
    const file = $.target.files[0];
    $.isChanged = false;
    this.setup(file.name);
    $.reader?.readAsArrayBuffer(file);
  }

  clean() {
    const { state: $ } = this;
    // this.setup();
    return () => {
      if (Array.isArray($.material))
          $.material.forEach(m => m?.dispose())
      else $.material?.dispose()
      $.geometry?.dispose();
    }
  }

  /**
   * Load file
   */
  setup(filename="") {
    const { state: $ } = this;
    $.name = filename || "";
    $.type = $.name!.split(".").slice(-1)[0].toUpperCase() || "";
    $.key = $.type + "Loader" as keyof (typeof Loaders);
    const FileLoader = (Loaders as any)[$.key];
    if (!FileLoader) return console.warn("File " + loadErrorMessage);
    $.reader = new FileReader();
    $.loader = new FileLoader();
    $.parser = Parsers[$.type as keyof (typeof Parsers)];
    $.reader.addEventListener("progress", this.progress.bind(this));
    $.reader.addEventListener("load", this.load.bind(this));
  }

  progress(e: any) {
    const { state: $ } = this;
    $.size = "(" + ~~Math.floor(e.total / 1000) + " KB)";
    $.pbar = Math.floor((e.loaded / e.total) * 100) + "%";
  }

  load(e: any) {
    const { state: $ } = this;
    $.mesh = $.parser?.(e, $.loader);
    if (!$.mesh) return console.warn("Parsed Mesh " + loadErrorMessage);
    if (!$.mesh.geometry) return console.warn("Parsed Geometry " + loadErrorMessage);
    this.geometry = $.mesh.geometry || $.geometry;
    this.callback([]);
  }

  set geometry(geometry: THREE.BufferGeometry) {
    const { state: $ } = this;
    geometry.center?.(); // "center" effect to set geoemtry boundingBox
    $.geometry = geometry;
    if (!geometry.boundingBox) return;
    const { min, max } = geometry.boundingBox!;
    $.width = max.x - min.x;
    $.height = max.y - min.y;
    $.depth = max.z - min.z;
    $.scale = Math.max($.width, $.height, $.depth);
    $.geometry.scale(1 / $.scale, 1 / $.scale, 1 / $.scale);
  }
}
