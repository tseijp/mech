import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { useUnitAttrs, useGridAttrs, useThemeAttrs } from "./attrs"

export type GridProps = Partial<{
  children: ReactNode;
  margin: string;
  theme: any; // wrap use ThemeProvider if use
  _: string;
  $w: string; // width style
  $h: string; // height style
  $i: string; // grid col style
  $j: string; // grid row style
  $b: boolean; // border if true
  $mm: boolean; // px to mm if true
  $top: boolean; // top style if true
}>;

export const Grid = styled.div
    .attrs(useUnitAttrs)
    .attrs(useGridAttrs)
    .attrs(useThemeAttrs)<GridProps>`
  margin: auto;
  display: grid;
  max-width: 100%;
  grid-auto-flow: column;
  ${({ $j }) => $j && `grid-template-rows: ${$j};`}
  ${({ $i }) => $i && `grid-template-columns: ${$i};`}
  ${topStyle}
  ${borderStyle}
  @media screen and (max-width: 175mm) {
    display: ${({ $b }) => ($b ? "none" : "flex")};
    flex-direction: column;
  }
`;

function topStyle(props: GridProps) {
  const { $top, margin, theme } = props
  return $top && css`
    ${css({margin})}
    top: 0;
    left: 0;
    width: calc(100% - 2 * ${margin});
    height: calc(100% - 2 * ${margin});
    border: medium solid ${theme.isDarkMode? "#e2e2e2": "#000"};
    position: fixed;
    cursor: crosshair;
  `
}

function borderStyle (props: GridProps) {
  const { $b, theme } = props;
  return $b && css`
    cursor: auto;
    margin: auto 0 0 auto;
    grid-gap: 0.5mm;
    transition: 0.5s;
    background: ${theme.isDarkMode? "#e2e2e2": "#000"};
    border-top: medium solid ${theme.isDarkMode? "#e2e2e2": "#000"};
    border-left: medium solid ${theme.isDarkMode? "#e2e2e2": "#000"};
  `
}
