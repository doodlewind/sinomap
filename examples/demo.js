/* eslint-disable no-undef */
/* eslint-disable no-new */

// 地形 GeoJSON 数据
function getArea () {
  return new Promise((resolve, reject) => {
    fetch('../resources/china.json').then(resp =>
      resp.json().then(china => resolve(china))
    )
  })
}

// 用于绘制分色地图的 Demo 数据
function getPopulation () {
  return new Promise((resolve, reject) => {
    fetch('../resources/china-population.json').then(resp =>
      resp.json().then(data => resolve(data))
    )
  })
}

// 用于绘制城市气泡地图的 Demo 数据
function getCity () {
  return new Promise((resolve, reject) => {
    fetch('../resources/city.json').then(resp =>
      resp.json().then(data => resolve(data))
    )
  })
}

Promise.all([getArea(), getPopulation(), getCity()]).then(values => {
  let china = values[0]
  let population = values[1]
  let city = values[2]

  const choropleth = new ChoroplethLayer({
    data: population,
    onAreaEnter ({ name, cp, value }) {
      hoverText.innerText = `${name}: ${value} 万人`
    },
    onAreaLeave ({ name, cp, value }) {
      hoverText.innerText = ''
    }
  })
  const bubble = new BubbleLayer({ data: city })

  new Sinomap({
    el: '#map',
    layer: bubble,
    layers: [choropleth, bubble],
    geoJSON: china
  })
})

const hoverText = document.getElementById('hover-text')
