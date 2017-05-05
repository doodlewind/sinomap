import { mercator, transform, moveToOrigin } from './utils'
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
    xOff = 0,
    yOff = 0,
    dX = 0,
    dY = 0,
    scale = 20000,
    color = '#ddd'
  } = {}) {
  let _arr = moveToOrigin({ dX, dY }, arr)
  console.log(dX, dY)
  ctx.fillStyle = color
  for (let i = 0; i < _arr.length; i++) {
    let [x, y] = [_arr[i][0], _arr[i][1]]
    // console.log(x, y)
    if (i === 0) {
      ctx.beginPath()
      // ctx.lineTo(x / scale - xOff, yOff - y / scale)
      ctx.lineTo(x, 100 - y)
    } else {
      // ctx.lineTo(x / scale - xOff, yOff - y / scale)
      ctx.lineTo(x, 100 - y)
    }
  }
  ctx.closePath()
  ctx.fill()
}

export function renderMap (args) {
  const map = initMap(args)
  const ctx = map.getContext('2d')
  // offsetX, offsetY, scale, dX, dY
  let mapArgs = transform(china, args.width, args.height)

  const conf = {
    xOff: mapArgs.offsetX,
    yOff: mapArgs.offsetY,
    dX: mapArgs.dX,
    dY: mapArgs.dY,
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
