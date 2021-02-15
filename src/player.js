import * as PIXI from 'pixi.js'
import Vec from './blah/vec'
import Entity from './blah/entity'

export default class Player extends Entity {

  respawning = false

  onGround = false
  holdingUp = false
  holdingDown = false
  holdingRight = false
  holdingLeft = false
  holdingSpace = false

  hopCooldown = 15

  jumpQueued = false
  framesSinceJump = 0
  JUMP_QUEUE_LENGTH = 30

  framesOnGround = 0
  framesOffGround = 0
  JUMP_FORGIVENESS = 15

  constructor(world) {
    super({
      world,
      // spriteName: 'happie',
      // spriteName: 'turtle',
      // frames:16,
      spriteName: 'bunnysprite',
      frames: 8,
      pos: new Vec(100, 100),
      tags: ['player']
    })

    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  update() {

    if (this.respawning) {
      this.sprite.x = this.x * this.world.scale
      this.sprite.y = this.y * this.world.scale
      return
    }

    const { sign, max, min } = Math
    let movingSolid = this.collider.check(new Vec(0, 1), 'movingsolid')
    if (movingSolid) {
      const otherVx = movingSolid.entity.vx
      if (sign(otherVx) === sign(this.vx) || this.vx === 0) {
        this.vx = sign(otherVx) > 0
          ? max(this.vx, otherVx)
          : min(this.vx, otherVx)
        console.log(this.vx);
      }
    }
    
    super.update()

    this.onGround = this.collider.check(new Vec(0, 1), 'solid')
    const { onGround, holdingLeft, holdingRight, holdingSpace, jumpQueued, framesSinceJump } = this

    if (onGround) this.framesOffGround = 0
    else this.framesOffGround++
    
    if (onGround) this.framesOnGround++
    else this.framesOnGround = 0

    if (holdingRight && !holdingLeft) {
      if (onGround && this.framesOnGround > this.hopCooldown) this.vy -= 3
      this.vx += onGround ? 2 : 1
    }
    if (holdingLeft && !holdingRight) {
      if (onGround && this.framesOnGround > this.hopCooldown) this.vy -= 3
      this.vx += onGround ? -2 : -1
    }
    if (
      ((holdingSpace || (jumpQueued && framesSinceJump < this.JUMP_QUEUE_LENGTH)) 
      && onGround)
      || (holdingSpace && this.framesOffGround <= this.JUMP_FORGIVENESS)) {
      this.jumpQueued = false
      this.vy = -7
    }
    if (jumpQueued) this.framesSinceJump++

    if (Math.abs(this.vx) < 1 && this.sprite.currentFrame === 0) {
      this.sprite.stop?.()
    }
    if (Math.abs(this.vx) > 1 && !this.sprite.playing) {
      this.sprite.play?.()
    }
  }

  onKeyDown(e) {
    if (e.code === "ArrowUp" || e.keyCode === 87) {
      this.holdingSpace = true // lol quick fix for jumping with up arrow
      this.holdingUp = true
    }
    if (e.code === "ArrowDown" || e.keyCode === 83) this.holdingDown = true
    if (e.code === "ArrowLeft" || e.keyCode === 65) {
      this.holdingLeft = true
      // this.facing = -1
      // this.vy -= 5
      // this.vx += -2
      // this.vx += -1
    }
    if (e.code === "ArrowRight" || e.keyCode === 68) {
      this.holdingRight = true
      // this.facing = 1
      // this.vy -= 5
      // this.vx += 2
      // this.vx += 1
    }
    if (e.keyCode === 32) {
      this.holdingSpace = true
      this.jumpQueued = true
      // this.vy = -10
    }
  }

  onKeyUp(e) {
    if (e.code === "ArrowUp" || e.keyCode === 87) {
      this.holdingSpace = false
      this.holdingUp = false
    }
    if (e.code === "ArrowDown" || e.keyCode === 83) this.holdingDown = false
    if (e.code === "ArrowLeft" || e.keyCode === 65) this.holdingLeft = false
    if (e.code === "ArrowRight" || e.keyCode === 68) this.holdingRight = false
    if (e.keyCode === 32) this.holdingSpace = false
  }
}