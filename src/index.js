import { renderMap } from './libs/renderer'

if (typeof module !== 'undefined') module.exports = { renderMap }
else window.renderMap = renderMap
