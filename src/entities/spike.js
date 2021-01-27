import Entity from '../blah/entity'
import Vec from '../blah/vec'

export default class Spike extends Entity {

  constructor(world, pos, onCollide) {
    super({
      world, pos,
      spriteName: 'spike',
      tags: ['solid', 'death'],
    })
    this.collider.tags = ['solid', 'death']
    this.sprite.animationSpeed = .03
    this.onCollide = onCollide
  }

  onCollidedWith() {
    this.onCollide()
  }
}