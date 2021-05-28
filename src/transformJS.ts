import { Loader, TransformResult, transformSync } from 'esbuild';
import { existsSync } from 'fs';
import { dirname, extname, join } from 'path';

export function transformCode(opts: { code: string; loader?: Loader }) {
  return transformSync(opts.code, {
    loader: opts.loader || 'ts',
    sourcemap: true,
    format: 'esm',
  });
}

export function transformJS(opts: {
  appRoot: string;
  path: string;
  code: string;
}): TransformResult {
  const ext = extname(opts.path).slice(1);
  const ret = transformCode({
    code: opts.code,
    loader: ext as Loader,
  });

  let { code } = ret;
  code = code.replace(
    /\bimport(?!\s+type)(?:[\w*{}\n\r\t, ]+from\s*)?\s*("([^"]+)"|('[^']+'))/gm,
    (a, b, c) => {
      let from: string;
      if (c.charAt(0) === '.') {
        from = join(dirname(opts.path), c);
        const filePath = join(opts.appRoot, from);
        if (!existsSync(filePath)) {
          if (existsSync(`${filePath}.tsx`)) {
            from = `${from}.tsx`;
          } else if (existsSync(`${filePath}.ts`)) {
            from = `${from}.ts`;
          }
        }
        if (['svg'].includes(extname(from).slice(1))) {
          from = `${from}?import`;
        }
      } else {
        from = `/src/.cache/${c}.js`;
      }

      // TODO: support cjs
      // if (c === 'react') {
      //   a = 'import cjsImport0_react from "react"; ';
      //   // a = a.replace()
      // }

      return a.replace(b, `"${from}"`);
    },
  );

  return {
    ...ret,
    code,
  };
}
