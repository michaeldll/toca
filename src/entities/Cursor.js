import config from '../config.js'

class Cursor {
  constructor() {
    // append later
    this.position = {
      x: Math.floor(
        config.board.dimensions.x / 4 +
          (Math.random() * config.board.dimensions.x * 1) / 2,
      ),
      y: Math.floor(
        config.board.dimensions.y / 4 +
          (Math.random() * config.board.dimensions.y * 1) / 2,
      ),
    }
    console.log('player ready')
  }

  // direction: 'x' | 'y'
  move(direction, distance) {
    this.position[direction] += distance
  }

  set({ x, y }) {
    this.position = { x, y }
  }

  get() {
    return this.position
  }
}

export default Cursor
