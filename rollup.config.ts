import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-css-only";
import {dts} from "rollup-plugin-dts";
import {DEFAULT_BUILD_DIR, DEFAULT_ROLLUP_BUILD_DIR, DEFAULT_ENTRY_DIR} from "./scripts/constant";
import * as process from "process";

if(!process.env.PACKAGE_DIR) {
    throw new Error(`PACKAGE_DIR package must be specified via --environment flag.`);
}
function createPackageBuildConfig(packageDir: string) {
    const inputFilePath = `${DEFAULT_ROLLUP_BUILD_DIR}/${packageDir}/${DEFAULT_ENTRY_DIR}`;
    const outputFilePath = `${DEFAULT_ROLLUP_BUILD_DIR}/${packageDir}/${DEFAULT_BUILD_DIR}`
    return{
        input: `${inputFilePath}/index.ts`,
        output: [
            {
                file: `${outputFilePath}/index.umd.js`,
                format: 'umd',
                name: packageDir,
                exports: 'named',
            },
            {
                file: `${outputFilePath}/index.cjs.js`,
                format: 'cjs',
                exports: 'named',
            },
            {
                file: `${outputFilePath}/index.js`,
                format: 'esm',
                exports: 'named',
                name: packageDir,
            }
        ],
        plugins: [
            terser(),
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify('production'),
                '__buildDate__': JSON.stringify(new Date().toISOString()),
                '__version__': JSON.stringify(require('./package.json').version),
            }),
            typescript(),
            json(),
            commonjs(),
            resolve(),
            css({
                output: `index.css`,
            }),
        ],
    }
}
function createPackageDTSBuildConfig(packageName: string) {
    const inputFilePath = `${DEFAULT_ROLLUP_BUILD_DIR}/${packageName}/${DEFAULT_ENTRY_DIR}/index.ts`;
    const outputFilePath = `${DEFAULT_ROLLUP_BUILD_DIR}/${packageName}/${DEFAULT_BUILD_DIR}/index.d.ts`
    return {
        input: inputFilePath,
        output: {
            file: outputFilePath,
            format: 'es',
        },
        plugins: [dts()]
    }
}

export default [
    createPackageBuildConfig(process.env.PACKAGE_DIR),
    createPackageDTSBuildConfig(process.env.PACKAGE_DIR)
]