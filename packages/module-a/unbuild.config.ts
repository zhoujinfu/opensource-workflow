import { defineBuildConfig } from 'unbuild'
import pkg from './package.json'

const externals = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

export default defineBuildConfig({
  entries: [
    './src/index',
  ],
  externals,
  declaration: true,
  rollup: {
    cjsBridge: true,
    resolve: {
      preferBuiltins: true,
    },
    esbuild: {
      target: 'node14',
    },
    dts: {
      respectExternal: true,
    },
  },
})
