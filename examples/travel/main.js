/* eslint-disable no-undef */
/* eslint-disable no-new */

// fetch GeoJSON data
function getArea () {
  return new Promise((resolve, reject) => {
    fetch('../../resources/china.json').then(resp =>
      resp.json().then(china => resolve(china))
    )
  })
}

// fetch demo travel layer data
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
