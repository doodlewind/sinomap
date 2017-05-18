# Sinomap
插件化的超轻量中国地图库


## Features
* 基于 canvas 的地形数据渲染
* 小于 5KB gzipped 的尺寸
* 插件化的 Layer 层，提供 Hover API 支持


## API

### Basic
不带交互的基础地图：

``` js
import Sinomap from 'sinomap'
import china from 'sinomap/resources/china.json'

new Sinomap({
  el: '#map',          // 目标 DOM 元素，支持传入选择器字符串与 DOM Node 对象
  geoJSON: china,      // 地形数据
  width: 600,          // 宽度
  height: 400,         // 高度
  color: 'red',        // 地图底色
  borderColor: 'black' // 边框颜色
})
```

### Layer
Sinomap 通过将数据传入 Layer 的方式实现可视化效果。

``` js
// ...
import ChoroplethLayer from 'sinomap/dist/layers/choropleth'
import BubbleLayer from 'sinomap/dist/layers/bubble'

// 色级统计图 Layer
const choropleth = new ChoroplethLayer({
  color: 'red', // 基础底色
  level: 5,     // 由底色衍生的分色种类数
  data: [
    { name: '北京', value: 1989 },
    { name: '江苏', value: 1926 }
  ],
  // 光标移入区域时触发
  // name 为 GeoJSON 中区域名
  // cp 为 GeoJSON 中区域 capital 坐标
  // value 为 Layer 的 data 数据
  onAreaEnter ({ name, cp, value }) {
    // 该函数中 this 指向 Layer 实例而非地图实例
  },
  // 光标移出区域时触发
  onAreaLeave ({ name, cp, value }) {

  }
})

// 气泡图 Layer
const bubble = new BubbleLayer({
  color: 'red', // 基础底色
  data: [
    { "name": "合肥", "coordinate": [117.2461, 32.0361], "size": 10 }
  ],
  // 光标移入区域时触发
  // point 为该 bubble 在 canvas 中的坐标
  onAreaEnter ({ name, point, size, coordinate }) {

  },
  // 光标移出区域时触发
  onAreaLeave ({ name, point, size, coordinate }) {

  }
})

new Sinomap({
  el: '#map',
  layers: [choropleth, bubble],
  geoJSON: china
})
```

### 开发 Layer
一个示例的 Layer 就是一个独立的 Class。Sinomap 提供了多个在特定时机将当前 canvas 交由插件绘图的回调 API，只需在插件 Class 中提供相应名称的类方法，Sinomap 即会在相应时机调用插件绘图。若存在多个插件，则每个回调 API 触发时，逐个调用插件的相应接口（插件不需要的回调可以不在插件 Class 中提供）。可用的 API 如下：

#### afterAreaDraw (map, points, areaProps)
当 Area 完成绘制后触发。在全国地图中，一个省份即为一个 Area。同样地，在省级地图中，一个城市即为一个 Area。

* `map` 为当前 Sinomap 实例的 `this` 上下文，当前示例对应的 canvas 上下文为 `map.ctx`
* `points` 为当前 Area 地形对应的 canvas 坐标数组，形如 `[[x1, y1], [x2, y2]...]`
* `areaProps` 为当前 Area 的 GeoJSON 信息，包括名称 `name` / 坐标经纬度 `cp` 及 `id` 等（该属性中仅包含地形数据，相应的可视化数据应保存在 Layer 实例中，由 Layer 根据 `name` 等字段查找出数据后进行相应的可视化绘制）。

#### onAreaHover (map, points, areaProps)
在光标 Hover 至某个 Area 时被触发。

#### onAreaEnter (map, areaProps)
在光标离开某个 Area 时被触发。

#### onAreaLeave (map, areaProps)
在光标离开某个 Area 时被触发。

#### afterMapDraw (map)
在一次重绘结束时被触发。Hover 状态下每个 mousemove 事件均会触发重绘。

除上述方法外，Sinomap 还以 utils 的形式，提供了便于插件绘图的辅助函数，以 `map.utils` 的形式提供给插件使用：

#### map.utils.convert([lat, lng])
输入一个经纬度数组，返回当前 canvas 中该经纬度的 `[x, y]` 坐标数组。

#### map.utils.drawPath(ctx, points)
根据形如 `[[x, y]...]` 的坐标数组，绘制一个多边形 Path。

一个最简单的 Layer 示例如下（将当前 Hover Area 绘制为黑色）：

``` js
class MyLayer {
  onAreaHover (map, points, areaProps) {
    map.ctx.fillStyle = 'black'
    map.utils.drawPath(map.ctx, points)
  }
}

const myLayer = new MyLayer()
new Sinomap({
  // ...
  layers: [myLayer]
})
```

## 开发

开发模式：

``` text
npm run dev-sinomap    # Sinomap 基础库
npm run dev-choropleth # 色级统计图插件
npm run dev-bubble     # 气泡图插件
```

生产模式：

``` text
npm run build # 打包基础库及插件
```


## Credit
Sinomap 的灵感与基础功能参考了 [smallworld.js](http://mikefowler.me/smallworld.js/)，API 设计借鉴了 [Chart.js](https://github.com/chartjs/Chart.js) 和 [Leaflet](http://leafletjs.com/)
。
