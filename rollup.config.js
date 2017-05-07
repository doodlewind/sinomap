import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const plugins = [json(), babel()]
if (process.env.NODE_ENV === 'production') plugins.push(uglify())

export default({
  entry: 'src/sinomap.js',
  moduleName: 'sinomap',
  format: 'iife',
  plugins: plugins,
  dest: 'dist/sinomap.js'
})
