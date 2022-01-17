const { round, PI } = Math;

type Fun = (...args: any[]) => void;
interface Lookup<T = any> {
  [key: string]: T
}

export type GesturesState = Partial<{
  weight: number
  step: number
  dx: number
  dy: number
  dz: number
  rx: number
  ry: number
  rz: number
  s: number
  rotation: [number, number, number]
  scale: [number, number, number]
}>

export class GesturesController {
  state: GesturesState = { rotation: [0, 0, 0], scale: [1, 1, 1] };
  dispatch: Fun = () => {};

  bind(dispatch: Fun) {
    this.dispatch = dispatch
    const gestures: Lookup = {};
    gestures.onDrag = this.drag.bind(this);
    gestures.onWheel = this.wheel.bind(this);
    return gestures;
  }

  drag(state: Lookup) {
    const { state: $ } = this;
    const {
      movement: [mx, my],
      first,
      last,
      args: [i]
    } = state;
    $.weight = PI / 360;
    $.step = PI / 2;
    $.dx = [0, my, my][i] * $.weight;
    $.dy = [mx, 0, mx][i] * $.weight;
    $.dz = -[my, mx, 0][i] * $.weight;
    if (first) $.rx = $.ry = $.rz = 0;
    if (last) {
      $.rx = round($.dx / $.step) * $.step;
      $.ry = round($.dy / $.step) * $.step;
      $.rz = round($.dz / $.step) * $.step;
      this.dispatch({ rotation: [$.rx, $.ry, $.rz] });
    } else this.dispatch({ rotation: [$.rx! + $.dx, $.ry! + $.dy, $.rx! + $.dz] });
  }

  wheel(state: Lookup) {
    const { state: $ } = this;
    const {
      offdispatch: [, y]
    } = state;
    $.s = 1 + y / 1000;
    this.dispatch({ scale: [$.s, $.s, $.s] });
  }
}
