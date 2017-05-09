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
  let minX = arr.reduce((a, b) => a[0] < b[0] ? a : b)[0]
  let maxX = arr.reduce((a, b) => a[0] > b[0] ? a : b)[0]
  let minY = arr.reduce((a, b) => a[1] < b[1] ? a : b)[1]
  let maxY = arr.reduce((a, b) => a[1] > b[1] ? a : b)[1]
  return { w: maxX - minX, h: maxY - minY, minX, minY }
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

// 返回移动 [[x, y]...] 二维数组区域至原点的新数组
export function moveToOrigin (xMin, yMin, arr) {
  return arr.map(p => {
    let [x, y] = mercator(p[0], p[1])
    return [x - xMin, y - yMin]
  })
}

// 根据 geoJSON 及 canvas 宽高
// 返回 canvas 绘图所需坐标参数
export function getRenderConf (geoJSON, boundW, boundH) {
  let coordinates = getAllCoordinates(geoJSON)
  let areaInfo = getAreaInfo(coordinates)
  let [offsetX, offsetY, areaScale] = getScaleArgs(
    [areaInfo.w, areaInfo.h],
    [boundW, boundH]
  )
  return {
    offsetX,
    offsetY,
    minX: areaInfo.minX,
    minY: areaInfo.minY,
    areaScale
  }
}
