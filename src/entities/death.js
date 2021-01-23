import {Container} from 'pixi.js'
import Entity from '../blah/entity'
import Vec from '../blah/vec'

export default class Death extends Entity {
  constructor(world, pos, onCollide) {
    super({
      world,
      pos,
      tags: ['death'],
      spriteName: 'death',
    })
    this.onCollide = onCollide
    // world.stage.addChild()
  }

  update() {
    super.update()
    this.collider.check(Vec.zero(), 'player')
  }
}