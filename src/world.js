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
  roomWidth
  roomHeight

  framesSincePanY = 0
  framesBetweenPanY = 10

  playerStart = new Vec(0, 0)

  constructor(pixi) {
    this.pixi = pixi
    // this.scale = pixi.screen.height / 23 * 16
    // this.camera = new Camera({ticker: pixi.ticker})
    // console.log(Object.keys(this.camera))
    this.stage = new PIXI.Container()
    this.pixi.stage.addChild(this.stage)

    // TODO REMOVE BEFORE SHIPPING
    // this.currentRoom = map.levels.length - 1

    this.room = new Room(this.stage, this, map.levels[this.currentRoom])
    this.roomWidth = map.levels[this.currentRoom].pxWid
    this.roomHeight = map.levels[this.currentRoom].pxHei
    this.createEntities(map.levels[this.currentRoom].layerInstances[0].entityInstances)
  }

  colliders(tag) {
    let allColliders = [this.player.collider, this.room.collider]
      .concat(Array.from(this.entities).map(x => x.collider))
    
    if (!tag) return allColliders
    else return allColliders.filter(x => x.tags?.includes?.(tag))
  }

  update() {
    const { player, pixi, stage, scale, roomWidth, roomHeight } = this

    const { min, max, sign, abs } = Math

    player.update()
    for (let entity of this.entities) {
      entity.update()
    }
    
    player.vy += .5 //gravity
    
    // air and ground friction
    // if (player.onGround) {
    //   player.vx -= sign(player.vx)
    // } else {
    //   player.vx -= sign(player.vx) / 2
    //   // player.vy -= Math.sign(player.vy) // 60
    // }

    this.updateCamera()

    if (player.y > this.roomHeight || player.collider.check(Vec.zero(), 'death')) {
      this.resetPlayer()
    }

    player.updateSprite()
    for (let entity of this.entities) {
      entity.updateSprite()
    }
  }

  resetPlayer(shouldRespawn = true) {
    this.player.pos = this.playerStart
    this.player.vy = 0
    this.player.vx = 0
    if (shouldRespawn) this.player.respawn()
  }

  nextRoom() {
    if (this.currentRoom + 1 >= map.levels.length) { return }
    this.room.destroy()
    this.currentRoom++
    this.stage.removeChildren()
    this.room = new Room(this.stage, this, map.levels[this.currentRoom])
    this.roomWidth = map.levels[this.currentRoom].pxWid
    this.roomHeight = map.levels[this.currentRoom].pxHei
    this.entities = new Set()
    this.createEntities(map.levels[this.currentRoom].layerInstances[0].entityInstances)
    this.resetPlayer(false)
    this.updateCamera(true)
  }

  prevRoom() {
    if (this.currentRoom - 1 < 0) { return }
    this.room.destroy(this.stage)
    this.currentRoom--
    this.stage.removeChildren()
    this.room = new Room(this.stage, this, map.levels[this.currentRoom])
    this.roomWidth = map.levels[this.currentRoom].pxWid
    this.roomHeight = map.levels[this.currentRoom].pxHei
    this.entities = new Set()
    this.createEntities(map.levels[this.currentRoom].layerInstances[0].entityInstances, { onLeft: false })
    this.resetPlayer(false)
    this.updateCamera(true)
  }

  updateCamera(force = false) {
    const { player, pixi, stage, scale, roomWidth, roomHeight } = this
    const { min, max, sign, abs } = Math

    const targetX = min(0, max(-roomWidth * scale + pixi.screen.width,
      -(player.x * scale - pixi.screen.width / 2)
    ))
    if (targetX !== stage.x || force) 
      stage.x = targetX

    const targetY = min(0, max(-(roomHeight) * scale + pixi.screen.height,
      -(player.y * scale - pixi.screen.height / 2)
    ))
    // if ((targetY !== stage.y && abs(player.vy) > 2.5) || force) 
    //   stage.y = targetY
    // console.log(targetY - stage.y, (targetY - stage.y) / (player.vy || 1))
    // stage.y += (targetY - stage.y) / (abs(player.vy) > 0 ? abs(player.vy) : .5)
    stage.y = targetY // + 
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
            coinbig.destroy(() => this.entities.delete(coinbig))
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
              if (this.player.vy > 0)
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
        
        case 'Tutorial':
          const sprite = new PIXI.Sprite(new PIXI.Texture.from(`tut_${entity.fieldInstances[0].__value}`))
          sprite.x = x * this.scale
          sprite.y = y * this.scale
          this.stage.addChild(sprite)
          break;
      }
    }
  }
}