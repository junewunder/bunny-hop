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
    this.onCollide = this.onCollidedWith = () => {
      this.collected = true
      onCollide()
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

    this.swapTexture('coincollect', 7, {onLoop: () => {
      afterAnim?.() // todo figure out whats happening here
      super.destroy()
    }})
  }
}