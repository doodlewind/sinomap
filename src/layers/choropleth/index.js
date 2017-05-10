import { drawChoropleth, getThresholds } from './utils'

export default class ChoroplethLayer {
  constructor (conf) {
    this.color = conf.color || 'cyan'
    this.level = conf.level || 5
    this.data = conf.data || []
    this.thresholds = getThresholds(this.data, this.level) || []
    this.drawChoropleth = drawChoropleth.bind(this)

    this.onEnterArea = conf.onEnter
      ? conf.onEnterArea.bind(this)
      : function () {}
    this.onLeaveArea = conf.onLeave
      ? conf.onLeaveArea.bind(this)
      : function () {}
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
