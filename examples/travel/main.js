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

// 用于绘制城市气泡地图的 Demo 数据
function getCity () {
  return new Promise((resolve, reject) => {
    fetch('../../resources/demo-data/city.json').then(resp =>
      resp.json().then(data => resolve(data))
    )
  })
}

const bubbleText = document.getElementById('bubble-hover-text')

Promise.all([getArea(), getCity()]).then(values => {
  let china = values[0]
  let city = values[1]

  const bubble = new BubbleLayer({
    data: city,
    onBubbleEnter (bubble) {
      bubbleText.innerText = `${bubble.name}市`
    },
    onBubbleLeave (bubble) {
      bubbleText.innerText = ''
    }
  })

  const travel = new TravelLayer()

  new Sinomap({
    el: '#map',
    layers: [bubble, travel],
    geoJSON: china
  })
})
