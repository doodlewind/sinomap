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
    initMap.bind(this)()
  }
  update () {
    renderMap.bind(this)()
  }
}
