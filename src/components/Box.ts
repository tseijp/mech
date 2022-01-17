import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { useCursorAttrs, useBoxAttrs } from "./attrs"

export type BoxProps = Partial<{
  children: ReactNode;
  key: string
  $rt: boolean // raw text if true
  $sm: boolean // text small if true
  $cp: boolean // cursor pointer if true
  $to: string // link to open new tab
  $as: string // values of select options
  $i: string
  $j: string
}>


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
  ${({ $cp }) => $cp && css`
    cursor: pointer;
    text-decoration: underline;
  `}
  ${({ $j }) => $j && `grid-row: ${$j};`}
  ${({ $i }) => $i && `grid-column: ${$i};`}
`;
