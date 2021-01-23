import * as PIXI from 'pixi.js'
import Collider from './blah/collider'
import Room from './room'
import Entity from './blah/entity'
import Player from './player'
import Rect from './blah/rect'
import Vec from './blah/vec'
import Sign from './entities/sign'
import Death from './entities/death'

export default class World {
  scale = 3 // 1 in game unit * scale = on screen pixels
  stage
  pixi
  resources
  player
  entities
  room

  mapName = 'levelbox'
  currentRoom = 0
  maxRoom = 1

  // shouldReset

  constructor(pixi, resources) {
    this.pixi = pixi
    this.stage = new PIXI.Container()
    this.pixi.stage.addChild(this.stage)
    this.resources = resources
    this.room = new Room(this.stage, this, this.mapName, this.currentRoom, resources)
    
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

    this.player.vy += 1
    if (this.player.onGround) {
      this.player.vx -= Math.sign(this.player.vx)
    }

    if (this.player.y > 1000) {
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
    this.room = new Room(this.stage, this, this.mapName, this.currentRoom, this.resources)
    this.resetPlayer(true)
  }

  prevRoom() {
    if (this.currentRoom - 1 < 0) { return }
    this.room.destroy(this.stage)
    this.currentRoom--
    this.room = new Room(this.stage, this, this.mapName, this.currentRoom, this.resources)
    this.resetPlayer(false)
  }
}