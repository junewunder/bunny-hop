export default class Grid {
  cols = 0
  rows = 0
  solidity = []
  tileSize = 16

  static fromSolidity (map) {
    const grid = new Grid()
    grid.rows = map.length
    grid.cols = map[0].length
    grid.solidity = map.map(row => row.concat())
    return grid
  }

  get(x, y) { return this.solidity?.[y]?.[x] }
}