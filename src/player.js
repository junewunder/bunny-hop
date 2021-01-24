import * as PIXI from 'pixi.js'
import Vec from './blah/vec'
import Entity from './blah/entity'

export default class Player extends Entity {

  onGround = false
  holdingUp = false
  holdingDown = false
  holdingRight = false
  holdingLeft = false
  holdingSpace = false

  jumpQueued = false
  framesSinceJump = 0
  JUMP_QUEUE_LENGTH = 30

  constructor(world) {
    super({
      world,
      // spriteName: 'happie',
      // spriteName: 'turtle',
      spriteName: 'bunnysprite',
      frames: 8,
      pos: new Vec(100, 100),
      tags: ['player']
    })

    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  update() {
    super.update()
    this.onGround = this.collider.check(new Vec(0, 1), 'solid')
    const { onGround, holdingLeft, holdingRight, holdingSpace, jumpQueued, framesSinceJump } = this

    if (holdingRight && !holdingLeft) {
      if (onGround) this.vy -= 3
      this.vx += onGround ? 2 : 1
    }
    if (holdingLeft && !holdingRight) {
      if (onGround) this.vy -= 3
      this.vx += onGround ? -2 : -1
    }
    if (
      (holdingSpace || (jumpQueued && framesSinceJump < this.JUMP_QUEUE_LENGTH)) 
      && onGround) {
      this.jumpQueued = false
      this.vy = -7
    }
    if (jumpQueued) this.framesSinceJump++

    if (this.vx === 0 && this.sprite.currentFrame === 0) {
      this.sprite.stop?.()
    }
    if (this.vx !== 0 && !this.sprite.playing) {
      this.sprite.play?.()
    }
    // this.container.x = 
  }

  onKeyDown(e) {
    if (e.code === "ArrowUp" || e.keyCode === 87) this.holdingUp = true
    if (e.code === "ArrowDown" || e.keyCode === 83) this.holdingDown = true
    if (e.code === "ArrowLeft" || e.keyCode === 65) {
      this.holdingLeft = true
      // this.vy -= 5
      // this.vx += -2
      // this.vx += -1
    }
    if (e.code === "ArrowRight" || e.keyCode === 68) {
      this.holdingRight = true
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
    if (e.code === "ArrowUp" || e.keyCode === 87) this.holdingUp = false
    if (e.code === "ArrowDown" || e.keyCode === 83) this.holdingDown = false
    if (e.code === "ArrowLeft" || e.keyCode === 65) this.holdingLeft = false
    if (e.code === "ArrowRight" || e.keyCode === 68) this.holdingRight = false
    if (e.keyCode === 32) this.holdingSpace = false
  }
}