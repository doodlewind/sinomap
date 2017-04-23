function getScaleFactor () {
  if (!('devicePixelRatio' in window)) return 1
  return window.devicePixelRatio > 1
    ? window.devicePixelRatio : 1
}

function createCanvas (width, height) {
  const canvas = document.createElement('canvas')
  let scaleFactor = getScaleFactor()

  canvas.width = width * scaleFactor
  canvas.height = height * scaleFactor
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.getContext('2d').scale(scaleFactor, scaleFactor)
  return canvas
}

export function initMap ({
    el = '#map',
    width = 1000,
    height = 600
  } = {}) {
  const target = document.querySelector(el)
  const map = createCanvas(width, height)
  // console.log(target)
  target.appendChild(map)
  return map
}
