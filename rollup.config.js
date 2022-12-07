import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

import { createRequire } from "module";
const pkg = createRequire(import.meta.url)("./package.json");

const name = pkg.main.replace(/\.c?js$/, "");

/** @type {(config: import('rollup').RollupOptions) => import('rollup').RollupOptions} */
const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: `${name}.cjs`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `${name}.mjs`,
        format: "es",
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: "es",
    },
  }),
];
