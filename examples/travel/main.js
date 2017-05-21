/* eslint-disable no-undef */
/* eslint-disable no-new */

// 地形 GeoJSON 数据
function getArea () {
  return new Promise((resolve, reject) => {
    fetch('../../resources/china.json').then(resp =>
      resp.json().then(china => resolve(china))
    )
  })
}

// 用于绘制迁徙图的 Demo 数据
function getTravel () {
  return new Promise((resolve, reject) => {
    fetch('../../resources/demo-data/city-travel.json').then(resp =>
      resp.json().then(data => resolve(data))
    )
  })
}

Promise.all([getArea(), getTravel()]).then(values => {
  const china = values[0]
  const travelData = values[1]

  const travel = new TravelLayer({
    data: travelData
  })

  new Sinomap({
    el: '#map',
    layers: [travel],
    geoJSON: china
  })
})
