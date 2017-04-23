const radius = 6378137
const max = 85.0511287798
const radians = Math.PI / 180

export function mercator (longitude, latitude) {
  let x = radius * longitude * radians
  let y = Math.max(Math.min(max, latitude), -max) * radians
  y = radius * Math.log(Math.tan((Math.PI / 4) + (y / 2)))
  // hack
  x /= 20000
  y /= 20000
  return { x, y }
}
