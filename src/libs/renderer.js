import { getRenderConf, moveToOrigin } from './coordinate-utils'

function getCanvasScale () {
  if (!('devicePixelRatio' in window)) return 1
  return window.devicePixelRatio > 1
    ? window.devicePixelRatio : 1
}

function createCanvas (width, height, scaleFactor) {
  const canvas = document.createElement('canvas')

  canvas.width = width * scaleFactor
  canvas.height = height * scaleFactor
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.getContext('2d').scale(scaleFactor, scaleFactor)
  return canvas
}

function initListener (canvas) {
  canvas.addEventListener('mousemove', e => {
    let box = this.mapCanvas.getBoundingClientRect()
    let x = e.clientX
    let y = e.clientY
    this.mouseX = (x - box.left) * this.mapCanvas.width / box.width
    this.mouseY = (y - box.top) * this.mapCanvas.height / box.height
    this.update()
  })
}

function drawSubArea (arr, {
    offsetX, offsetY, minX, minY, areaScale
  } = {}) {
  let _arr = moveToOrigin(minX, minY, arr)
  this.ctx.fillStyle = this.style.color
  this.ctx.strokeStyle = this.style.borderColor
  for (let i = 0; i < _arr.length; i++) {
    let [x, y] = [_arr[i][0], _arr[i][1]]
    if (i === 0) this.ctx.beginPath()
    this.ctx.lineTo(
      x * areaScale + offsetX,
      this.height - y * areaScale - offsetY
    )
  }
  this.ctx.closePath()
  this.ctx.fill()
  this.ctx.stroke()
  // todo
  // add hover style via this.mouseX and this.mouseY
}

export function initMap (el, width, height) {
  const target = typeof this.el === 'string'
    ? document.querySelector(this.el) : this.el
  if (!target) throw new Error('[Sinomap] Target element not found.')

  this.mouseX = 0
  this.mouseY = 0
  this.canvasScale = getCanvasScale()
  this.mapCanvas = createCanvas(this.width, this.height, this.canvasScale)
  this.ctx = this.mapCanvas.getContext('2d')
  target.appendChild(this.mapCanvas)
  initListener.bind(this)(this.mapCanvas)
}

export function renderMap () {
  let conf = getRenderConf(this.area, this.width, this.height)

  this.area.features.forEach(subArea => {
    if (subArea.geometry.type === 'Polygon') {
      subArea.geometry.coordinates.forEach(shapeArr =>
        drawSubArea.bind(this)(shapeArr, conf)
      )
    } else {
      subArea.geometry.coordinates.forEach(shapes =>
        shapes.forEach(shapeArr =>
          drawSubArea.bind(this)(shapeArr, conf)
        )
      )
    }
  })
  return this
}
