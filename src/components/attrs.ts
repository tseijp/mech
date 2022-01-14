import { createElement as el } from "react";

/**
 * for Box Attrs
 */
export function withBoxAttrs<T extends object>(props: T): T

export function withBoxAttrs(props: any) {
  const { file, text, mesh, label, href, input, select, ...other } = props;
  if (input) return { as: "input", defaultValue: input, ...other };
  if (text) return { as: "div", children: props.text, ...other };
  if (mesh) return { ...other, as: "div", children: props.mesh, ...other };
  if (href) return { ...other, as: "a", href, children: document.title, target:"_blank", ...other }
  if (select) return {};
  if (!file) return other;
  const config = { htmlFor: file, hidden: true, type: "file", key: file };
  return { id: file, as: "label", children: [el("input", config), file] };
}

export function withCursorAttrs<T extends object>(props: T): T

export function withCursorAttrs(props: any) {
  const { file, mesh } = props;
  if (file || mesh) props.$cp = true;
  return props;
}

/**
 * for Grid Attrs
 */
export function withGridAttrs<T extends object>(props: T): T

export function withGridAttrs(props: any) {
  const { $j, $i, _ } = props;
  if ($j) props.$j = $j.split(" ").join(_ + " ") + _;
  if ($i) props.$i = $i.split(" ").join(_ + " ") + _;
  return props;
}

export function withUnitAttrs<T extends object>(props: T): T

export function withUnitAttrs(props: any) {
 props._ = props.$mm ? "mm" : "";
 return props;
}
