import { join } from 'path';

// 应用根路径，临时写死
export const appRoot = join(__dirname, '../examples/react-ts');

// optmize 预编译依赖的缓存路径
export const cache = join(appRoot, 'src', '.cache');
