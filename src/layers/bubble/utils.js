export function drawBubble (ctx, point, size, color) {
  let [x, y] = point
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, size, 0, 2 * Math.PI)
  ctx.fill()
}
