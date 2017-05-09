import { initMap, renderMap } from './libs/renderer'
import base from './libs/base-conf'

// todo 添加独立 layer 打包入口
import ChoroplethLayer from '../layers/choropleth/index'
import population from '../resources/china-population.json'
const layer = new ChoroplethLayer({
  data: population
})

export default class Sinomap {
  constructor (conf) {
    this.init(conf)
    this.update()
  }
  init (conf) {
    // 初始化配置参数
    conf.style = Object.assign({}, base.style, conf.style)
    conf = Object.assign({}, base, conf)
    Object.keys(conf).forEach(key => {
      this[key] = conf[key]
    })
    // hack
    this.layer = layer
    // 由配置参数初始化地图
    initMap.bind(this)()
  }
  update () {
    renderMap.bind(this)()
  }
}
