export function drawLine (ctx, beginX, beginY, endX, endY) {
  ctx.beginPath()
  ctx.lineTo(beginX, beginY)
  ctx.lineTo(endX, endY)
  ctx.closePath()
  ctx.stroke()
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
  const [x, y] = getBezierByPercent([x0, y0], [x1, y1], [x2, y2], 0.5)
  drawCircle(ctx, x, y, 2)
}
