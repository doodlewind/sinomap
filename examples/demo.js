/* eslint-disable */
fetch('../resources/china.json').then(resp =>
  resp.json().then(china =>
    new Sinomap({
      el: '#map',
      area: china
    })
  )
)
