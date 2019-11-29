class Board {
  constructor(json, me) {
    this.width = json.width
    this.height = json.height

    this.matrix = new Array(json.width)
    for (var i = this.matrix.length - 1; i >= 0; i--) {
      this.matrix[i] = new Array(json.height)
    }

    // Food pieces
    for (let food of json.food) {
      this.matrix[food.x][food.y] = 'f'
    }

    // All snakes on this.matrix
    for (let snake of json.snakes) {
      for (let part of snake.body) {
        this.matrix[part.x][part.y] = 's'
      }
      
      this.matrix[snake.body[0].x][snake.body[0].y] = 'S'
    }

    // Label where I am
    for (let part of me.body) {
      this.matrix[part.x][part.y] = 'm'
    } 
    this.matrix[me.body[0].x][me.body[0].y] = 'M'
  }

  log () {
    for (var i = 0; i < this.matrix[0].length; i++) {
      let rowOutput = ''
      for (let column of this.matrix) {
        const char = column[i] || '.'
        rowOutput += `${char} `
      }
      console.log(rowOutput)
    }
  }

  safetyScore (proposed) {
    let score = 0

    // Proposed spot is gauranteed loss
    if (!this.isSafe(proposed)) {
      score = 0
      return score
    }

    if (this.isSafe(proposed).up) {
      score++
    }

    if (this.isSafe(proposed).down) {
      score++
    }

    if (this.isSafe(proposed).left) {
      score++
    }

    if (this.isSafe(proposed).right) {
      score++
    }
  }

  isSafe (proposed) {
    const safe = this.isOpen(proposed) && this.isNotDeadend(proposed)
    console.log(`Checking (${proposed.x},${proposed.y}) - ${safe}`)
    return safe
  }

  isOpen (proposed) {
    return proposed.x >= 0
      && proposed.y >= 0
      && proposed.x < this.width
      && proposed.y < this.height
      && (this.matrix[proposed.x][proposed.y] == 'f' || typeof this.matrix[proposed.x][proposed.y] == 'undefined')
  }

  isNotDeadend (proposed) {
    return this.isOpen(proposed.up) || this.isOpen(proposed.down) || this.isOpen(proposed.left) || this.isOpen(proposed.right)
  }
}

module.exports = Board
