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

  alreadyJumped = false

  jumpQueued = false
  framesSinceJumpQueued = 0
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
      if (!this.sprite.playing) {
        this.sprite.play()
      }
      this.sprite.x = this.x * this.world.scale
      this.sprite.y = this.y * this.world.scale
      return
    }
    
    super.update()

    // UPDATE CONSTANTS
    this.onGround = this.collider.check(new Vec(0, 1), 'solid')
    const { onGround, holdingLeft, holdingRight, holdingSpace, jumpQueued, framesSinceJumpQueued } = this

    if (onGround) this.framesOffGround = 0
    else this.framesOffGround++
    
    if (onGround) this.framesOnGround++
    else this.framesOnGround = 0

    // MOVE RIGHT/LEFT
    if (holdingRight && !holdingLeft) {
      if (onGround && this.framesOnGround > this.hopCooldown) this.vy -= 3
      this.vx += onGround ? 2 : 1
    }
    if (holdingLeft && !holdingRight) {
      if (onGround && this.framesOnGround > this.hopCooldown) this.vy -= 3
      this.vx += onGround ? -2 : -1
    }

    // REGULAR JUMP
    if (holdingSpace && !jumpQueued) this.jumpQueued = true

    const jump = (j) => {
      this.jumpQueued = false
      this.alreadyJumped = true
      this.vy = j
    }

    const jumpInputted = (holdingSpace || (jumpQueued && framesSinceJumpQueued < this.JUMP_QUEUE_LENGTH))
    if (jumpInputted && (onGround && !this.alreadyJumped)) {
      console.log('jump 1')
      jump(-7)
    }

    if ((holdingSpace && this.framesOffGround <= this.JUMP_FORGIVENESS)) {
      console.log('jump 2')
      jump(-7)
    }
    if (jumpQueued) this.framesSinceJumpQueued++
    if (!holdingSpace) this.alreadyJumped = false

    // STOP/START SPRITE WHEN STILL OR MOVING
    if (Math.abs(this.vx) < 1 && this.sprite.currentFrame === 0) {
      this.sprite.stop?.()
    }
    if (Math.abs(this.vx) > 1 && !this.sprite.playing) {
      this.sprite.play?.()
    }
  }

  respawn() {
    this.respawning = true
    this.swapTexture('bunnyrespawn', 8, {onLoop: () => {
      this.respawning = false
      this.swapTexture('bunnysprite', 8)
    }})
  }

  onKeyDown(e) {
    if (e.code === "ArrowUp" || e.keyCode === 87) this.holdingSpace = true 
    if (e.code === "ArrowDown" || e.keyCode === 83) this.holdingDown = true
    if (e.code === "ArrowLeft" || e.keyCode === 65) this.holdingLeft = true
    if (e.code === "ArrowRight" || e.keyCode === 68) this.holdingRight = true
    if (e.keyCode === 32) {
      this.holdingSpace = true
      // this.jumpQueued = true
    }
  }

  onKeyUp(e) {
    if (e.code === "ArrowUp" || e.keyCode === 87) this.holdingSpace = false
    if (e.code === "ArrowDown" || e.keyCode === 83) this.holdingDown = false
    if (e.code === "ArrowLeft" || e.keyCode === 65) this.holdingLeft = false
    if (e.code === "ArrowRight" || e.keyCode === 68) this.holdingRight = false
    if (e.keyCode === 32) this.holdingSpace = false
  }
}