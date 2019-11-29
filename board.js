const Position = require('./position.js')
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
    this.mePos = new Position(me.body[0].x, me.body[0].y)

    this.matrix = new Array(json.width).fill(BoardChars.OPEN)
    for (var i = this.matrix.length - 1; i >= 0; i--) {
      this.matrix[i] = new Array(json.height).fill(BoardChars.OPEN)
    }

    this.scoreMatrix = new Array(json.width).fill(0)
    for (var i = this.scoreMatrix.length - 1; i >= 0; i--) {
      this.scoreMatrix[i] = new Array(json.height).fill(0)
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
      
      this.matrix[snake.body[0].x][snake.body[0].y] = BoardChars.ENEMYHEAD
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

  logScores () {
    for (var i = 0; i < this.scoreMatrix[0].length; i++) {
      let rowOutput = ''
      for (let column of this.scoreMatrix) {
        const score = Math.round(column[i]).toString()
        rowOutput += `${score + '.'.repeat(4 - score.length)} `
      }
      console.log(rowOutput)
    }
  }

  safetyScore (proposed) {
    let score = 0
    const distance = Math.max(Math.abs(this.mePos.x - proposed.x), Math.abs(this.mePos.y - proposed.y))
    console.log(`Scoring (${proposed.x},${proposed.y}) at ${distance}`)
    // Proposed spot is gauranteed loss
    if (distance > 4 || !this.isValid(proposed)) {
      return 0
    } else if (this.scoreMatrix[proposed.x][proposed.y] != 0) {
      return this.scoreMatrix[proposed.x][proposed.y]
    }

    this.scoreMatrix[proposed.x][proposed.y] = 'in progress'
    score += this.spaceScore(proposed)

    const distanceFactor = 5 / (5 + distance)

    score += this.safetyScore(proposed.up) * distanceFactor
    score += this.safetyScore(proposed.down) * distanceFactor
    score += this.safetyScore(proposed.left) * distanceFactor
    score += this.safetyScore(proposed.right) * distanceFactor

    this.scoreMatrix[proposed.x][proposed.y] = score
    return score
  }

  spaceScore (proposed) {
    let score = 0
    if (this.isEnemy(proposed)) {
      score = -1000
    } else if (!this.isValid(proposed)) {
      score = 0
    } else if (this.isFood(proposed)) {
      score = 100 + (200 * ((100 - this.health) / 100)^(100 - this.health))
    } else if (this.isOpen(proposed)) {
      score = 100
    }

    return score
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
