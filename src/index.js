import { renderMap } from './libs/renderer'

const sinomap = {
  init (args) {
    return renderMap(args)
  }
}

if (typeof module !== 'undefined') module.exports = sinomap
else window.sinomap = sinomap
