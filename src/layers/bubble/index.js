import { drawBubble } from './utils'
import base from './conf'

export default class BubbleLayer {
  constructor (conf) {
    this.conf = Object.assign({}, base, conf)
  }
  afterMapDraw (map) {
    let data = this.conf.data
    let convert = map.utils.convert
    let bubbles = data.map(({ name, coordinate, size }) =>
      ({ name, size, point: convert(coordinate) })
    )  
    bubbles.forEach(bubble =>
      drawBubble(map.ctx, bubble.point, bubble.size, this.conf.color)
    )
  }
}
