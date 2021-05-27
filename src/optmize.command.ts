import { optmize } from './optmize';

(async () => {
  await optmize({
    pkgs: ['react', 'react-dom'],
  });
})();
