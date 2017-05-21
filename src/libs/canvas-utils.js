import {
  getRenderConf,
  getPoints,
  getPoint,
  getAreaProps
} from './coordinate-utils'

const win = window
const doc = document

function getCanvasScale () {
  const ratio = 'devicePixelRatio'
  if (!(ratio in win)) return 1
  return win[ratio] > 1 ? win[ratio] : 1
}

function createCanvas (width, height, scaleFactor) {
  const canvas = doc.createElement('canvas')

  canvas.width = width * scaleFactor
  canvas.height = height * scaleFactor
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.getContext('2d').scale(scaleFactor, scaleFactor)
  return canvas
}

function updateHandler (e) {
  let box = this.mapCanvas.getBoundingClientRect()
  this.mouseX = (e.clientX - box.left) * this.mapCanvas.width / box.width
  this.mouseY = (e.clientY - box.top) * this.mapCanvas.height / box.height
  this.updateMap()
}

function initListener (canvas) {
  const _this = this
  const eventArr = ['mousemove', 'click']
  eventArr.forEach(e =>
    win.addEventListener(e, updateHandler.bind(this), false)
  )
  const hasAnimate = this.layers.some(layer => layer.animate)
  if (hasAnimate) {
    win.requestAnimationFrame(function animate () {
      _this.updateMap()
      win.requestAnimationFrame(animate)
    })
  }
}

// 根据区域地形及参数绘制 canvas
// 返回鼠标是否停留在当前 area 的 boolean
function drawArea (arr, areaProps) {
  let conf = this.renderConf
  let points = getPoints(
    arr,
    conf.minX,
    conf.minY,
    conf.offsetX,
    conf.offsetY,
    conf.areaScale,
    this.height
  )
  this.ctx.fillStyle = this.color
  this.ctx.strokeStyle = this.borderColor
  drawPath(this.ctx, points)
  this.ctx.stroke()
  this.callLayer('afterAreaDraw', points, areaProps)

  let mouseOnArea = this.ctx.isPointInPath(this.mouseX, this.mouseY)

  if (mouseOnArea) {
    // onAreaHover 在 area 处于 hover 状态时每次更新均需触发
    this.callLayer('onAreaHover', points, areaProps)
    // leave 与 enter 事件仅当变更 area 时触发
    if (this.hoverName !== areaProps.name) {
      // 若 area 名称变更且原 hoverName 存在
      // 表示当前状态为离开原 area
      if (this.hoverName !== null) {
        this.callLayer('onAreaLeave', areaProps)
      }
      this.callLayer('onAreaEnter', areaProps)
      this.hoverName = areaProps.name
    }
  }
  return mouseOnArea
}

// 将 [lat, lng] 经纬度坐标转换为当前 canvas 的 [x, y] 坐标
function convert (coordinate) {
  let conf = this.renderConf
  return getPoint(
    coordinate,
    conf.minX,
    conf.minY,
    conf.offsetX,
    conf.offsetY,
    conf.areaScale,
    this.height
  )
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
    ? doc.querySelector(this.el) : this.el
  if (!target) throw new Error('[Sinomap] Target element not found.')

  this.mouseX = 0
  this.mouseY = 0
  this.hoverName = null
  this.canvasScale = getCanvasScale()
  this.mapCanvas = createCanvas(this.width, this.height, this.canvasScale)
  this.ctx = this.mapCanvas.getContext('2d')
  this.utils = {
    drawPath,
    convert: convert.bind(this)
  }
  target.appendChild(this.mapCanvas)
  initListener.call(this, this.mapCanvas)
}

export function updateMap () {
  const _drawArea = drawArea.bind(this)
  this.renderConf = getRenderConf(this.geoJSON, this.width, this.height)
  // 任意子 area 存在光标时即将此 flag 置为真
  let mouseOnMap = false

  this.geoJSON.features.forEach(area => {
    // 区分绘制区域为单个闭合多边形或不连通图的情形
    if (area.geometry.type === 'Polygon') {
      area.geometry.coordinates.forEach(arr => {
        if (_drawArea(arr, area.properties)) mouseOnMap = true
      })
    } else {
      area.geometry.coordinates.forEach(s =>
        s.forEach(arr => {
          if (_drawArea(arr, area.properties)) mouseOnMap = true
        })
      )
    }
  })

  // 光标不在地图上但存在 hoverName 时
  // 表示此次渲染时光标离开地图
  if (!mouseOnMap && this.hoverName !== null) {
    this.callLayer(
      'onAreaLeave',
      getAreaProps(this.hoverName, this.geoJSON)
    )
    this.hoverName = null
  }

  this.callLayer('afterMapDraw')
}
