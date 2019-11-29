const BoardChars = {
  OPEN: '.',
  FOOD: 'f',
  ENEMYHEAD: 'S',
  ENEMYBODY: 's',
  MYHEAD: 'M',
  MYBODY: 'm',
}


class Board {
  constructor(json, me) {
    this.width = json.width
    this.height = json.height
    this.health = me.health

    this.matrix = new Array(json.width).fill(BoardChars.OPEN)
    for (var i = this.matrix.length - 1; i >= 0; i--) {
      this.matrix[i] = new Array(json.height).fill(BoardChars.OPEN)
    }

    // Food pieces
    for (let food of json.food) {
      this.matrix[food.x][food.y] = BoardChars.FOOD
    }

    // All snakes on this.matrix
    for (let snake of json.snakes) {
      for (let part of snake.body) {
        this.matrix[part.x][part.y] = BoardChars.ENEMYBODY
      }
      
      this.matrix[snake.body[0].x][snake.body[0].y] = BoardChars.ENEMYBODY
    }

    // Label where I am
    for (let part of me.body) {
      this.matrix[part.x][part.y] = BoardChars.MYBODY
    } 
    this.matrix[me.body[0].x][me.body[0].y] = BoardChars.MYHEAD
  }

  log () {
    for (var i = 0; i < this.matrix[0].length; i++) {
      let rowOutput = ''
      for (let column of this.matrix) {
        const char = column[i]
        rowOutput += `${char} `
      }
      console.log(rowOutput)
    }
  }

  safetyScore (proposed) {
    let score = 0

    // Proposed spot is gauranteed loss
    if (!this.isValid(proposed)) {
      score = 0
      return score
    }

    if (this.isFood(proposed)) {
      score = score + (100 * ((100 - this.health) / 100))
    }

    if (this.isValid(proposed.up)) {
      score = score + 100;
    }

    if (this.isValid(proposed.down)) {
      score = score + 100;
    }

    if (this.isValid(proposed.left)) {
      score = score + 100;
    }

    if (this.isValid(proposed.right)) {
      score = score + 100;
    }

    let enemies = 0
    if (this.isEnemy(proposed.upleft)) {
      enemies++
    }
    if (this.isEnemy(proposed.upright)) {
      enemies++
    }
    if (this.isEnemy(proposed.downleft)) {
      enemies++
    }
    if (this.isEnemy(proposed.downright)) {
      enemies++
    }

    return score - (enemies*50)
  }

  isValid (proposed) {
    const safe = this.isSafe(proposed) && this.isNotDeadend(proposed)
    // console.log(`Checking (${proposed.x},${proposed.y}) - ${safe}`)
    return safe
  }

  isSafe (proposed) {
    return this.isInBounds(proposed) && (this.isOpen(proposed) || this.isFood(proposed))
  }

  isInBounds (proposed) {
    return proposed.x >= 0
      && proposed.y >= 0
      && proposed.x < this.width
      && proposed.y < this.height
  }

  isOpen (proposed) {
    return this.matrix[proposed.x] && this.matrix[proposed.x][proposed.y] == BoardChars.OPEN
  }

  isFood (proposed) {
    return this.matrix[proposed.x] && this.matrix[proposed.x][proposed.y] == BoardChars.FOOD
  }

  isNotDeadend (proposed) {
    return this.isSafe(proposed.up) || this.isSafe(proposed.down) || this.isSafe(proposed.left) || this.isSafe(proposed.right)
  }

  isEnemy (proposed) {
    return this.matrix[proposed.x] && this.matrix[proposed.x][proposed.y] == BoardChars.ENEMYHEAD
  }
}

module.exports = Board
