import { initMap } from './utils'
import { mercator } from './projection'
import china from '../resources/china.json'

const map = initMap()
const ctx = map.getContext('2d')

function rndColor () {
  let r = parseInt(Math.random() * 10000) % 256
  let g = parseInt(Math.random() * 10000) % 256
  let b = parseInt(Math.random() * 10000) % 256
  return '#' + [r, g, b].map(x => x.toString(16)).join('')
}

function drawPolygon (ctx, arr, color) {
  let beginPoint = mercator(arr[0][0], arr[0][1])
  // hack
  beginPoint.x = beginPoint.x - 200
  beginPoint.y = 600 - beginPoint.y - 200

  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(beginPoint.x, beginPoint.y)

  arr.forEach((position, i) => {
    if (i === 0) return
    let point = mercator(position[0], position[1])
    // hack
    point.x = point.x - 200
    point.y = 600 - point.y - 200
    ctx.lineTo(point.x, point.y)
  })

  ctx.closePath()
  ctx.fill()
}

export function renderMap () {
  china.features.forEach((province, i) => {
    let color = rndColor()
    if (province.geometry.type === 'Polygon') {
      province.geometry.coordinates.forEach(shapeArr => {
        drawPolygon(ctx, shapeArr, color)
      })
    } else {
      province.geometry.coordinates.forEach(shapes => {
        shapes.forEach(shapeArr => {
          drawPolygon(ctx, shapeArr, color)
        })
      })
    }
  })
}
