import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { withUnitAttrs, withGridAttrs } from "./attrs"

export type GridProps = Partial<{
  children: ReactNode;
  _: string;
  $w: string; // width style
  $h: string; // height style
  $i: string; // grid col style
  $j: string; // grid row style
  $b: boolean; // border if true
  $d: boolean; // dark mode if true
  $mm: boolean; // px to mm if true
}>;

export const Grid = styled.section
    .attrs(withUnitAttrs)
    .attrs(withGridAttrs)<GridProps>`
  margin: auto;
  display: grid;
  max-width: 100%;
  grid-auto-flow: column;
  ${({ $j }) => $j && `grid-template-rows: ${$j};`}
  ${({ $i }) => $i && `grid-template-columns: ${$i};`}
  ${({ $b, $d }) => $b && css`
      cursor: auto;
      margin: auto 0 0 auto;
      grid-gap: 0.5mm;
      background: ${$d? "#fff": "#000"};
      border-left: medium solid ${$d? "#fff": "#000"};
      border-top: medium solid ${$d? "#fff": "#000"};
  `}
  ${({ $w = "", $h = "", _ = "" }) => css({ width: $w + _, height: $h + _ })}
  @media screen and (max-width: ${({ $w = "", _ = "" }) => $w + _}) {
    display: ${({ $b }) => ($b ? "none" : "auto")};
    grid-template-rows: repeat(4, 1fr);
  }
`;
