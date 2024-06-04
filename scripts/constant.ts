import path from 'path';

const ROOT_DIR = path.resolve(__dirname, '..');
/**
 * 构建时默认从哪个目录获取子包
 */
export const DEFAULT_PACKAGES_DIR = path.resolve(ROOT_DIR, 'packages');
export const DEFAULT_ROLLUP_BUILD_DIR = path.resolve(__dirname, 'packages');

/**
 * 子包的产物输出到哪个目录
 */
export const DEFAULT_BUILD_DIR = 'dist';
export const DEFAULT_ENTRY_DIR = 'src';

/**
 * template 目录
 */
export const DEFAULT_TEMPLATE_DIR = path.resolve(ROOT_DIR, "template");

