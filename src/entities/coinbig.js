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
    this.onCollide = onCollide
  }

  update() {
    super.update()
    if (this.collider.check(Vec.zero(), 'player')) {
      this.collected = true
    }
  }
}