import { Plugin } from 'esbuild';
import { extname } from 'path';
import { appRoot } from './constants';

export function esbuildDepPlugin(deps: Record<string, string>): Plugin {
  return {
    name: 'dep-pre-bundle',
    setup(build) {
      build.onResolve(
        { filter: /^[\w@][^:]/ },
        async ({ path: id, importer, kind, resolveDir }) => {
          const isEntry = !importer;
          if (id in deps) {
            return isEntry
              ? { path: id, namespace: 'dep' }
              : { path: deps[id] };
          } else {
            return {};
          }
        },
      );

      // @ts-ignore
      build.onLoad({ filter: /.*/, namespace: 'dep' }, ({ path: id }) => {
        let contents: string = '';
        contents += `import d from "${deps[id]}";export default d;\n`;
        contents += `export * from "${deps[id]}";\n`;

        let loader = extname(deps[id]).slice(1);
        if (loader === 'mjs') {
          loader = 'js';
        }

        return {
          loader,
          contents,
          resolveDir: appRoot,
        };
      });
    },
  };
}
