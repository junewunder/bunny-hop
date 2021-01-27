import Entity from '../blah/entity'
import Vec from '../blah/vec'

export default class MovingPlatform extends Entity {
  constructor(world, pos, {vx, vy}) {
    super({
      world, pos,
      spriteName: 'movingplatform',
      tags: ['solid', 'platformsolid']
    })
    this.vx = vx
    this.vy = vy
  }

  update() {
    this.moveX(this.vx)
    this.moveY(this.vy)
    this.sprite.x = this.x * this.world.scale
    this.sprite.y = this.y * this.world.scale
  }

  // TODO: maybe make an abstraction for this probably not
  moveX(amount) {
    while (amount >= 1 || amount <= -1) {
      const sign = Math.sign(amount)
      if (this.collider.check(new Vec(sign, 0), 'solid')
        || this.collider.check(new Vec(sign, 0), 'platformsolid')) {
        this.vx = -this.vx
        return
      }

      amount -= sign
      this.x += sign
    }
  }

  moveY(amount) {
    while (amount >= 1 || amount <= -1) {
      const sign = Math.sign(amount)
      if (this.collider.check(new Vec(0, sign), 'solid')
        || this.collider.check(new Vec(0, sign), 'platformsolid')) {
        this.vy = 0
        return
      }

      amount -= sign
      this.y += sign
    }
  }
}