import Vec from "./vec"
import Rect from './rect'
import Grid from './grid'

export default class Collider {

  static RECT = Symbol('RECT')
  static GRID = Symbol('GRID')

  active = true
  shape = null
  hitbox = null
  tags = []
  entity

  constructor () {}

  static makeRect (entity, rect, tags = []) {
    const collider = new Collider();
    collider.shape = Collider.RECT
    collider.entity = entity
    collider.hitbox = rect
    collider.tags = collider.tags.concat(tags)
    return collider
  }
  static makeGrid (grid, tags = []) {
    const collider = new Collider();
    collider.shape = Collider.GRID
    collider.hitbox = grid
    collider.tags = collider.tags.concat(tags)
    return collider
  }

  check(offset, tag) {
    for (let other of this.entity.world.colliders(tag)) {
      if (this === other) continue
      if (this.overlaps(other, offset)) {
        return true
      }
    }
    return false
  }

  overlaps(other, offset) {
    if (this.shape === Collider.RECT) {
      if (other.shape === Collider.RECT) {
        return Collider.rectRectOverlaps(this, other, offset)
      }
      if (other.shape === Collider.GRID) {
        return Collider.gridRectOverlaps(other, this, offset)
      }
    }
    // if (this.shape === Collider.GRID) {
    //   return Collider.gridRectOverlaps(other, this, offset)
    // }
  }

  static rectRectOverlaps(a, b, offsetA) {
    const ar = a.hitbox.add(a.entity.pos).add(offsetA)
    const br = b.hitbox.add(b.entity.pos)

    if (ar.overlaps(br)) {
      a.entity.onCollide?.()
      b.entity.onCollidedWith?.()
      return true
    }
    return false
  }

  static gridRectOverlaps(grid, rect, offset) {
    const {max, min, floor, ceil, round} = Math
    const ar = rect.hitbox.add(rect.entity.pos).add(offset) // TODO: minus b.pos (which is always zero right now)

    const left = round(min(max(floor(ar.left / grid.hitbox.tileSize), 0), grid.hitbox.cols))
    const right = round(min(max(ceil(ar.right / grid.hitbox.tileSize), 0), grid.hitbox.cols))
    const top = round(min(max(floor(ar.top / grid.hitbox.tileSize), 0), grid.hitbox.rows))
    const bottom = round(min(max(ceil(ar.bottom / grid.hitbox.tileSize), 0), grid.hitbox.rows))

    for (let x = left; x < right; x++)
      for (let y = top; y < bottom; y++)
        if (grid.hitbox.solidity[y][x]) {
          rect.entity.onCollidedWith?.()
          return true;
        }

    return false
  }
}