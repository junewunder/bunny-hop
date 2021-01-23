import * as PIXI from 'pixi.js'
import Collider from './blah/collider';
import Grid from './blah/grid'
import makeSprite from './blah/makeSprite'

const tileset = {
  0: {
    solid: false,
    texture: null,
  },
  0xca51be: {
    solid: true,
    texture: 'platforms 2'
  },
  0x8e2e76: {
    solid: true,
    texture: 'platforms 1'
  },
  0xe26ff8: {
    solid: true,
    texture: 'platforms 3'
  },
  0xa42734: {
    solid: true,
    texture: 'platforms 4'
  },
  0xcb4e63: {
    solid: true,
    texture: 'platforms 5'
  },
}

export default class Room {
  roomImg;
  collider;
  container;
  world;

  // todo: figure out how to get resources without onload
  constructor(stage, world, roomname, id, resources) {
    this.world = world
    this.roomImg = resources[`${roomname}.json_image`].data
    const { collisionGrid, container } = this.loadRoom(this.roomImg, resources[`${roomname}.json`].textures[`${roomname} ${id}.aseprite`].orig)
    this.container = container
    this.collider = Collider.makeGrid(Grid.fromSolidity(collisionGrid), ['solid'])
    stage.addChild(this.container)
  }

  update() {

  }

  destroy(stage) {
    stage.removeChild(this.container)
  }

  loadRoom(roomImg, orig) {
    console.log(orig)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.drawImage(roomImg, orig.x, orig.y, orig.width, orig.height, 0, 0, orig.width, orig.height)
    const imgData = ctx.getImageData(0, 0, roomImg.width, roomImg.height).data

    const container = new PIXI.Container()
    const collisionGrid = []

    for (let y = 0; y < roomImg.height; y++) {
      collisionGrid.push([])
      for (let x = 0; x < roomImg.width; x++) {
        const loc = (x + y * roomImg.width) * 4
        const color = imgData[loc] << 16 | imgData[loc + 1] << 8 | imgData[loc + 2]
        tileset[color] ? null : console.log(color.toString(16))
        const tile = tileset[color]
        
        collisionGrid[collisionGrid.length - 1].push(!!tile?.solid)

        if (tile?.texture) {
          const sprite = makeSprite(tile.texture);
          const scale = this.world.scale * 16
          sprite.x = scale * x
          sprite.y = scale * y
          sprite.width = sprite.height = scale
          container.addChild(sprite)
        }
      }
    }

    container.cacheAsBitmap = true
    return {
      container,
      collisionGrid
    }
  }
}
