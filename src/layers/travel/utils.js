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
