import * as PIXI from 'pixi.js'
import Collider from './collider'
import Rect from './rect'
import makeSprite, { makeTextures } from './makeSprite'
import Vec from './vec'

export default class Entity {
  x = 0
  y = 0
  vx = 0
  vy = 0
  facing = 1

  sprite
  world
  collider
  onCollide(){}
  onCollidedWith(){}

  maxVelocityX = 5
  limitVelocity = true

  constructor({world, spriteName, frames, pos = new Vec(0, 0), tags = []}) {
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
    const { sign, min, max, abs } = Math
    const vxSign = sign(this.vx)
    if (this.limitVelocity) {
      this.vx = vxSign * min(abs(this.vx), this.maxVelocityX)
    }

    this.moveX(this.vx)
    this.moveY(this.vy)
    this.sprite.x = this.x * this.world.scale
    this.sprite.y = this.y * this.world.scale

    // this.facing = (this.vx >= 1 || this.vx <= -1) ? vxSign : this.facing
    if (this.facing !== vxSign && vxSign !== 0 && !(this.vx < 1 && this.vx > -1) ) {
      this.facing = vxSign
      this.sprite.scale.x = this.world.scale * this.facing
      if (this.facing === 1) {
        this.sprite.anchor.x = 0
      } else {
        this.sprite.anchor.x = 1
      }
    }
  }

  destroy() {
    this.world.stage.removeChild(this.sprite)
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

  swapTexture(name, frames, {onLoop, onComplete}) {
    this.sprite.textures = makeTextures(name, frames)
    this.sprite.onLoop = onLoop
    this.sprite.onComplete = onComplete
    this.sprite.animationSpeed = .3 + (Math.random() * .2) - .1
    this.sprite.play()
  }
}
