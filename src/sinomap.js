import { initMap, renderMap } from './libs/renderer'

export default class Sinomap {
  constructor (conf) {
    Object.keys(conf).forEach(key => {
      this[key] = conf[key]
    })
    this.init()
    this.update()
    return this
  }
  init () {
    this.mouseX = 0
    this.mouseY = 0
    initMap.bind(this)()
  }
  update () {
    renderMap.bind(this)()
  }
}
