class Position {
  constructor(me) {
    this.x = me.x
    this.y = me.y
  }

  up () {
    {x: this.x, y: this.y - 1}
  }

  down () {
    {x: this.x, y: this.y + 1}
  }

  right () {
    {x: this.x + 1, y: this.y}
  }

  left () {
    {x: this.x - 1, y: this.y}
  }
}

module.exports = Position
