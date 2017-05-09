// hack 用户回调参数
function onEnter (name, value) {
  // console.log(name, value)
}
function onLeave (name) {
  // console.log(name)
}

export default class ChoroplethLayer {
  constructor () {
    this.color = 'red'
    this.data = [
      { name: '福建', value: 123 }
    ]
    this.onEnter = onEnter.bind(this)
    this.onLeave = onLeave.bind(this)
  }
  beforeArea () {

  }
  afterSubArea (map, points, areaProps) {
    if (areaProps.name === this.data[0].name) {
      map.ctx.fillStyle = this.color
      map.utils.drawPath(map.ctx, points)
    }
  }
  afterArea () {

  }
}
