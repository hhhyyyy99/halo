import fsExtra, {Dirent} from "fs-extra";
import { DEFAULT_PACKAGES_DIR, DEFAULT_ENTRY_DIR } from "./constant";
import path from "path";

export function getPackagesAsync(packageDirPath: string = DEFAULT_PACKAGES_DIR) {
    return new Promise((resolve, reject) => {
        fsExtra.readdir(packageDirPath, (err:any, files:string[]) => {
            if (err) {reject(err);}
            else {resolve(files);}
        })
    })
}

export function getPackages(
    packageDirname: string = DEFAULT_PACKAGES_DIR,
    options: { encoding?: string | null | undefined; withFileTypes?: true } = {},
) {
    return fsExtra.readdirSync(packageDirname, {
        ...options,
        withFileTypes: true,
        encoding: 'utf-8',
    })
}

export function isLegalPackageDir(dirent: Dirent) {
    return dirent.isDirectory() && checkPackageJSONFile(dirent);
}

export function filterFnForNotLegalPackageDir(dirent: Dirent) {
    return isLegalPackageDir(dirent);
}

export function filterNormalFiles(dirents: Dirent[]) {
    return dirents.filter(dirent => dirent.isDirectory());
}

export function checkPackageJSONFile(packageNameDirent: Dirent, parentPath: string = DEFAULT_PACKAGES_DIR) {
    return fsExtra.existsSync(path.join(parentPath, packageNameDirent.name, 'package.json'));
}

export function filterEntryPointFile(packageNameDirent: Dirent, parentPath: string = DEFAULT_PACKAGES_DIR) {
    return fsExtra.existsSync(path.join(parentPath, packageNameDirent.name, DEFAULT_ENTRY_DIR, 'index.ts'));
}

/**
 * 检查目录下存在rollup.config.js 或 rollup.config.ts 文件
 * 如果存在认为需要自行rollup打包
 */
export function checkRollupConfigFile(packageNameDirent: Dirent, parentPath: string = DEFAULT_PACKAGES_DIR) {
    return fsExtra.pathExistsSync(path.join(parentPath, packageNameDirent.name, 'rollup.config.js')) ||
        fsExtra.pathExistsSync(path.join(parentPath, packageNameDirent.name, 'rollup.config.ts'));
}