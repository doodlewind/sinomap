import { initMap, renderMap } from './libs/renderer'
import base from './libs/base-conf'

export default class Sinomap {
  constructor (conf) {
    this.init(conf)
    this.update()
    return this
  }
  init (conf) {
    // 初始化配置参数
    conf.style = Object.assign({}, base.style, conf.style)
    conf = Object.assign({}, base, conf)
    Object.keys(conf).forEach(key => {
      this[key] = conf[key]
    })
    // 由配置参数初始化地图
    initMap.bind(this)()
  }
  update () {
    renderMap.bind(this)()
  }
}
