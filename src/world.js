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
import Death from './entities/death'

import level from '../assets/bunnyhop/levellong.level.json'

export default class World {
  scale = 2 // 1 in game unit * scale = on screen pixels
  stage
  camera
  pixi
  player
  entities = new Set()
  room

  currentRoom = 0
  maxRoom = 2

  framesSincePanY = 0
  framesBetweenPanY = 10

  constructor(pixi) {
    this.pixi = pixi
    this.camera = new Camera({ticker: pixi.ticker})
    this.stage = new PIXI.Container()
    this.pixi.stage.addChild(this.stage)
    this.room = new Room(this.stage, this, level[this.currentRoom])
    this.createEntities(level[this.currentRoom].entities)
  }

  colliders(tag) {
    return [this.player.collider, this.room.collider].concat(Array.from(this.entities))
      .filter(x => x.tags?.includes?.(tag))
  }

  update() {
    const { player, pixi, stage, scale } = this

    player.update()
    for (let entity of this.entities) {
      entity.update()
    }

    // camera attempt
    stage.x = 
      Math.min(0, Math.max(-pixi.stage.width - 3 * 16 * scale + window.innerWidth,
        -(player.x * scale - window.innerWidth / 2)
      ))
    

    player.vy += .5
    if (player.onGround) {
      player.vx -= Math.sign(player.vx)
    } else {
      player.vx -= Math.sign(player.vx) / 2
      // player.vy -= Math.sign(player.vy) // 60
    }

    if (player.y > 1000) {
      this.resetPlayer()
    }
  }

  resetPlayer(onLeft = true) {
    if (onLeft) {
      this.player.pos = new Vec(16 * 1.5, 16 * 13)
    } else {
      this.player.pos = new Vec(16 * 24.5, 16 * 13)
    } 
    // this.player.vx = 0
    // this.player.vy = 0
  }

  nextRoom() {
    if (this.currentRoom + 1 > this.maxRoom) { return }
    this.room.destroy(this.stage)
    this.currentRoom++
    this.room = new Room(this.stage, this, level[this.currentRoom])
    Array.from(this.entities).map(x => x.destroy(this.stage))
    this.entities = new Set()
    this.createEntities(level[this.currentRoom].entities)
    this.resetPlayer(true)
  }

  prevRoom() {
    if (this.currentRoom - 1 < 0) { return }
    this.room.destroy(this.stage)
    this.currentRoom--
    this.room = new Room(this.stage, this, level[this.currentRoom])
    Array.from(this.entities).map(x => x.destroy(this.stage))
    this.entities = new Set()
    this.createEntities(level[this.currentRoom].entities)
    this.resetPlayer(false)
  }

  createEntities(entities) {
    for (let pos in entities) {
      let _, [x, y] = pos.split(',').map(x => parseInt(x))
      // console.log(x, y)
      switch (entities[pos]) {
        case 'player': 
          console.log(x, y)
          if (this.player) {
            this.player.destroy(this.stage)
          }
          this.player = new Player(this)
          this.player.x = x
          this.player.y = y
          break;
        
        case 'coinBig':
        case 'coin': 
          let coin = new Coin(this, new Vec(x, y), () => {
            this.entities.delete(coin)
            coin.destroy(this.stage)
          })
          this.entities.add(coin)
          break;

        case 'signLeft':
          this.entities.add(
            new Sign(this, new Vec(x, y), 'exitLeft', [], 'player', () => this.prevRoom())
          )
          break;
        
        case 'signRight':
          this.entities.add(
            new Sign(this, new Vec(x, y), 'exitRight', [], 'player', () => this.nextRoom())
          )
          break;
        
        case 'signEmpty':
          this.entities.add(
            new Sign(this, new Vec(x, y), 'empty', [], 'player', () => null)
          )
          break;
      }
    }
  }
}