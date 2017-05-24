function getCtrlPoint ([x0, y0], [x1, y1], k = 1) {
  const r0 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2))
  const theta0 = x1 !== x0
    ? Math.atan((y1 - y0) / (x1 - x0))
    : Math.PI / 2
  const r1 = r0 / 2

  const theta1 = theta0 + Math.atan(Math.PI / 12 * k)
  return [r1 * Math.cos(theta1), r1 * Math.sin(theta1)]
}

export function getCurveArgs (line, convertFn, k = 1) {
  const p0 = convertFn(line.from.coordinate)
  const p2 = convertFn(line.to.coordinate)
  const p1 = getCtrlPoint(p0, p2)
  console.log(p0, p1, p2)
  line.points = [p0, p1, p2]
  return line
}

export function drawCircle (ctx, x, y, r) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fill()
}

export function getBezierByPercent (begin, ctrl, end, percent) {
  const x = Math.pow(1 - percent, 2) * begin[0] +
    2 * (1 - percent) * percent * ctrl[0] + Math.pow(percent, 2) * end[0]
  const y = Math.pow(1 - percent, 2) * begin[1] +
    2 * (1 - percent) * percent * ctrl[1] + Math.pow(percent, 2) * end[1]
  return [x, y]
}

export function drawBezier (ctx, [x0, y0], [x1, y1], [x2, y2]) {
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.quadraticCurveTo(x1, y1, x2, y2)
  ctx.stroke()
}

export function drawCurve (ctx, [x0, y0], [x1, y1], [x2, y2], count) {
  const percent = (count % 100) / 100
  const [x, y] = getBezierByPercent([x0, y0], [x1, y1], [x2, y2], percent)
  drawCircle(ctx, x, y, 2)
}
