export default class BubbleLayer {
  constructor (conf) {
    this.conf = Object.assign({}, conf)
  }
  afterMapDraw () {
    console.log(123)
  }
}
