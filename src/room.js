import * as PIXI from 'pixi.js'
import Collider from './blah/collider';
import Grid from './blah/grid'
import makeSprite from './blah/makeSprite'

const tileset = {
  'rgb(0,0,0)': {
    solid: false,
    texture: null,
  },
  'rgb(154,32,121)': {
    solid: true,
    texture: 'platforms 1'
  },
  'rgb(219,65,195)': {
    solid: true,
    texture: 'platforms 2'
  },
  'rgb(243,97,255)': {
    solid: true,
    texture: 'platforms 3'
  },
  'rgb(178,16,48)': {
    solid: true,
    texture: 'platforms 4'
  },
  'rgb(219,65,97)': {
    solid: true,
    texture: 'platforms 5'
  },
}

export default class Room {
  roomData;
  collider;
  container;
  world;

  constructor(stage, world, roomData) {
    this.world = world
    this.roomData = roomData
    const { collisionGrid, container } = this.loadRoom(this.roomData)
    this.container = container
    this.collider = Collider.makeGrid(Grid.fromSolidity(collisionGrid), ['solid'])
    stage.addChild(this.container)
  }

  update() {

  }

  destroy(stage) {
    stage.removeChild(this.container)
  }

  loadRoom(roomData) {
    const container = new PIXI.Container()
    const collisionGrid = []

    // TODO: make collisiongrid one dimensional
    for (let y = 0; y < roomData.height; y++) {
      collisionGrid.push([])
      for (let x = 0; x < roomData.width; x++) {
        const loc = x + y * roomData.width
        const color = roomData.pixels[loc]
        const tile = tileset[color]
        tile ? null : console.log(color.toString(16))
        
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
