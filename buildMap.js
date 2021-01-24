const fs = require('fs');
const Aseprite = require('aseprite');

const levelname = 'levellong'

const contents = fs.readFileSync(`assets/bunnyhop/${levelname}.aseprite`);
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

function rgbsToEntities(pixels, width, height, offsetX, offsetY) {
  const entities = {}
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      entities[[(x + offsetX - 2) * 16, (y + offsetY - 2) * 16]] = ({
        'rgb(48,81,130)': 'coin',
        'rgb(65,146,195)': 'coinBig',
        'rgb(120,65,0)': 'signLeft',
        'rgb(255,219,162)': 'signEmpty',
        'rgb(255,162,0)': 'signRight',
        'rgb(195,113,0)': 'player',
      })[pixels[x + y * width]]
    }
  }
  return entities
}

const screens = []
for (let frame of ase.frames) {
  const { pixels, width, height } = frame.chunks[frame.chunks.length - 2].data
  const { pixels: entitypixels, width: eWidth, height: eHeight } = frame.chunks[frame.chunks.length - 1].data
  const rgbs = pixelsToRGBStrings(pixels)
  screens.push({
    width, height, 
    pixels: rgbs,
    entities: rgbsToEntities(pixelsToRGBStrings(entitypixels), eWidth, eHeight, width - eWidth, height - eHeight)
  })
}

fs.writeFileSync(`assets/bunnyhop/${levelname}.level.json`, JSON.stringify(screens))
