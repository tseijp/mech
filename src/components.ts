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

export const Grid = styled.section.attrs(withUnitAttrs)`
  display: grid;
  grid-gap: 0.5mm;
  grid-template-rows: ${({ row, _ }) => row?.split(" ").join(_ + " ") + _};
  grid-template-columns: ${({ col, _ }) => col?.split(" ").join(_ + " ") + _};
  ${({ w, h, _ }) => css({ width: w + _, height: h + _ })}
  margin: ${({ b }) => b ? `auto 0 0 auto` : `auto`};
  ${({ b }) => b && css`
    background: black;
    cursor: auto;
    border-left: medium solid #000;
    border-top: medium solid #000;
  `}
  @media screen and (max-width: ${({ w, _ }) => w + _}) {
    display: none;
  }
`;

export const Box = styled.span.attrs(withBoxAttrs)`
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
  ${({ col }) => col && `grid-column: ${col};`}
  ${({ row }) => row && `grid-row: ${row};`};
  ${({ file }) => file && `cursor: pointer;`}
`;

function withUnitAttrs (props: any) {
  props._ = props.mm ? "mm" : "";
  return props;
}

function withBoxAttrs (props: any) {
  const { file, text, label, input, ...other } = props;
  if (input) return { ...other, as: "input", defaultValue: input };
  if (text) return { ...other, as: "div", children: props.text };
  if (file) {
    other.htmlFor = file;
    other.hidden = true;
    other.type = 'file';
    return { id: file, as: "label", children: el('input', other) };
  }
  return other;
}
