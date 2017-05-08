import { transform, moveToOrigin } from './coordinate-utils'

function getScaleFactor () {
  if (!('devicePixelRatio' in window)) return 1
  return window.devicePixelRatio > 1
    ? window.devicePixelRatio : 1
}

function createCanvas (width, height) {
  const canvas = document.createElement('canvas')
  let scaleFactor = getScaleFactor()

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
    // console.log(this.mouseX, this.mouseY)
    this.update()
  })
}

// mock
function mockColor () {
  const rnd = () => parseInt(Math.random() * 255).toString(16)
  return '#' + rnd() + rnd() + rnd()
}

function draw (ctx, arr, {
    width, height, xOff, yOff, xMin, yMin, scale,
    style = {}
  } = {}) {
  let _arr = moveToOrigin(xMin, yMin, arr)
  // mock
  // ctx.fillStyle = style.color
  ctx.fillStyle = mockColor()
  ctx.strokeStyle = style.borderColor
  for (let i = 0; i < _arr.length; i++) {
    let [x, y] = [_arr[i][0], _arr[i][1]]
    if (i === 0) ctx.beginPath()
    ctx.lineTo(x * scale + xOff, height - y * scale - yOff)
  }
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

export function initMap (el, width, height) {
  const target = typeof this.el === 'string'
    ? document.querySelector(this.el) : this.el
  if (!target) throw new Error('[Sinomap] Target element not found.')

  this.mapCanvas = createCanvas(this.width, this.height)
  this.ctx = this.mapCanvas.getContext('2d')
  target.appendChild(this.mapCanvas)
  initListener.bind(this)(this.mapCanvas)
}

export function renderMap () {
  let mapArgs = transform(this.area, this.width, this.height)

  const conf = {
    width: this.width,
    height: this.height,
    style: this.style,
    xOff: mapArgs.offsetX,
    yOff: mapArgs.offsetY,
    xMin: mapArgs.xMin,
    yMin: mapArgs.yMin,
    scale: mapArgs.scale
  }

  this.area.features.forEach(subArea => {
    if (subArea.geometry.type === 'Polygon') {
      subArea.geometry.coordinates.forEach(shapeArr => {
        draw(this.ctx, shapeArr, conf)
      })
    } else {
      subArea.geometry.coordinates.forEach(shapes => {
        shapes.forEach(shapeArr => {
          draw(this.ctx, shapeArr, conf)
        })
      })
    }
  })
  return this
}
