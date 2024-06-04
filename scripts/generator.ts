import fs from "fs";
import path from "path";
import ejs from "ejs";
import {DEFAULT_PACKAGES_DIR, DEFAULT_ENTRY_DIR, DEFAULT_TEMPLATE_DIR} from "./constant";

// 获取命令行参数
const args = process.argv.slice(2);

/**
 * 暂时只支持一个参数，包名称
 */
const name = args[0];

if (!name) {
    console.warn('缺少必要的包名，请检查命令行参数是否正确');
    process.exit(0);
}

/**
 * 创建新包
 */
createNewPackage(name);

function createNewPackage(name: string) {
    const packagePath = path.join(DEFAULT_PACKAGES_DIR, name);

    if (fs.existsSync(packagePath)) {
        console.warn('包已存在，请检查包名是否正确');
        process.exit(0);
    }

    fs.mkdirSync(packagePath);

    const sourcePath = path.join(packagePath, DEFAULT_ENTRY_DIR);
    fs.mkdirSync(sourcePath);

    /**
     * copy template/index.template.ts to packages/${name}/src/index.ts
     */
    fs.copyFileSync(path.join(DEFAULT_TEMPLATE_DIR, 'index.template.ts'), path.join(sourcePath, 'index.ts'));

    /**
     * Render package.json
     */
    const packageTemplate = fs.readFileSync(path.join(DEFAULT_TEMPLATE_DIR, 'package.template.json'), 'utf-8');
    const packageContent = renderTemplate(packageTemplate, {name});
    fs.writeFileSync(path.join(packagePath, 'package.json'), packageContent);

    /**
     * Render README.md
     */
    const readmeTemplate = fs.readFileSync(path.join(DEFAULT_TEMPLATE_DIR, 'README.template.md'), 'utf-8');
    const readmeContent = renderTemplate(readmeTemplate, {name});
    fs.writeFileSync(path.join(packagePath, 'README.md'), readmeContent);
}

function renderTemplate(template: string, options = {}) {
    return ejs.render(template, options);
}

export {}