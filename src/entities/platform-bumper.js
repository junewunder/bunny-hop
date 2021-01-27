import Entity from '../blah/entity'

export default class PlatformBumper extends Entity {
  constructor(world, pos) {
    super({
      world, pos,
      spriteName: 'platformbumper',
      tags: ['platformsolid']
    })
  }
}