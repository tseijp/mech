import { createElement as el } from 'react'
import styled, { css } from "styled-components";

export const Wrap = styled.section<any>`
  ${({ margin }) => css({ margin })}
  border: medium solid #000;
  top: 0;
  left: 0;
  width: calc(100% - 2 * ${({margin}) => margin});
  height: calc(100% - 2 * ${({margin}) => margin});
  position: fixed;
  padding: 0;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  cursor: crosshair;
`;

export const Grid = styled.section
    .attrs(withUnitAttrs)
    .attrs(withGridAttrs)`
  margin: auto;
  display: grid;
  max-width: 100%;
  grid-auto-flow: column;
  ${({ row }) => row && `grid-template-rows: ${row};`}
  ${({ col }) => col && `grid-template-columns: ${col};`}
  ${({ w, h, _ }) => css({ width: w + _, height: h + _ })}
  ${({ b }) => b && css`
    cursor: auto;
    margin: auto 0 0 auto;
    grid-gap: 0.5mm;
    background: black;
    border-left: medium solid #000;
    border-top: medium solid #000;
  `}
  @media screen and (max-width: ${({ w, _ }) => w + _}) {
    display: ${({ b }) => b? 'none': 'auto'};
    grid-template-rows: repeat(4, 1fr);
  }
`;

export const Box = styled.span
    .attrs(withBoxAttrs)
    .attrs(withCursorAttrs)`
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
  font-size: ${({ small }) => small ? "3.5mm" : "5mm"};
  ${({ row }) => row && `grid-row: ${row};`}
  ${({ col }) => col && `grid-column: ${col};`}
  ${({cursor}) => cursor && css({cursor})}
`;

function withUnitAttrs (props: any) {
  props._ = props.mm ? "mm" : "";
  return props;
}

function withGridAttrs (props: any) {
  const { row, col, _ } = props;
  if (row) props.row = row.split(" ").join(_ + " ") + _;
  if (col) props.col = col.split(" ").join(_ + " ") + _;
  return props;
}

function withBoxAttrs (props: any) {
  const { file, text, mesh, label, input, ...other } = props;
  if (input) return { ...other, as: "input", defaultValue: input };
  if (text) return { ...other, as: "div", children: props.text };
  if (mesh) return { ...other, as: "div", children: props.mesh };
  if (file) {
    other.htmlFor = file;
    other.hidden = true;
    other.type = 'file';
    other.key= 'file'
    return { id: file, as: "label", children: [el('input', other), file] };
  }
  return other;
}

function withCursorAttrs(props: any) {
  const { file, mesh } = props
  if (file || mesh) props.cursor = 'pointer'
  return props
}
