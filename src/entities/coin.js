import Vec from '../blah/vec'
import Entity from "../blah/entity"
import makeSprite from '../blah/makeSprite'

export default class Coin extends Entity {
  collected = false
  
  constructor(world, pos, onCollide) {
    super({
      world,
      pos,
      tags : [],
      spriteName: 'coin',
      frames: 18
    })
    this.onCollide = other => {
      if (!other.tags?.includes('player')) return
      this.collected = true
      onCollide?.()
    }
  }

  update() {
    super.update()
    if (!this.collected) {
      this.collider.check(Vec.zero(), 'player')
    }
  }

  // moveX(amount) {
  //   console.log(amount)
  //   super.moveX(amount)
  // }

  destroy(afterAnim) {
    if (!this.collected) {
      super.destroy()
      return
    }

    this.swapTexture('coincollect', 7, {onLoop: () => {
      afterAnim?.()
      super.destroy()
    }})
  }
}