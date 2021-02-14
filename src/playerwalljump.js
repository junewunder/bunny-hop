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

  framesSinceJump = 0
  alreadyJumped = false
  // jumpCooldown = 10
  // jumpQueued = false
  // JUMP_QUEUE_LENGTH = 10

  dashCooldown = 60
  framesSinceDash = 0

  framesGrabbingWall = 0
  framesSinceWallJump = 0
  wallJumpStartup = 20
  wallJumpCooldown = 10

  hopCooldown = 15
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
    super.update()

    this.onGround = this.collider.check(new Vec(0, 1), 'solid')
    this.wallRight = this.collider.check(new Vec(1, 0), 'solid')
    this.wallLeft = this.collider.check(new Vec(-1, 0), 'solid')

    const { 
      onGround, wallLeft, wallRight,
      holdingLeft, holdingRight, holdingSpace, 
      jumpQueued, framesSinceJump 
    } = this

    if (onGround) this.framesOffGround = 0
    else this.framesOffGround++
    
    if (onGround) this.framesOnGround++
    else this.framesOnGround = 0

    // DASH, this actually doesn't fit very well with bunny
    // this.framesSinceDash++
    // if (this.framesSinceDash > this.dashCooldown && this.holdingDown) {
    //   console.log('DASH!')
    //   this.framesSinceDash = 0
    //   this.vx += 7 * this.facing
    // }
    // this.limitVelocity = this.framesSinceDash > 10

    // WALL FRICTION
    if (this.wallLeft && this.holdingLeft) {
      this.vy += .25
      this.vy = Math.min(this.vy, .75)
    }

    // MOVE RIGHT
    if (holdingRight && !holdingLeft) {
      if (onGround && this.framesOnGround > this.hopCooldown) this.vy -= 3
      this.vx += onGround ? 2 : 1
    }
    // MOVE LEFT
    if (holdingLeft && !holdingRight) {
      if (onGround && this.framesOnGround > this.hopCooldown) this.vy -= 3
      this.vx += onGround ? -2 : -1
    }

    // WALLJUMP
    if (wallLeft || wallRight) this.framesGrabbingWall++
    else this.framesGrabbingWall = 0
    
    this.framesSinceWallJump++

    if (wallLeft && holdingSpace 
        && this.framesSinceWallJump > this.wallJumpCooldown
        && this.framesGrabbingWall > this.wallJumpStartup) {
      this.vy = -7
      this.vx = 10
      this.framesSinceWallJump = 0
    }
    
    if (wallRight && holdingSpace 
        && this.framesSinceWallJump > this.wallJumpCooldown
        && this.framesGrabbingWall > this.wallJumpStartup) {
      this.vy = -7
      this.vx = -10
      this.framesSinceWallJump = 0
    }

    // REGULAR JUMP
    this.framesSinceJump++
    if ( holdingSpace
      && !this.alreadyJumped
      && (onGround || this.framesOffGround <= this.JUMP_FORGIVENESS)
    ) {
      this.alreadyJumped = true
      this.jumpQueued = false
      this.framesSinceJump = 0
      this.vy = -8
    }

    if (holdingSpace && this.alreadyJumped && this.framesSinceJump < 30) {
      this.vy += -0.3
    }
    
    if (!holdingSpace) this.alreadyJumped = false
    
    // STOP/START SPRITE WHEN STILL OR MOVING
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