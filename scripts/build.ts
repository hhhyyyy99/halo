import {
    filterFnForNotLegalPackageDir,
    filterEntryPointFile,
    filterNormalFiles,
    getPackages,
} from "./packages";
import child_process from "child_process";
import {DEFAULT_BUILD_DIR, DEFAULT_PACKAGES_DIR} from "./constant";
import {Dirent} from "fs-extra";

function getLegalPackages() {
    return filterNormalFiles(getPackages()) // 过滤掉普通文件
        .filter(filterFnForNotLegalPackageDir) // 过滤掉目录下不存在package.json文件
        .filter((dirent: Dirent) => filterEntryPointFile(dirent)); // 过滤掉不存在 src/requestMethodDecoratorFactory.ts 文件的包
}

/**
 * @xxx
 *
 * 使用child_process.spawn替换child_process.execSync
 * 1. execSync会阻塞主线程
 * 2. execSync会将所有输出都缓存到内存中，如果输出过大，会导致内存溢出
 * 3. spawn可以实时输出
 */
function startBuildTask(packageDir: string) {
    child_process.execSync(`pnpm run build:rollup --bundleConfigAsCjs --environment PACKAGE_DIR:${packageDir}`,)
}
function cleanOldResources(packageDir: string) {
    child_process.execSync(`rm -rf ${DEFAULT_PACKAGES_DIR}/${packageDir}/${DEFAULT_BUILD_DIR}/*`,)
}

function build() {
    const legalPackages = getLegalPackages();

    for (const legalPackageDir of legalPackages) {
        cleanOldResources(legalPackageDir.name);
        startBuildTask(legalPackageDir.name);
    }
}

// 指定进行单个包的构建
const argv = process.argv.slice(2) || [];
const packageDir = argv[0];
console.log(argv, packageDir);

const parseResult = includePackageName(packageDir);

if(!parseResult.status) {
    console.error("packageDir is required");
}

if (packageDir && parseResult.status) {
    console.log(`开始构建${packageDir}包`);
    cleanOldResources(parseResult.value);
    startBuildTask(parseResult.value);
} else {
    console.log("开始构建所有包");
    build();
}

function includePackageName(packageDir: string) {
    if(!packageDir) {
        console.error("packageDir is required");
        return {
            status: false,
            value: ""
        };
    }
    const splitPackageDir = packageDir.split("=");
    if(splitPackageDir.length !== 2) {
        console.error("packageDir format is error");
        return {
            status: false,
            value: ""
        }
    }
    const [key, value] = splitPackageDir;
    if(key !== "--pkg") {
        console.error("packageDir format is error");
        return {
            status: false,
            value: ""
        }
    }
    return {
        status: true,
        value
    };
}