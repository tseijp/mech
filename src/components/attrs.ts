import { createElement as el } from "react";
import { ThemeProvider } from "styled-components";
/**
 * for Box Attrs
 */
export function useBoxAttrs<T extends object>(props: T): T

export function useBoxAttrs(props: any) {
  const { select, href, file, ...other } = props;
  if (select) return other; // TODO
  if (href) return { onClick: () => window.open(href, '_blank'), ...other }
  if (!file) return other;
  const config = { htmlFor: file, hidden: true, type: "file", key: file };
  return { id: file, as: "label", children: [el("input", config), file] };
}

export function useCursorAttrs<T extends object>(props: T): T

export function useCursorAttrs(props: any) {
  const { file, href, mesh } = props;
  if (file || mesh || href) props.$cp = true;
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
  other.children = el(ThemeProvider, {theme}, children)
  return other
}
