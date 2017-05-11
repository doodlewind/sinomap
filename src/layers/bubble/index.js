import { drawBubble, findBubble } from './utils'
import base from './conf'

export default class BubbleLayer {
  constructor (conf) {
    this.drawBubble = drawBubble.bind(this)
    this.findBubble = findBubble.bind(this)

    this.conf = Object.assign({}, base, conf)
    this.conf.data = this.conf.data.map((d, i) =>
      Object.assign(d, { id: i })
    )
    this.hoverId = null
  }
  afterMapDraw (map) {
    let data = this.conf.data
    let convert = map.utils.convert
    let bubbles = data.map(bubble =>
      Object.assign(bubble, { point: convert(bubble.coordinate) })
    )

    let mouseOnMap = false
    bubbles.forEach(bubble => {
      if (this.drawBubble(map, bubble)) {
        mouseOnMap = true
      }
    })
    // 光标不在地图上但存在 hoverId 时
    // 表示此次渲染时光标离开地图
    if (!mouseOnMap && this.hoverId !== null) {
      this.onBubbleLeave(this.hoverId)
      this.hoverId = null
    }
  }
  onBubbleEnter (id) {
    let bubble = this.findBubble(id)
    this.conf.onBubbleEnter(bubble)
  }
  onBubbleLeave (id) {
    let bubble = this.findBubble(id)
    this.conf.onBubbleLeave(bubble)
  }
}

if (typeof module !== 'undefined') module.exports = BubbleLayer
