const radius = 6378137
const max = 85.0511287798
const radians = Math.PI / 180

// 由经纬度返回笛卡尔坐标系下的 x, y 投影
export function mercator (longitude, latitude) {
  let x = radius * longitude * radians
  let y = Math.max(Math.min(max, latitude), -max) * radians
  y = radius * Math.log(Math.tan((Math.PI / 4) + (y / 2)))
  return [x, y]
}

function getAllCoordinates (geoJSON) {
  let coordinates = []
  geoJSON.features.forEach(feature => {
    if (feature.geometry.type === 'Polygon') {
      feature.geometry.coordinates.forEach(shapeArr => {
        coordinates = coordinates.concat(
          shapeArr.map(x => mercator(x[0], x[1]))
        )
      })
    } else {
      feature.geometry.coordinates.forEach(shapes => {
        shapes.forEach(shapeArr => {
          coordinates = coordinates.concat(
            shapeArr.map(x => mercator(x[0], x[1]))
          )
        })
      })
    }
  })
  return coordinates
}

// 返回 [[x, y]...] 二维数组区域宽高及该区域相对 [0, 0] 的偏移
function getAreaInfo (arr) {
  let xMin = arr.reduce((a, b) => a[0] < b[0] ? a : b)[0]
  let xMax = arr.reduce((a, b) => a[0] > b[0] ? a : b)[0]
  let yMin = arr.reduce((a, b) => a[1] < b[1] ? a : b)[1]
  let yMax = arr.reduce((a, b) => a[1] > b[1] ? a : b)[1]
  return { w: xMax - xMin, h: yMax - yMin, dX: xMin, dY: yMin }
}

// 输入源区域宽高
// 根据源区域比例及目标区域宽高
// 返回源映射至目标时的缩放参数与 x y 偏移量
function getScaleArgs ([srcW, srcH], [boundW, boundH]) {
  // 根据二者比例判断缩放后应填满目标区域 x 轴还是 y 轴
  let isFillX = ((srcW / srcH) / (boundW / boundH)) > 1
  let scale = isFillX ? boundW / srcW : boundH / srcH

  let offsetX = isFillX ? 0 : (boundW - srcW * scale) / 2
  let offsetY = !isFillX ? 0 : (boundH - srcH * scale) / 2

  return [offsetX, offsetY, scale]
}

export function transform (geoJSON, boundW, boundH) {
  let coordinates = getAllCoordinates(geoJSON)
  let src = getAreaInfo(coordinates)
  let [offsetX, offsetY, scale] = getScaleArgs(
    [src.w, src.h],
    [boundW, boundH]
  )
  let areaInfo = getAreaInfo(coordinates)
  return {
    offsetX,
    offsetY,
    scale,
    dX: areaInfo.dX,
    dY: areaInfo.dY
  }
}

// 返回移动 [[x, y]...] 二维数组区域至原点的新数组
export function moveToOrigin (args, arr) {
  return arr.map(p => [p[0] - args.dX, p[1] - args.dY])
}
