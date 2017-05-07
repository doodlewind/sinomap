import { renderMap } from './libs/renderer'

export default class Sinomap {
  constructor (conf) {
    this.conf = conf
    renderMap(this.conf)
  }
}

if (typeof module !== 'undefined') window.Sinomap = Sinomap
