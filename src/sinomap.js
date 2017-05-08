import { renderMap } from './libs/renderer'

export default class Sinomap {
  constructor ({
      width = 1000,
      height = 600,
      area = null,
      style = {}
    } = {}) {
    this.width = width
    this.height = height
    this.style = style
    this.area = area
    this.renderMap = renderMap

    this.renderMap()
  }
}

if (typeof module !== 'undefined') window.Sinomap = Sinomap
