import styled, { css } from "styled-components";

export type WrapProps = Partial<{
    margin: string;
    padding: string;
    $d: boolean // darkmode
}>

export const Wrap = styled.section<any>`
  ${({ margin, padding }) => css({ margin, padding })}
  color: ${({ $d }) => $d? "#fff": "#000"};
  background: ${({$d}) => $d? "#000": "#fff"};
  border: medium solid #000;
  top: 0;
  left: 0;
  width: calc(100% - 2 * ${({ margin }) => margin});
  height: calc(100% - 2 * ${({ margin }) => margin});
  position: fixed;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  cursor: crosshair;
`;
