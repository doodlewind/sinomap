import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const plugins = [json(), babel()]
if (process.env.NODE_ENV === 'production') plugins.push(uglify())

// 根据 npm script 中通过 cross-env 设入的环境变量
// 区分打包路径
const bundleName = process.env.bundle
const bundleMapping = {
  sinomap: {
    entry: 'src/sinomap.js',
    moduleName: 'Sinomap',
    dest: 'dist/sinomap.js'
  },
  choropleth: {
    entry: 'src/layers/choropleth/index.js',
    moduleName: 'ChoroplethLayer',
    dest: 'dist/layers/choropleth.js'
  },
  bubble: {
    entry: 'src/layers/bubble/index.js',
    moduleName: 'BubbleLayer',
    dest: 'dist/layers/bubble.js'
  }
}

const baseConf = {
  format: 'iife',
  plugins: plugins
}

export default(Object.assign({}, baseConf, bundleMapping[bundleName]))
