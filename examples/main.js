/* eslint-disable no-undef */
/* eslint-disable no-new */

// fetch GeoJSON data
function getArea () {
  return new Promise((resolve, reject) => {
    fetch('../resources/china.json').then(resp =>
      resp.json().then(china => resolve(china))
    )
  })
}

// fetch demo choropleth layer data
function getPopulation () {
  return new Promise((resolve, reject) => {
    fetch('../resources/demo-data/china-population.json').then(resp =>
      resp.json().then(data => resolve(data))
    )
  })
}

// fetch demo bubble layer data
function getCity () {
  return new Promise((resolve, reject) => {
    fetch('../resources/demo-data/city.json').then(resp =>
      resp.json().then(data => resolve(data))
    )
  })
}

const hoverText = document.getElementById('hover-text')
const bubbleText = document.getElementById('bubble-hover-text')

Promise.all([getArea(), getPopulation(), getCity()]).then(values => {
  const china = values[0]
  const population = values[1]
  const city = values[2]

  const choropleth = new ChoroplethLayer({
    data: population,
    level: 10,
    onAreaEnter ({ name, cp, value }) {
      hoverText.innerText = `${name}: ${value} 万人 / 万平方公里`
    },
    onAreaLeave ({ name, cp, value }) {
      hoverText.innerText = ''
    }
  })
  const bubble = new BubbleLayer({
    data: city,
    onBubbleEnter (bubble) {
      bubbleText.innerText = `${bubble.name}市`
    },
    onBubbleLeave (bubble) {
      bubbleText.innerText = ''
    }
  })

  new Sinomap({
    el: '#map',
    layers: [choropleth, bubble],
    geoJSON: china
  })
})
