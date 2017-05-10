/* eslint-disable no-undef */
/* eslint-disable no-new */

function getGeoJSON () {
  return new Promise((resolve, reject) => {
    fetch('../resources/china.json').then(resp =>
      resp.json().then(china => resolve(china))
    )
  })
}

function getData () {
  return new Promise((resolve, reject) => {
    fetch('../resources/china-population.json').then(resp =>
      resp.json().then(data => resolve(data))
    )
  })
}

const hoverText = document.getElementById('hover-text')

// Sinomap 与 ChoroplethLayer 均通过 script 标签导入全局作用域
getGeoJSON().then(china =>
  getData().then(data => {
    const myLayer = new ChoroplethLayer({
      data,
      onAreaEnter ({ name, cp, value }) {
        hoverText.innerText = `${name}: ${value} 万人`
      },
      onAreaLeave ({ name, cp, value }) {
        hoverText.innerText = ''
      }
    })

    new Sinomap({
      el: '#map',
      layer: myLayer,
      geoJSON: china
    })
  })
)
