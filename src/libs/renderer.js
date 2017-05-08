import { transform, moveToOrigin } from './utils'

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

function initMap ({
    el = '#map',
    width = 1000,
    height = 600
  } = {}) {
  const target = document.querySelector(el)
  const map = createCanvas(width, height)
  target.appendChild(map)
  return map
}

function rndColor () {
  let r = parseInt(Math.random() * 10000) % 256
  let g = parseInt(Math.random() * 10000) % 256
  let b = parseInt(Math.random() * 10000) % 256
  return '#' + [r, g, b].map(x => x.toString(16)).join('')
}

function draw (ctx, arr, {
    width, height, xOff, yOff, xMin, yMin, scale,
    style = {}
  } = {}) {
  let _arr = moveToOrigin(xMin, yMin, arr)
  ctx.fillStyle = style.color
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

export function renderMap () {
  const map = initMap({ width: this.width, height: this.height })
  const ctx = map.getContext('2d')
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

  this.area.features.forEach(province => {
    conf.color = rndColor()
    if (province.geometry.type === 'Polygon') {
      province.geometry.coordinates.forEach(shapeArr => {
        draw(ctx, shapeArr, conf)
      })
    } else {
      province.geometry.coordinates.forEach(shapes => {
        shapes.forEach(shapeArr => {
          draw(ctx, shapeArr, conf)
        })
      })
    }
  })
  return this
}
