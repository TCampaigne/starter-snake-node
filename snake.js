const Position = require('./position.js')

class Snake {
  constructor(me) {
    console.log(`Defining snake (${me.body[0].x},${me.body[0].y})`)
    this.head = new Position(me.body[0].x, me.body[0].y)
  }

  up () {
    return this.head.up
  }

  down () {
    return this.head.down
  }

  right () {
    return this.head.right
  }

  left () {
    return this.head.left
  }
}

module.exports = Snake
