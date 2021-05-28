import chokidar from '@umijs/deps/reexported/chokidar';
import { appRoot } from './constants';

export function watch() {
  const watcher = chokidar.watch(appRoot, {
    ignored: ['**/node_modules/**', '**/.git/**'],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    disableGlobbing: true,
  });
  watcher;

  return watcher;
}
