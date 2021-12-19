import { useSpring } from "@react-spring/three";
import { useGesture } from "@use-gesture/react";
import { useState, useEffect } from "react";
import { GeometryController } from "./GeometryController";
import { GestureController } from "./GestureController";

export function useGeometry(props: any = {}) {
  const callback = useState([])[1];
  const [ctrl] = useState(new GeometryController(callback));
  useEffect(() => ctrl.effect.bind(ctrl)());
  useEffect(() => ctrl.clean.bind(ctrl), [ctrl]);
  return ctrl.apply(props);
}

export function useGestures(props: any = {}) {
  const [ctrl] = useState(new GestureController());
  const [spring, api] = useSpring(() => ctrl.state);
  return [spring, useGesture(ctrl.apply(props, api.start.bind(api)))] as any[];
}
