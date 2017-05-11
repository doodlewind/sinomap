/* eslint-disable no-undef */
/* eslint-disable no-new */

function getGeoJSON () {
  return new Promise((resolve, reject) => {
    fetch('../resources/china.json').then(resp =>
      resp.json().then(china => resolve(china))
    )
  })
}

// 用于绘制分色地图的 Demo 数据
function getPopulationData () {
  return new Promise((resolve, reject) => {
    fetch('../resources/china-population.json').then(resp =>
      resp.json().then(data => resolve(data))
    )
  })
}

// 用于绘制城市气泡地图的 Demo 数据
function getCityData () {
  return new Promise((resolve, reject) => {
    fetch('../resources/city.json').then(resp =>
      resp.json().then(data => resolve(data))
    )
  })
}

const hoverText = document.getElementById('hover-text')

// Sinomap 与 Layer 均通过 script 标签导入全局作用域
getGeoJSON().then(china =>
  getCityData().then(data => {
    /*
    const choropleth = new ChoroplethLayer({
      data,
      onAreaEnter ({ name, cp, value }) {
        hoverText.innerText = `${name}: ${value} 万人`
      },
      onAreaLeave ({ name, cp, value }) {
        hoverText.innerText = ''
      }
    })
    */
    const bubble = new BubbleLayer({ data })

    new Sinomap({
      el: '#map',
      layer: bubble,
      geoJSON: china
    })
  })
)
