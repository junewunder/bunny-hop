import * as PIXI from 'pixi.js'
import Collider from './blah/collider'
import Room from './room'
import Entity from './blah/entity'
import Player from './player'
import Rect from './blah/rect'
import Vec from './blah/vec'
import Sign from './entities/sign'
import Death from './entities/death'

import level from '../assets/bunnyhop/levelbox.level.json'

export default class World {
  scale = 3 // 1 in game unit * scale = on screen pixels
  stage
  pixi
  player
  entities
  room

  currentRoom = 0
  maxRoom = 2

  // shouldReset

  constructor(pixi) {
    this.pixi = pixi
    this.stage = new PIXI.Container()
    this.pixi.stage.addChild(this.stage)
    this.room = new Room(this.stage, this, level[this.currentRoom])
    
    this.player = new Player(this)
    
    this.exitLeft = new Sign(this,
      new Vec(0, 16 * 13), 
      'exitLeft', 
      [], 'player', 
      () => this.prevRoom())
    
    this.exitRight = new Sign(this,
      new Vec(16 * 27, 16 * 13), 
      'exitRight', 
      [], 'player',
      () => this.nextRoom())

    this.death = new Death(this, 
      new Vec(0, 16 * 15.5), 
      () => console.log('dead!')
    )
  }

  colliders(tag) {
    return [this.player.collider, this.room.collider]
      .filter(x => x.tags.includes?.(tag))
  }

  update() {
    this.player.update()
    this.exitLeft.update()
    this.exitRight.update()
    this.death.update()

    // camera attempt
    // console.log(this.player.sprite.x)
    // console.log(this.stage.x)
    // this.stage.x = 
    //   // Math.max(
    //     // 0, 
    //     this.player.x * this.scale - this.pixi.stage.width / 2
    //   // )
    // // this.stage.y = this.player.y * this.scale - this.pixi.stage.height / 2

    const { player }  = this

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
    console.log(this.currentRoom)
    this.room = new Room(this.stage, this, level[this.currentRoom])
    this.resetPlayer(true)
  }

  prevRoom() {
    if (this.currentRoom - 1 < 0) { return }
    this.room.destroy(this.stage)
    this.currentRoom--
    this.room = new Room(this.stage, this, level[this.currentRoom])
    this.resetPlayer(false)
  }
}