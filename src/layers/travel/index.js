import base from './conf'

export default class TravelLayer {
  constructor (conf) {
    this.conf = Object.assign({}, base, conf)
    this.animate = false
    console.log(this)
  }
  afterMapDraw (map) {
    map.ctx.fillStyle = 'red'
    map.ctx.fillRect(0, 0, 10, 10)
  }
}

if (typeof module !== 'undefined') module.exports = TravelLayer
