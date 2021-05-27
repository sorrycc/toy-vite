export function transformCSS(opts: { path: string; code: string }): string {
  return `
const id = "${opts.path}";
const css = "${opts.code.replace(/\n/g, '')}";

const style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.innerHTML = css;
document.head.appendChild(style);
  `.trim();
}
