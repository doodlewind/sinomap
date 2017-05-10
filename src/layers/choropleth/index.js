import { drawChoropleth, getThresholds, findValue } from './utils'
import base from './conf'

export default class ChoroplethLayer {
  constructor (conf) {
    this.conf = Object.assign({}, base, conf)
    this.thresholds = getThresholds(this.conf.data, this.conf.level)
    this.drawChoropleth = drawChoropleth.bind(this)
  }
  onEnterArea (map, areaProps) {
    let value = findValue(areaProps.name, this.conf.data)
    this.conf.onEnterArea({
      name: areaProps.name,
      cp: areaProps.cp,
      value: value
    })
  }
  onLeaveArea (map, areaProps) {
    let value = findValue(areaProps.name, this.conf.data)
    this.conf.onLeaveArea({
      name: areaProps.name,
      cp: areaProps.cp,
      value: value
    })
  }
  // hover 时叠加浅色遮罩
  onHoverArea (map, points, areaProps) {
    map.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    map.utils.drawPath(map.ctx, points)
  }
  afterDrawArea (map, points, areaProps) {
    this.drawChoropleth(map, points, areaProps)
  }
}
