import chalk from '@umijs/deps/compiled/chalk';
import path from 'path';
import { appRoot } from './constants';

function getShortName(file: string, root: string) {
  return file.startsWith(root + '/') ? path.posix.relative(root, file) : file;
}

export function handleHMRUpdate(opts: { file: string; ws: any }) {
  const { file, ws } = opts;
  const shortFile = getShortName(file, appRoot);
  const timestamp = Date.now();

  console.log(`[file change] ${chalk.dim(shortFile)}`);
  let updates;
  if (shortFile.endsWith('.css')) {
    updates = [
      {
        type: 'js-update',
        timestamp,
        path: `/${shortFile}`,
        acceptedPath: `/${shortFile}`,
      },
    ];
  }

  ws.send({
    type: 'update',
    updates,
  });
}
