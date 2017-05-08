import { renderMap } from './libs/renderer'

export default class Sinomap {
  constructor ({
      width = 1000,
      height = 600,
      geoJSON = null
    } = {}) {
    this.width = width
    this.height = height
    this.geoJSON = geoJSON
    this.renderMap = renderMap

    this.renderMap()
  }
}

if (typeof module !== 'undefined') window.Sinomap = Sinomap
