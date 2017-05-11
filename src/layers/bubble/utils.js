export function findBubble (id) {
  let result = null
  this.conf.data.forEach(d => {
    if (d.id === id) result = d
  })
  return result
}

function drawCircle (ctx, x, y, r) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fill()
}

// todo 解决 bubble 重叠时的 hover 触发去重
export function drawBubble (map, bubble) {
  let [x, y] = bubble.point
  map.ctx.fillStyle = this.conf.color
  drawCircle(map.ctx, x, y, bubble.size)
  let isHover = map.ctx.isPointInPath(map.mouseX, map.mouseY)
  if (isHover) {
    // 处于 hover 状态时每次更新均需绘制高亮状态至 canvas
    map.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    drawCircle(map.ctx, x, y, bubble.size)

    let currId = this.findBubble(bubble.id).id
    // leave 与 enter 事件仅当变更 area 时触发
    if (this.hoverId !== currId) {
      if (this.hoverId !== null) {
        // 若 area 名称变更且原 hoverName 存在
        // 表示当前状态为离开原 area
        this.onBubbleLeave(this.hoverId)
      }
      this.onBubbleEnter(currId)
      this.hoverId = currId
    }
  }
  return isHover
}
