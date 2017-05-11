// 调用 layer 回调
export function callLayer () {
  let args = Array.from(arguments)
  let name = args.splice(0, 1)
  this.layers.forEach(layer => {
    if (!layer[name]) return
    layer[name](this, ...args)
  })
}

export function getAreaProps (name, geoJSON) {
  let tmp = geoJSON.features.filter(area => area.properties.name === name)
  if (tmp.length) return tmp[0].properties
}
