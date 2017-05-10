import { getRenderConf, getPoints } from './coordinate-utils'
import { getAreaProps } from './utils'

function getCanvasScale () {
  if (!('devicePixelRatio' in window)) return 1
  return window.devicePixelRatio > 1
    ? window.devicePixelRatio : 1
}

function createCanvas (width, height, scaleFactor) {
  const canvas = document.createElement('canvas')

  canvas.width = width * scaleFactor
  canvas.height = height * scaleFactor
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.getContext('2d').scale(scaleFactor, scaleFactor)
  return canvas
}

function initListener (canvas) {
  canvas.addEventListener('mousemove', e => {
    let box = this.mapCanvas.getBoundingClientRect()
    this.mouseX = (e.clientX - box.left) * this.mapCanvas.width / box.width
    this.mouseY = (e.clientY - box.top) * this.mapCanvas.height / box.height
    this.updateMap()
  })
}

// 根据区域地形及参数绘制 canvas
// 返回鼠标是否停留在当前 area 的 boolean
function drawArea (arr, areaProps, {
    offsetX, offsetY, minX, minY, areaScale
  } = {}) {
  let points = getPoints(arr, {
    minX, minY, offsetX, offsetY, areaScale, height: this.height
  })
  this.ctx.fillStyle = this.color
  this.ctx.strokeStyle = this.borderColor
  drawPath(this.ctx, points)
  this.ctx.stroke()
  this.callLayer('afterDrawArea', points, areaProps)

  let mouseOnArea = this.ctx.isPointInPath(this.mouseX, this.mouseY)

  if (mouseOnArea) {
    // onHoverArea 在 area 处于 hover 状态时每次更新均需触发
    this.callLayer('onHoverArea', points, areaProps)
    // leave 与 enter 事件仅当变更 area 时触发
    if (this.hoverName !== areaProps.name) {
      // 若 area 名称变更且原 hoverName 存在
      // 表示当前状态为离开原 area
      if (this.hoverName !== null) {
        this.callLayer('onLeaveArea', areaProps)
      }
      this.callLayer('onEnterArea', areaProps)
      this.hoverName = areaProps.name
    }
  }
  return mouseOnArea
}

// 由 [[x, y]...] 坐标数组绘制单个 Path
function drawPath (ctx, points) {
  points.forEach((p, i) => {
    let [x, y] = [points[i][0], points[i][1]]
    if (i === 0) ctx.beginPath()
    ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fill()
}

export function initMap (el, width, height) {
  const target = typeof this.el === 'string'
    ? document.querySelector(this.el) : this.el
  if (!target) throw new Error('[Sinomap] Target element not found.')

  this.mouseX = 0
  this.mouseY = 0
  this.hoverName = null
  this.canvasScale = getCanvasScale()
  this.mapCanvas = createCanvas(this.width, this.height, this.canvasScale)
  this.ctx = this.mapCanvas.getContext('2d')
  this.utils = { drawPath }
  target.appendChild(this.mapCanvas)
  initListener.bind(this)(this.mapCanvas)
}

export function updateMap () {
  let conf = getRenderConf(this.geoJSON, this.width, this.height)
  // 任意子 area 存在光标时即将此 flag 置为真
  let mouseOnMap = false

  this.geoJSON.features.forEach(area => {
    // 区分绘制区域为单个闭合多边形或不连通图的情形
    if (area.geometry.type === 'Polygon') {
      area.geometry.coordinates.forEach(arr => {
        if (drawArea.bind(this)(arr, area.properties, conf)) {
          mouseOnMap = true
        }
      })
    } else {
      area.geometry.coordinates.forEach(s =>
        s.forEach(arr => {
          if (drawArea.bind(this)(arr, area.properties, conf)) {
            mouseOnMap = true
          }
        })
      )
    }
  })

  // 光标不在地图上但存在 hoverName 时
  // 表示此次渲染时光标离开地图
  if (!mouseOnMap && this.hoverName !== null) {
    this.callLayer(
      'onLeaveArea',
      getAreaProps(this.hoverName, this.geoJSON)
    )
    this.hoverName = null
  }
}
