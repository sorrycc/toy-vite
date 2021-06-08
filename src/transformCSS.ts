export function transformCSS(opts: { path: string; code: string }): string {
  return `
import { createHotContext as __vite__createHotContext } from "/@vite/client";
import.meta.hot = __vite__createHotContext("${opts.path}");
import { updateStyle, removeStyle } from "/@vite/client"
  
const id = "${opts.path}";
const css = "${opts.code.replace(/\n/g, '')}";

updateStyle(id, css);
import.meta.hot.accept();
export default css;
import.meta.hot.prune(() => removeStyle(id));
  `.trim();
}
