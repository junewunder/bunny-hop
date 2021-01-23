export default class Rect {
  x = 0;
  y = 0;
  w = 0;
  h = 0;

  constructor(pos, size) {
    this.pos = pos
    this.size = size
  }

  get pos() { return new Vec(this.x, this.y) }
  set pos({x, y}) { this.x = x; this.y = y }
  
  add({x, y}) {
    return new Rect(
      { x: this.x + x, y: this.y + y }, 
      { w: this.w, h: this.h }
    )
  }
  
  get size() { return new Vec(this.w, this.h) }
  set size({x, y, w, h}) { this.w = x || w; this.h = y || h }

  get center() { return new Vec(this.x + this.w / 2, this.y + this.h / 2) }
  set center({x, y}) {
    this.x = x - this.w / 2
    this.y = y - this.h / 2
  }

  get left() { return this.x }
  get right() { return this.x + this.w }
  get top() { return this.y }
  get bottom() { return this.y + this.h }

  overlaps(other) {
    return (
      this.x + this.w >= other.x 
      && this.y + this.h >= other.y
      && this.x < other.x + other.w
      && this.y < other.y + other.h
    )
  }
}