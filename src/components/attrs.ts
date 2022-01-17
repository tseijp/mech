import { createElement as el } from "react";
import { ThemeProvider } from "styled-components";
/**
 * for Box Attrs
 */
export function useBoxAttrs<T extends object>(props: T): T

export function useBoxAttrs(props: any) {
  const { $to, type, children: id } = props;
  if ($to) props.onClick = () => void window.open($to, '_blank')
  if (!props.onChange) return props;
  const config = { type, hidden: true, htmlFor: id, key: id } as any;
  return { as: "label", children: [el("input", config), id], id };
}

export function useCursorAttrs<T extends object>(props: T): T

export function useCursorAttrs(props: any) {
  const { $to, onClick, onChange } = props;
  if ($to || onClick || onChange) props.$cp = true;
  return props;
}

/**
 * for Grid Attrs
 */
export function useGridAttrs<T extends object>(props: T): T

export function useGridAttrs(props: any) {
  const { $j, $i, _ } = props;
  if ($j) props.$j = $j.split(" ").join(_ + " ") + _;
  if ($i) props.$i = $i.split(" ").join(_ + " ") + _;
  return props;
}

export function useUnitAttrs<T extends object>(props: T): T

export function useUnitAttrs(props: any) {
 props._ = props.$mm ? "mm" : "";
 return props;
}

export function useThemeAttrs<T extends object>(props: T): T

export function useThemeAttrs(props: any) {
  const { theme, children, ...other } = props;
  if (!theme) return props;
  other.children = el(ThemeProvider, {theme}, children);
  return other
}
