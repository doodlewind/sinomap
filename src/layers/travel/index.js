import base from './conf'
import {
  getCurveArgs,
  drawCircle,
  drawBezier,
  drawCurve
} from './utils'

export default class TravelLayer {
  constructor (conf) {
    this.conf = Object.assign({}, base, conf)
    // this.animate = true
    this.animate = false
    this.count = 0
  }
  afterMapDraw (map) {
    this.count++
    map.ctx.fillStyle = 'red'

    this.conf.data = this.conf.data.map(line =>
      getCurveArgs(line, map.utils.convert, 1)
    )
    this.conf.data.forEach(line => {
      const [fromX, fromY] = map.utils.convert(line.from.coordinate)
      const [toX, toY] = map.utils.convert(line.to.coordinate)
      drawCircle(map.ctx, fromX, fromY, line.from.size)
      drawCircle(map.ctx, toX, toY, line.to.size)
      map.ctx.strokeStyle = 'blue'
      drawBezier(
        map.ctx,
        line.points[0],
        line.points[1],
        line.points[2]
      )
      drawCurve(
        map.ctx,
        line.points[0],
        line.points[1],
        line.points[2],
        this.count
      )
    })
  }
}

if (typeof module !== 'undefined') module.exports = TravelLayer
