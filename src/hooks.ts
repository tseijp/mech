/**
 * ref: https://github.com/mrdoob/three.js/blob/master/editor/js/Loader.js#L65
 */
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useState, useEffect } from "react";

type Fun = (...args: any[]) => void
const Loaders = { STLLoader, OBJLoader, GLTFLoader, DRACOLoader }
const loadErrorMessage = "Load Error: This file is not supported by Loaders";

export function useGeometry (props: any = {}) {
    const callback = useState([])[1]
    const [ctrl] = useState(new GeometryController(callback))
    useEffect(() => ctrl.effect.bind(ctrl)())
    useEffect(() => ctrl.clean.bind(ctrl), [ctrl])
    return ctrl.apply(props)
}

export class GeometryController {
  callback: Fun = ()=>{}
  manager: any
  props: any = {}
  state: any = {}

  constructor (callback: Fun = ()=>{}) {
    this.callback = callback
    this.state.geometry = defaultGeometry()
    this.bind = this.bind.bind(this)
  }

  apply (props: any) {
    this.props = props
    return [this.state, this.bind.bind(this)]
  }

  effect () {
    const { state: $ } = this
    if (!$.target || !$.changed) return
    this.compute()
  }

  clean () {}

  compute () {
    const { state: $ } = this

    $.changed = false
    $.file = $.target.files[0] || {}
    $.name = $.file.name || ''
    $.type = $.name.split('.').slice(-1)[0] || '';
    $.Loader = (Loaders as any)[$.type.toUpperCase() + 'Loader']
    if (!$.Loader) return console.warn(loadErrorMessage)
    $.reader = new FileReader()
    $.loader = new $.Loader()
    $.reader.addEventListener('progress', this.progress.bind(this))
    $.reader.addEventListener('load', this.load.bind(this))
    $.reader.readAsArrayBuffer( $.file );

  }

  progress (e: any) {
    const { state: $ } = this
    $.size = '(' + ~~Math.floor( e.total / 1000 ) + ' KB)';
    $.progress = Math.floor( ( e.loaded / e.total ) * 100 ) + '%';
  }

  async load (e: any) {
    const { state: $ } = this
    $.result = e.target.result;
    $.geometry = $.loader.parse($.result)
    $.geometry.center()
    $.max = $.geometry.boundingBox.max
    $.min = $.geometry.boundingBox.min
    $.width = $.max.x - $.min.x
    $.height = $.max.y - $.min.y
    $.depth = $.max.z - $.min.z
    $.scale = 1 / Math.max($.width, $.height, $.depth)
    $.geometry.scale($.scale, $.scale, $.scale)
    this.callback([])
  }

  change (e: any) {
    this.state.changed = true
    this.state.target = e.target
    this.callback([])
  }

  bind () {
    return {onChange: this.change.bind(this)}
  }
}

function defaultGeometry (props: any = {}) {
  const { w = 1, h = 1, m = 0.76, n = 0.06, d = 0.6 } = props;
  const shape = new THREE.Shape();
  [
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
  ].forEach(([x=0, y=0]) => shape.lineTo(x, y));
  const matrix4 = new THREE.Matrix4().makeTranslation(-0.5, -0.5, -0.5);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    steps: 1,
    depth: 1,
    bevelEnabled: false
  });
  return geometry.applyMatrix4(matrix4);
}
