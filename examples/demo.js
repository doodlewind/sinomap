/* eslint-disable */
function getGeoJSON () {
  return new Promise ((resolve, reject) => {
    fetch('../resources/china.json').then(resp =>
      resp.json().then(china => resolve(china))
    )
  })
}

function getData () {
  return new Promise ((resolve, reject) => {
    fetch('../resources/china-population.json').then(resp =>
      resp.json().then(data => resolve(data))
    )
  })
} 

// Sinomap 与 ChoroplethLayer 均通过 script 标签导入全局作用域
getGeoJSON().then(china =>
  getData().then(data =>
    new Sinomap({
      el: '#map',
      layer: new ChoroplethLayer({ data }),
      area: china
    })
  )
)
