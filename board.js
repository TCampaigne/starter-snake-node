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

    this.matrix = new Array(this.width)
    for (var i = this.matrix.length - 1; i >= 0; i--) {
      this.matrix[i] = new Array(this.height).fill(BoardChars.OPEN)
    }

    this.scoreMatrix = new Array(this.width)
    for (var i = 0; i < this.width; i++) {
      this.scoreMatrix[i] = new Array(this.height).fill(0)
    }

    this.distanceMatrix = new Array(this.width)
    for (var i = 0; i < this.width; i++) {
      this.distanceMatrix[i] = new Array(this.height).fill(0)
      for (var j = 0; j < this.height; j++) {
        this.distanceMatrix[i][j] = Math.abs(this.mePos.x - i) + Math.abs(this.mePos.y - j)
      }
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

  logDistance () {
    for (var i = 0; i < this.distanceMatrix[0].length; i++) {
      let rowOutput = ''
      for (let column of this.distanceMatrix) {
        const distance = column[i]
        rowOutput += `${distance} `
      }
      console.log(rowOutput)
    }
  }

  safetyScore (proposed) {
    let score = 0
    // Proposed spot is gauranteed loss
    if (!this.isValid(proposed) || this.distanceOf(proposed) > 4) {
      return 0
    } else if (this.scoreMatrix[proposed.x][proposed.y] != 0) {
      return this.scoreMatrix[proposed.x][proposed.y]
    }

    score += this.spaceScore(proposed)

    const distanceFactor = 5 / (5 + this.distanceOf(proposed))

    if (this.distanceOf(proposed.up) > this.distanceOf(proposed)) {
      score += this.safetyScore(proposed.up) * distanceFactor
    }
    if (this.distanceOf(proposed.down) > this.distanceOf(proposed)) {
      score += this.safetyScore(proposed.down) * distanceFactor
    }
    if (this.distanceOf(proposed.left) > this.distanceOf(proposed)) {
      score += this.safetyScore(proposed.left) * distanceFactor
    }
    if (this.distanceOf(proposed.right) > this.distanceOf(proposed)) {
      score += this.safetyScore(proposed.right) * distanceFactor
    }

    this.scoreMatrix[proposed.x][proposed.y].score = score
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

  distanceOf (proposed) {
    return Math.abs(this.mePos.x - proposed.x) + Math.abs(this.mePos.y - proposed.y)
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
