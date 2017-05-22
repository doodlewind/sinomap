import base from './conf'
import {
  drawCircle,
  drawLine,
  drawBezier
} from './utils'

export default class TravelLayer {
  constructor (conf) {
    this.conf = Object.assign({}, base, conf)
    this.animate = false
  }
  afterMapDraw (map) {
    map.ctx.fillStyle = 'red'
    this.conf.data.forEach(line => {
      const [fromX, fromY] = map.utils.convert(line.from.coordinate)
      const [toX, toY] = map.utils.convert(line.to.coordinate)
      drawCircle(map.ctx, fromX, fromY, line.from.size)
      drawCircle(map.ctx, toX, toY, line.to.size)

      map.ctx.strokeStyle = 'blue'
      drawLine(map.ctx, fromX, fromY, toX, toY)
      drawBezier(
        map.ctx,
        [20, 20],
        [40, 60],
        [100, 100]
      )
    })
  }
}

if (typeof module !== 'undefined') module.exports = TravelLayer
