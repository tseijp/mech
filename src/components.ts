import { ReactNode, createElement as el } from "react";
import styled, { css } from "styled-components";

export const Wrap = styled.section<any>`
  ${({ margin }) => css({ margin })}
  border: medium solid #000;
  top: 0;
  left: 0;
  width: calc(100% - 2 * ${({ margin }) => margin});
  height: calc(100% - 2 * ${({ margin }) => margin});
  position: fixed;
  padding: 0;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  cursor: crosshair;
`;

export type GridProps = Partial<{
  children: ReactNode;
  _: string;
  $w: string;
  $h: string;
  $b: boolean;
  $mm: boolean;
  $row: string;
  $col: string;
}>;

function withUnitAttrs(props: GridProps) {
  props._ = props.$mm ? "mm" : "";
  return props;
}

function withGridAttrs(props: GridProps) {
  const { $row, $col, _ } = props;
  if ($row) props.$row = $row.split(" ").join(_ + " ") + _;
  if ($col) props.$col = $col.split(" ").join(_ + " ") + _;
  return props;
}

export const Grid = styled.section.attrs(withUnitAttrs).attrs(withGridAttrs)<
  GridProps
>`
  margin: auto;
  display: grid;
  max-width: 100%;
  grid-auto-flow: column;
  ${({ $row }) => $row && `grid-template-rows: ${$row};`}
  ${({ $col }) => $col && `grid-template-columns: ${$col};`}
  ${({ $b }) =>
    $b &&
    css`
      cursor: auto;
      margin: auto 0 0 auto;
      grid-gap: 0.5mm;
      background: black;
      border-left: medium solid #000;
      border-top: medium solid #000;
    `}
  ${({ $w = "", $h = "", _ = "" }) => css({ width: $w + _, height: $h + _ })}
  @media screen and (max-width: ${({ $w = "", _ = "" }) => $w + _}) {
    display: ${({ $b }) => ($b ? "none" : "auto")};
    grid-template-rows: repeat(4, 1fr);
  }
`;

export type BoxProps = Partial<{
  key: string;
  children: ReactNode;
  /**
   * withBoxAttrs
   */
  file: string;
  text: string;
  mesh: string;
  label: string;
  input: string;
  select: string;
  items: string;
  /**
   * stylings
   */
  $sm: boolean;
  $cp: boolean;
  $col: string;
  $row: string;
}>;

function withCursorAttrs(props: BoxProps) {
  const { file, mesh } = props;
  if (file || mesh) props.$cp = true;
  return props;
}

function withBoxAttrs(props: BoxProps) {
  const { file, text, mesh, label, input, select, ...other } = props;
  if (input) return { ...other, as: "input", defaultValue: input };
  if (text) return { ...other, as: "div", children: props.text };
  if (mesh) return { ...other, as: "div", children: props.mesh };
  if (select) return {};
  if (!file) return other;
  const config = { htmlFor: file, hidden: true, type: "file", key: file };
  return { id: file, as: "label", children: [el("input", config), file] };
}

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
  justify-content: center;
  vertical-align: middle;
  text-align: center;
  font-size: ${({ $sm }) => ($sm ? "3.5mm" : "5mm")};
  ${({ $cp }) => $cp && `cursor: pointer;`}
  ${({ $row }) => $row && `grid-row: ${$row};`}
  ${({ $col }) => $col && `grid-column: ${$col};`}
`;
