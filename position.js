class Snake {
  constructor(me) {
    this.x = me.body[0].x
    this.y = me.body[0].y
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

module.exports = Snake
