class Position {
  constructor(me) {
    this.x = me.x
    this.y = me.y
  }

  up () {
    return {x: this.x, y: this.y - 1}
  }

  down () {
    return {x: this.x, y: this.y + 1}
  }

  right () {
    return {x: this.x + 1, y: this.y}
  }

  left () {
    return {x: this.x - 1, y: this.y}
  }
}

module.exports = Position
