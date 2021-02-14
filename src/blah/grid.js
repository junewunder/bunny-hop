export default class Grid {
  cols = 0
  rows = 0
  solidity = []
  tileSize = 16

  static fromSolidity (solidity, rows, cols) {
    const grid = new Grid()
    grid.rows = rows
    grid.cols = cols
    grid.solidity = solidity.concat()
    return grid
  }

  get(x, y) { return this.solidity?.[x + y * this.cols] }
}