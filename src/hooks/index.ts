import { useSpring } from "@react-spring/three";
import { useGesture as use } from "@use-gesture/react";
import { useState, useEffect } from "react";
import { GeometryController } from "./GeometryController";
import { GesturesController } from "./GesturesController";

export function useGeometry() {
  const callback = useState([])[1];
  const [ctrl] = useState(new GeometryController(callback));
  useEffect(() => ctrl.effect.bind(ctrl)());
  useEffect(() => ctrl.clean.bind(ctrl), [ctrl]);
  return [ctrl.state, ctrl.bind.bind(ctrl)] as any[];
}

export function useGestures() {
  const [ctrl] = useState(new GesturesController());
  const [spring, set] = useSpring(() => ctrl.state);
  return [spring, use(ctrl.bind(set))] as any[];
}
