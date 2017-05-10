# Sinomap
插件化的超轻量中国地图库


## Why Sinomap
TODO


## Demo
Clone 本项目并 `npm install` 后，运行示例：

``` text
npm run example
```

而后在浏览器中打开 `http://localhost:10006/examples/` 即可。

## API

``` js
import Sinomap from 'sinomap'
import china from 'sinomap/resources/china.json'

new Sinomap({
  el: '#map',
  area: china
})
```


## 开发

开发模式：

``` text
npm run dev-sinomap # Sinomap 基础库
npm run dev-choropleth # 色级统计图插件
```

生产模式：

``` text
npm run build # 打包基础库及插件
```


## Credit
TODO
