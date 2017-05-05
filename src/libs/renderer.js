import { transform, moveToOrigin } from './utils'
import china from '../resources/china.json'

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
    width = 0,
    height = 0,
    xOff = 0,
    yOff = 0,
    xMin = 0,
    yMin = 0,
    scale = 20000,
    color = '#ddd'
  } = {}) {
  let _arr = moveToOrigin(xMin, yMin, arr)
  ctx.fillStyle = color
  for (let i = 0; i < _arr.length; i++) {
    let [x, y] = [_arr[i][0], _arr[i][1]]
    if (i === 0) ctx.beginPath()
    ctx.lineTo(x * scale + xOff, height - y * scale - yOff)
  }
  ctx.closePath()
  ctx.fill()
}

export function renderMap (args) {
  const map = initMap(args)
  const ctx = map.getContext('2d')
  let mapArgs = transform(china, args.width, args.height)

  const conf = {
    width: args.width,
    height: args.height,
    xOff: mapArgs.offsetX,
    yOff: mapArgs.offsetY,
    xMin: mapArgs.xMin,
    yMin: mapArgs.yMin,
    scale: mapArgs.scale
  }

  china.features.forEach(province => {
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
  return Object.assign({}, args, { ctx })
}
