// 调用 layer 回调
export function callLayer () {
  let args = Array.from(arguments)
  let name = args.splice(0, 1)
  this.layers.forEach(layer => {
    if (!layer[name]) return
    layer[name](this, ...args)
  })
}
