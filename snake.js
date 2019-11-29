const Position = require('./position.js')

class Snake {
  constructor(me) {
    this.head = new Position(me.body[0].x, me.body[0].y)
  }

  get up () {
    console.log(`Up is (${this.head.up.x},${this.head.up.y})`)
    return this.head.up
  }

  get down () {
    return this.head.down
  }

  get right () {
    return this.head.right
  }

  get left () {
    return this.head.left
  }
}

module.exports = Snake
