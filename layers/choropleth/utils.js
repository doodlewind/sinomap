// 根据 areaInfo 名称查找相应数据值
function findValue (name, data) {
  let result = null
  data.forEach(d => {
    if (d.name === name) result = d.value
  })
  return result
}

// 根据阈值及数据值返回相应颜色
function getColor (thresholds, value) {
  let len = thresholds.length
  let maskArr = thresholds.map((t, i) => (len - i) * (1 / len))
  for (let i = 0; i < thresholds.length; i++) {
    if (value <= thresholds[i]) {
      return `rgba(255, 255, 255, ${maskArr[i] - 0.1})`
    }
  }
}

// 根据 level 层数获得步长
// 并由此返回 data 的相应阈值
// 如 level 为 4 时即返回形如 [123, 234, 345]
export function getThresholds (data, level) {
  let tmpData = data.map(d => d.value)
  tmpData.sort((a, b) => a > b ? 1 : -1)
  let step = Math.floor(tmpData.length / level)
  // 步长小于 1 时阈值数组长度与原数组相同
  return step <= 1
    ? tmpData
    : Array.from(new Array(level - 1))
        .map((x, i) => tmpData[step * (i + 1)])
}

export function drawSubArea (map, points, areaProps) {
  let value = parseInt(findValue(areaProps.name, this.data))
  if (!value) return

  // 绘制底色
  map.ctx.fillStyle = this.color
  map.utils.drawPath(map.ctx, points)

  // 根据数据值返回遮罩颜色
  map.ctx.fillStyle = getColor(this.thresholds, value)
  map.utils.drawPath(map.ctx, points)
}
