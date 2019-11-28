class Position {
  constructor(me) {
    this.x = me.x
    this.y = me.y
  }

  up () {
    {x: me.x, y: me.y - 1}
  }

  down () {
    {x: me.x, y: me.y + 1}
  }

  right () {
    {x: me.x + 1, y: me.y}
  }

  left () {
    {x: me.x - 1, y: me.y}
  }
}

module.exports = Position
