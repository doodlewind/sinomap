/* eslint-disable no-unused-vars */
const rndPoint = () => [
  parseInt(Math.random() * 100),
  parseInt(Math.random() * 100)
]

let rndArr = Array.from(new Array(5)).map(x => rndPoint())

// 返回 [[x, y]...] 二维数组区域宽高及该区域相对 [0, 0] 的偏移
function getBound (arr) {
  let xMin = arr.reduce((a, b) => a[0] < b[0] ? a : b)[0]
  let xMax = arr.reduce((a, b) => a[0] > b[0] ? a : b)[0]
  let yMin = arr.reduce((a, b) => a[1] < b[1] ? a : b)[1]
  let yMax = arr.reduce((a, b) => a[1] > b[1] ? a : b)[1]
  return { w: xMax - xMin, h: yMax - yMin, dX: xMin, dY: yMin }
}

// 返回移动 [[x, y]...] 二维数组区域至原点的新数组
function moveToOrigin (arr) {
  let args = getBound(arr)
  return arr.map(p => [p[0] - args.dX, p[1] - args.dY])
}

// 输入源区域宽高
// 根据源区域比例及目标区域宽高
// 返回源映射至目标时的缩放参数与 x y 偏移量
function getScaleArgs ([srcW, srcH], [boundW, boundH]) {
  // 根据二者比例
  // 判断缩放后应填满目标区域 x 轴还是 y 轴
  let isFillX = ((srcW / srcH) / (boundW / boundH)) > 1
  let scale = isFillX ? boundW / srcW : boundH / srcH

  let xOffset = isFillX ? 0 : (boundW - srcW * scale) / 2
  let yOffset = !isFillX ? 0 : (boundH - srcH * scale) / 2

  return [xOffset, yOffset, scale]
}

console.log(rndArr)
let bound = getBound(rndArr)
console.log(bound)
let newArr = moveToOrigin(rndArr)
console.log(newArr)
let args = getScaleArgs([bound.w, bound.h], [100, 100])
console.log(args)
