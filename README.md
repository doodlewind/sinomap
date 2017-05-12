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
TODO


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
