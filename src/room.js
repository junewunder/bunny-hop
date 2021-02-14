import * as PIXI from 'pixi.js'
import Collider from './blah/collider';
import Grid from './blah/grid'
import makeSprite from './blah/makeSprite'

export default class Room {
  roomData;
  collider;
  container;
  world;

  constructor(stage, world, roomData) {
    this.world = world
    this.roomData = roomData
    const { rows, cols, solidity, container } = this.loadRoom(this.roomData)
    this.container = container
    this.collider = Collider.makeGrid(Grid.fromSolidity(solidity, rows, cols), ['solid'])
    stage.addChild(this.container)
  }

  update() {

  }

  destroy() {
    this.world.stage.removeChild(this.container)
  }

  loadRoom(roomData) {
    const TILE_SIZE = 16
    const rows = roomData.layerInstances[1].__cHei
    const cols = roomData.layerInstances[1].__cWid

    const container = new PIXI.Container()
    const solidity = new Array((rows + 1) * (cols + 1))
    for (let i in solidity) solidity[i] = false

    for (let tile of roomData.layerInstances[1].gridTiles) {
      const x = tile.px[0] / TILE_SIZE
      const y = tile.px[1] / TILE_SIZE  
      // NOTE: this will cause an issue in the future if there are more than 16 rows of tiles
      const frame = Math.floor(tile.src[0] / TILE_SIZE) + (Math.floor(tile.src[1] / TILE_SIZE) * 5)

      solidity[x + y * cols] = true

      const sprite = makeSprite(`platforms ${frame}`);
      const scale = this.world.scale * 16
      sprite.x = scale * x
      sprite.y = scale * y
      sprite.width = sprite.height = scale
      container.addChild(sprite)
    }

    container.cacheAsBitmap = true

    return {
      container,
      rows,
      cols,
      solidity
    }
  }
}
