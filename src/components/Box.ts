import { ReactNode } from "react";
import styled from "styled-components";
import { withCursorAttrs, withBoxAttrs } from "./attrs"

export type BoxProps = Partial<{
  key: string;
  children: ReactNode;
  /**
   * withBoxAttrs
   */
  file: string;
  text: string;
  mesh: string;
  href: string;
  items: string;
  label: string;
  input: string;
  select: string;
  /**
   * stylings
   */
  $sm: boolean;
  $cp: boolean;
  $i: string;
  $j: string;
}>;


export const Box = styled.span.attrs(withCursorAttrs).attrs(withBoxAttrs)<
  BoxProps
>`
  width: auto;
  height: auto;
  border: initial;
  background: white;
  display: flex;
  outline: none;
  align-items: center;
  text-overflow: ellipsis;
  vertical-align: middle;
  justify-content: center;
  text-align: center;
  font-size: ${({ $sm }) => ($sm ? "3.5mm" : "5mm")};
  ${({ $cp }) => $cp && `cursor: pointer;`}
  ${({ $j }) => $j && `grid-row: ${$j};`}
  ${({ $i }) => $i && `grid-column: ${$i};`}
`;
