const fs = require('fs');
const Aseprite = require('aseprite');

const contents = fs.readFileSync('assets/bunnyhop/levelbox.aseprite');
const ase = Aseprite.parse(contents)

// for debugging
// console.log(require('util').inspect(ase, { depth: null, colors: true }));

function pixelsToRGBStrings(pixels) {
  let colors = []
  for (let i = 0; i < pixels.length; i += 4) {
    colors.push(`rgb(${pixels[i]},${pixels[i+1]},${pixels[i+2]})`)
  }
  return colors
}

const screens = []
for (let frame of ase.frames) {
  const { pixels, width, height } = frame.chunks[frame.chunks.length - 1].data
  const rgbs = pixelsToRGBStrings(pixels)
  screens.push({
    width, height, pixels: rgbs
  })
}

fs.writeFileSync('assets/bunnyhop/levelbox.level.json', JSON.stringify(screens))
