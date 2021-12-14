import React from "react";
import styled, { css } from "styled-components";
import { File } from "./atoms";

/**
 *  styling
 */
export const Wrap = styled.section`
  ${({ margin }) => css({ margin })}
  border: medium solid #000;
  top: 0;
  left: 0;
  width: calc(100% - 2 * ${(_) => _.margin});
  height: calc(100% - 2 * ${(_) => _.margin});
  position: fixed;
  padding: 0;
  display: flex;
  overflow: hidden;
  flex-direction: column;
`;

export const Grid = styled.section.attrs((props) => {
  props._ = props.mm ? "mm" : "";
  return props;
})`
  display: grid;
  grid-gap: 0.5mm;
  grid-template-rows: ${({ row, _ }) => row?.split(" ").join(_ + " ") + _};
  grid-template-columns: ${({ col, _ }) => col?.split(" ").join(_ + " ") + _};
  ${({ w, h, _ }) => css({ width: w + _, height: h + _ })}
  margin: ${({ b }) => (b ? `auto 0 0 auto` : `auto`)};
  ${({ b }) => {
    if (b)
      return css`
        background: black;
        border-left: medium solid #000;
        border-top: medium solid #000;
      `;
  }}
  @media screen and (max-width: ${({ w, _ }) => w + _}) {
    display: none;
  }
`;

export const Box = styled.span.attrs((props) => {
  const { file, text, label, input, ...other } = props;
  if (input) return { ...other, as: "input", defaultValue: input };
  if (text) return { ...other, as: "div", children: props.text };
  if (file)
    return {
      ...other,
      id: file,
      as: "label",
      children: <File htmlFor={file} />
    };
  return other;
})`
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
  font-size: ${({ small }) => (small ? "3.5mm" : "5mm")};
  ${({ col }) => col && `grid-column: ${col};`}
  ${({ row }) => row && `grid-row: ${row};`};
`;

export const handlers = { beforeCompile, coodDate };

function coodDate() {
  const date = new Date();
  return `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
}

function beforeCompile(shader) {
  shader.vertexShader = `
    varying float isDashed;
    ${shader.vertexShader}
  `.replace(
    `#include <fog_vertex>`,
    `#include <fog_vertex>
        vec3 nor1 = normalize(normalMatrix * normal);
        vec3 vDir = normalize(mvPosition.xyz);
        isDashed = step( 0., dot( vDir, nor1 ) );
    `
  );
  shader.fragmentShader = `
    varying float isDashed;
    ${shader.fragmentShader}
  `.replace(
    `if ( mod( vLineDistance, totalSize ) > dashSize ) {\n\t\tdiscard;\n\t}`,
    `if ( isDashed > 0.0 ) {
          if ( mod( vLineDistance, totalSize ) > dashSize ) {
            discard;
          }
        }`
  );
}
