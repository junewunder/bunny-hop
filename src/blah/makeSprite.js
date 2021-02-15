import * as PIXI from 'pixi.js'

export function makeTextures(name, numFrames) {
  const frames = []
  for (let i = 0; i < numFrames; i++) {
    frames.push(PIXI.Texture.from(`${name} ${i}.aseprite`))
  }
  return frames
}

export default function makeSprite(name, numFrames = 1) {
  if (numFrames === 1) {
    const sprite = new PIXI.Sprite(PIXI.Texture.from(`${name}.aseprite`))
    sprite.roundPixels = true
    return sprite
  }

  const frames = []
  for (let i = 0; i < numFrames; i++) {
    frames.push(PIXI.Texture.from(`${name} ${i}.aseprite`))
  }
  const sprite = new PIXI.AnimatedSprite(frames)
  sprite.roundPixels = true
  return sprite
}
