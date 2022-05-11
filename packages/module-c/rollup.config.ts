import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import module from 'module'
import { defineConfig, RollupOptions } from 'rollup'

const require = module.createRequire(import.meta.url)
const pkg = require('./package.json')
const entries = {
  index: 'src/index.ts',
}

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

const plugins = [
  alias({
    entries: [
      { find: /^node:(.+)$/, replacement: '$1' },
    ],
  }),
  resolve({
    preferBuiltins: true,
  }),
  json(),
  commonjs(),
  esbuild({
    target: 'node14',
  }),
]

function onwarn(message: { code: string }) {
  if (message.code === 'EMPTY_BUNDLE')
    return
  console.error(message)
}

export default defineConfig([
  {
    input: entries,
    output: {
      dir: 'dist',
      format: 'esm',
      sourcemap: 'inline',
      entryFileNames: '[name].js',
      // Default: "[name]-[hash].js"
      chunkFileNames: '[name]-[hash].js',
    },
    external,
    plugins,
    onwarn,
  },
  {
    input: entries,
    output: {
      dir: 'dist',
      format: 'cjs',
      sourcemap: 'inline',
      entryFileNames: '[name].cjs',
      // Default: "[name]-[hash].js"
      chunkFileNames: '[name]-[hash].cjs',
    },
    external,
    plugins,
    onwarn,
  },
  {
    input: entries,
    output: {
      dir: 'dist',
      entryFileNames: '[name].d.ts',
      chunkFileNames: '[name].d.ts',
      format: 'esm',
    },
    external,
    plugins: [
      dts({ respectExternal: true }),
    ],
    onwarn,
  },
] as RollupOptions[])
