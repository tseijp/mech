import { ReactNode } from "react";
import styled from "styled-components";
import { useCursorAttrs, useBoxAttrs } from "./attrs"

export type BoxProps = Partial<{
  key: string;
  children: ReactNode;
  /**
   * useBoxAttrs
   */
  file: string;
  text: string;
  href: string;
  items: string;
  label: string;
  select: string;
  /**
   * stylings
   */
  $rt: boolean; // raw text if true
  $sm: boolean; // text small if true
  $cp: boolean; // cursor pointer if true
  $i: string;
  $j: string;
}>;


export const Box = styled.div
    .attrs(useCursorAttrs)
    .attrs(useBoxAttrs)<BoxProps>`
  width: auto;
  height: auto;
  border: initial;
  display: flex;
  outline: none;
  align-items: center;
  text-overflow: ellipsis;
  vertical-align: middle;
  justify-content: center;
  text-align: center;
  background: ${({theme}) => theme.isDarkMode? "#222933": "#fff"};
  font-size: ${({ $sm }) => ($sm ? "3.5mm" : "5mm")};
  ${({ $cp }) => $cp && `
    cursor: pointer;
    text-decoration: underline;
  `}
  ${({ $j }) => $j && `grid-row: ${$j};`}
  ${({ $i }) => $i && `grid-column: ${$i};`}
`;
