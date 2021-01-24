import * as PIXI from 'pixi.js'
import Collider from './collider'
import Rect from './rect'
import makeSprite from './makeSprite'
import Vec from './vec'

export default class Entity {
  x = 0
  y = 0
  vx = 0
  vy = 0
  // ax = 0 
  // ay = 0
  sprite
  world
  collider
  onCollide(){}
  onCollidedWith(){}

  maxVelocityX = 5
  // remainderVelocityX = 0
  // remainderVelocityY = 0

  constructor({world, spriteName, frames, pos = new Vec(0, 0), tags}) {
    this.world = world
    this.sprite = makeSprite(spriteName, frames)
    this.collider = Collider.makeRect(
      this,
      new Rect(Vec.zero(), new Vec(this.sprite.width, this.sprite.height)),
      tags,
    )
    
    this.x = pos.x
    this.y = pos.y
    this.sprite.scale.set(world.scale)
    this.sprite.anchor.set(0)
    this.sprite.animationSpeed = 0.3
    this.sprite.roundPixels = true
    this.sprite.play?.()
    this.world.stage.addChild(this.sprite)
  }

  update() {
    const vxSign = Math.sign(this.vx)
    this.vx = vxSign * Math.min(Math.abs(this.vx), this.maxVelocityX)
    this.moveX(this.vx)
    this.moveY(this.vy)
    this.sprite.x = this.x * this.world.scale
    this.sprite.y = this.y * this.world.scale
  }

  destroy(stage) {
    stage.removeChild(this.sprite)
  }

  moveX (amount) {
    while (amount >= 1 || amount <= -1) {
      const sign = Math.sign(amount)
      if (this.collider.check(new Vec(sign, 0), 'solid')) {
        this.vx = 0
        return
      }

      amount -= sign
      this.x += sign
    }
  }
  
  moveY (amount) {
    while (amount >= 1 || amount <= -1) {
      const sign = Math.sign(amount)
      if (this.collider.check(new Vec(0, sign), 'solid')) {
        this.vy = 0
        return
      }

      amount -= sign
      this.y += sign
    }
  }

  get pos() { return new Vec(this.x, this.y) }
  set pos({x, y}) {this.x = x; this.y = y}
  get vel() { return new Vec(this.vx, this.vy) }
  set vel({x, y}) {this.vx = x; this.vy = y}
}
