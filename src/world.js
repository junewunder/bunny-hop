import * as PIXI from 'pixi.js'
import { Camera, PanTo } from 'pixi-game-camera'
import Collider from './blah/collider'
import Room from './room'
import Entity from './blah/entity'
import Player from './player'
import Rect from './blah/rect'
import Vec from './blah/vec'
import Sign from './entities/sign'
import Coin from './entities/coin'
import CoinBig from './entities/coinbig'
import Death from './entities/death'

// import level from '../assets/bunnyhop/levellong.level.json'
import map from '../assets/bunnyhop/level01.json'
import Spike from './entities/spike'
import PlatformBumper from './entities/platform-bumper'
import MovingPlatform from './entities/moving-platform'

// entities
console.log(map.levels[0].layerInstances[0].entityInstances)
// tiles
console.log(map.levels[0].pxWid, ',', map.levels[0].pxHei)
console.log(map.levels[0].layerInstances[1].gridTiles)

export default class World {
  scale = 2 // 1 in game unit * scale = on screen pixels
  // scale = window.innerHeight / 23 * .95
  stage
  camera
  pixi
  player
  entities = new Set()
  room

  currentRoom = 0
  maxRoom = 10

  framesSincePanY = 0
  framesBetweenPanY = 10

  playerStart = new Vec(0, 0)

  constructor(pixi) {
    this.pixi = pixi
    this.camera = new Camera({ticker: pixi.ticker})
    this.stage = new PIXI.Container()
    this.pixi.stage.addChild(this.stage)

    // TODO REMOVE BEFORE SHIPPING
    // this.currentRoom = map.levels.length - 1

    this.room = new Room(this.stage, this, map.levels[this.currentRoom])
    this.createEntities(map.levels[this.currentRoom].layerInstances[0].entityInstances)
  }

  colliders(tag) {
    return [this.player.collider, this.room.collider]
      .concat(Array.from(this.entities).map(x => x.collider))
      .filter(x => x.tags?.includes?.(tag))
  }

  update() {
    const { player, pixi, stage, scale } = this

    player.update()
    for (let entity of this.entities) {
      entity.update()
    }

    // camera attempt
    stage.x = Math.min(0, Math.max(-pixi.stage.width - 3 * 16 * scale + window.innerWidth,
      -(player.x * scale - window.innerWidth / 2)
    ))
    

    player.vy += .5
    if (player.onGround) {
      player.vx -= Math.sign(player.vx)
    } else {
      player.vx -= Math.sign(player.vx) / 2
      // player.vy -= Math.sign(player.vy) // 60
    }

    if (player.y > 1000 || player.collider.check(Vec.zero(), 'death')) {
      this.resetPlayer()
    }
  }

  resetPlayer(onLeft = true) {
    // todo: start player on right if they're coming from the right
    this.player.pos = this.playerStart
    this.player.vy = 0
  }

  nextRoom() {
    if (this.currentRoom + 1 > this.maxRoom) { return }
    this.room.destroy()
    this.currentRoom++
    this.room = new Room(this.stage, this, map.levels[this.currentRoom])
    Array.from(this.entities).map(x => x.destroy())
    this.entities = new Set()
    this.createEntities(map.levels[this.currentRoom].layerInstances[0].entityInstances)
    this.resetPlayer(true)
  }

  prevRoom() {
    if (this.currentRoom - 1 < 0) { return }
    this.room.destroy(this.stage)
    this.currentRoom--
    this.room = new Room(this.stage, this, map.levels[this.currentRoom])
    Array.from(this.entities).map(x => x.destroy())
    this.entities = new Set()
    this.createEntities(map.levels[this.currentRoom].layerInstances[0].entityInstances, { onLeft: false })
    this.resetPlayer(false)
    this.player.vx = -1
  }

  createEntities(entities, { onLeft } = { onLeft: true }) {
    for (let entity of entities) {
      let [x, y] = entity.px
      switch (entity.__identifier) {
        case onLeft ? 'Player' : 'PlayerRight':
          if (this.player) {
            this.player.destroy()
          }
          this.playerStart = new Vec(x, y)
          this.player = new Player(this)
          this.player.x = x
          this.player.y = y
          break;
        
        case 'CoinBig':
          let coinbig = new CoinBig(this, new Vec(x, y), () => {
            this.entities.delete(coinbig)
            coinbig.destroy()
          })
          this.entities.add(coinbig)
          break;

        case 'Coin': 
          let coin = new Coin(this, new Vec(x, y), () => {
            coin.destroy(() => this.entities.delete(coin))
          })
          this.entities.add(coin)
          break;
        
        case 'Spike':
          this.entities.add(
            new Spike(this, new Vec(x, y), () => {
              this.resetPlayer()
            })
          )
          break;

        case 'PlatformBumper':
          this.entities.add(
            new PlatformBumper(this, new Vec(x, y))
          )
          break;
        
        case 'MovingPlatform':
          this.entities.add(
            new MovingPlatform(this, new Vec(x, y), {vx: -1})
          )
        break;

        case 'SignLeft':
          this.entities.add(
            new Sign(this, new Vec(x, y), 'exitLeft', [], 'player', () => this.prevRoom())
          )
          break;
        
        case 'SignRight':
          this.entities.add(
            new Sign(this, new Vec(x, y), 'exitRight', [], 'player', () => this.nextRoom())
          )
          break;
        
        case 'SignEmpty':
          this.entities.add(
            new Sign(this, new Vec(x, y), 'empty', [], 'player', () => null)
          )
          break;
      }
    }
  }
}