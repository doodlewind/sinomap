import { drawArea, getThresholds } from './utils'

// hack 用户回调参数
function onEnter (name, value) {
  // console.log(name, value)
}
function onLeave (name) {
  // console.log(name)
}

export default class ChoroplethLayer {
  constructor (conf) {
    this.color = conf.color || 'cyan'
    this.level = conf.level || 5
    this.data = conf.data || []
    this.thresholds = getThresholds(this.data, this.level)
    this.drawArea = drawArea.bind(this)
    this.onEnter = onEnter.bind(this)
    this.onLeave = onLeave.bind(this)
  }
  beforeArea () {

  }
  afterDrawArea (map, points, areaProps) {
    this.drawArea(map, points, areaProps)
  }
  afterArea () {

  }
}
