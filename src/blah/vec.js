export default class Vec {
  x = 0
  y = 0

  static zero() {
    return new Vec(0, 0)
  }

  constructor (x, y) {
    this.x = x
    this.y = y
  }
}