class Position {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  up () {
    return new Position(this.x, this.y - 1)
  }

  down () {
    return new Position(this.x, this.y + 1)
  }

  right () {
    return new Position(this.x + 1, this.y)
  }

  left () {
    return new Position(this.x - 1, this.y)
  }
}

module.exports = Position
