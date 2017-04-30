const radius = 6378137
const max = 85.0511287798
const radians = Math.PI / 180

export function mercator (longitude, latitude) {
  let x = radius * longitude * radians
  let y = Math.max(Math.min(max, latitude), -max) * radians
  y = radius * Math.log(Math.tan((Math.PI / 4) + (y / 2)))
  return [x, y]
}

export function fitSize (width, height) {
  let xOff, yOff, scale
  let base = Math.min(width, height)
  scale = base * 20 * Math.pow((600 / base), 2)
  xOff = -(width / 2) + 970
  yOff = (height / 2) + 380
  return { xOff, yOff, scale }
}
