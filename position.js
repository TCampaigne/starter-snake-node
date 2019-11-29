class Position {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  get up () {
    return new Position(this.x, this.y - 1)
  }

  get down () {
    return new Position(this.x, this.y + 1)
  }

  get right () {
    return new Position(this.x + 1, this.y)
  }

  get left () {
    return new Position(this.x - 1, this.y)
  }
}

module.exports = Position
