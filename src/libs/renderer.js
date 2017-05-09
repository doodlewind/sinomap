import { getRenderConf, getPoints } from './coordinate-utils'

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
    this.mouseX = (e.clientX - box.left) * this.mapCanvas.width / box.width
    this.mouseY = (e.clientY - box.top) * this.mapCanvas.height / box.height
    this.update()
  })
}

function drawHoverArea (ctx, points, hoverColor) {
  ctx.fillStyle = hoverColor
  drawPath(ctx, points)
}

// 根据区域地形及参数绘制 canvas
function drawSubArea (arr, areaProps, {
    offsetX, offsetY, minX, minY, areaScale
  } = {}) {
  let points = getPoints(arr, {
    minX, minY, offsetX, offsetY, areaScale, height: this.height
  })
  this.ctx.fillStyle = this.style.color
  this.ctx.strokeStyle = this.style.borderColor
  drawPath(this.ctx, points)
  this.ctx.stroke()

  if (this.ctx.isPointInPath(this.mouseX, this.mouseY)) {
    drawHoverArea(this.ctx, points, this.style.hoverColor)
  }

  let afterSubArea = this.layer.afterSubArea
  if (afterSubArea) {
    this.layer.afterSubArea(this, points, areaProps)
  }
}

// 由 [[x, y]...] 坐标数组绘制单个 Path
export function drawPath (ctx, points) {
  points.forEach((p, i) => {
    let [x, y] = [points[i][0], points[i][1]]
    if (i === 0) ctx.beginPath()
    ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fill()
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
  this.utils = { drawPath }
  target.appendChild(this.mapCanvas)
  initListener.bind(this)(this.mapCanvas)
}

export function renderMap () {
  let conf = getRenderConf(this.area, this.width, this.height)

  this.area.features.forEach(subArea => {
    if (subArea.geometry.type === 'Polygon') {
      subArea.geometry.coordinates.forEach(arr =>
        drawSubArea.bind(this)(
          arr, subArea.properties, conf
        )
      )
    } else {
      subArea.geometry.coordinates.forEach(s =>
        s.forEach(arr =>
          drawSubArea.bind(this)(
            arr, subArea.properties, conf
          )
        )
      )
    }
  })
}
