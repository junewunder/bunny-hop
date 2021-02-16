import Vec from '../blah/vec'
import Entity from "../blah/entity"

export default class CoinBig extends Entity {
  collected = false
  
  constructor(world, pos, onCollide) {
    super({
      world,
      pos,
      tags : [],
      spriteName: 'coinbig',
      frames: 28
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

  destroy(afterAnim) {
    if (!this.collected) {
      super.destroy()
      return
    }

    this.swapTexture('coinbigcollect', 8, {
      onLoop: () => {
        afterAnim?.()
        super.destroy()
      }
    })
  }
}