import { createGlobalStyle } from "styled-components";
import { animated, useSpring } from 'react-spring'
export * from "./attrs";
export * from "./Box";
export * from "./Grid";

export const Style = createGlobalStyle<{$d: boolean}>`body {
  user-select: none;
  color: ${({ $d }) => $d? "#e2e2e2": "#000"};
  background: ${({ $d }) => $d? "#222933": "#fff"};
}`

export function Symbol (props: any) {
  const {r1, r2, t, ...spring} = useSpring({
    reverse: props.$d,
    from: {r1: 10, r2: 20, t: "scale(0.9)", stroke: "#e2e2e2", strokeDashoffset: 67.5},
    to: {r1: 20, r2: 10, t: "scale(0.8)", stroke: "#000", strokeDashoffset: 17.5},
  })
  return (
    <animated.svg viewBox="0 0 100 50" style={{transform: t}}>
      <animated.g {...spring} fill="none" strokeWidth="2">
        <polygon points="55,15 85,5 85,45 55,35" />
        <animated.circle cx="25" cy="25" r={r1} />
        <animated.circle cx="25" cy="25" r={r2} />
      </animated.g>
      <animated.g {...spring} strokeDasharray="35,5,5,5" strokeWidth="2">
        <line x1="0" y1="25" x2="100" y2="25" />
        <line x1="25" y1="0" x2="25" y2="50" />
      </animated.g>
    </animated.svg>
  )
}
