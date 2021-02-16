import Entity from '../blah/entity'
import Vec from '../blah/vec'

export default class Sign extends Entity {
  static signNames = {
    empty: 0,
    exitRight: 1,
    exitLeft: 2,
  }

  constructor(world, pos, name, tags, querytag, onCollide) {
    super({
      world,
      pos,
      tags,
      spriteName: `signs ${Sign.signNames[name] || 0}`,
    })
    this.onCollide = onCollide
    this.querytag = querytag
  }

  update() {
    super.update()
    this.collider.check(Vec.zero(), this.querytag)
  }
}