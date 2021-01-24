import Vec from '../blah/vec'
import Entity from "../blah/entity"

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
    this.onCollide = onCollide
  }

  update() {
    super.update()
    if (this.collider.check(Vec.zero(), 'player')) {
      this.collected = true
    }
  }
}