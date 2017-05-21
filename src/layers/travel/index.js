export default class TravelLayer {
  constructor (conf) {
    console.log(conf)
    this.animate = false
  }
  afterMapDraw (map) {
    map.ctx.fillStyle = 'red'
    map.ctx.fillRect(0, 0, 10, 10)
  }
}

if (typeof module !== 'undefined') module.exports = TravelLayer
