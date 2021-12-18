type Fun = (...args: any[]) => void
const { round, PI } = Math

export class GestureController {
  props: any = {}
  state: any = {}
  set: Fun=()=>{}

  constructor () {
    this.state = {rotation: [0, 0, 0], scale: [1, 1, 1]}
  }

  apply (props: any, set: Fun) {
    const gestures: any = {}
    this.props = props
    this.set = set
    gestures.onDrag = this.drag.bind(this)
    gestures.onWheel = this.wheel.bind(this)
    return gestures
  }

  drag (state: any) {
    const { state: $ } = this
    const {movement: [mx, my], first, last, args: [i]} = state
    $.weight = PI / 360
    $.step = PI / 2
    $.dx = [0, my, my][i] * $.weight
    $.dy = [mx, 0, mx][i] * $.weight
    $.dz =-[my, mx, 0][i] * $.weight
    if (first)
        $.rx = $.ry = $.rz = 0
    if (last) {
        $.rx = round($.dx / $.step) * $.step
        $.ry = round($.dy / $.step) * $.step
        $.rz = round($.dz / $.step) * $.step
        this.set({rotation: [$.rx, $.ry, $.rz]})
    }
    else this.set({rotation: [$.rx + $.dx, $.ry + $.dy, $.rx + $.dz]})
  }

  wheel (state: any) {
    const { state: $ } = this
    const { offset: [, y] } = state
    $.s = 1 + y / 1000
    this.set({scale: [$.s, $.s, $.s]})
  }
}
