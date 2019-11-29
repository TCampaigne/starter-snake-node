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

  get upleft () {
    return new Position(this.x - 1, this.y - 1)
  }

  get downleft () {
    return new Position(this.x - 1, this.y + 1)
  }

  get upright () {
    return new Position(this.x + 1, this.y - 1)
  }

  get downright () {
    return new Position(this.x + 1, this.y + 1)
  }
}

module.exports = Position
