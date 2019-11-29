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

    this.matrix = new Array(json.width)
    for (var i = this.matrix.length - 1; i >= 0; i--) {
      this.matrix[i] = new Array(json.height).fill(BoardChars.OPEN)
    }

    this.scoreMatrix = new Array(json.width)
    for (var i = this.scoreMatrix.length - 1; i >= 0; i--) {
      this.scoreMatrix[i] = new Array(json.height).fill({score: 0, distance: 0})
      for (var j = scoreMatrjx.length - 1; j >= 0; j--) {
        scoreMatrix[i][j].distance = Math.abs(this.mePos.x - i) + Math.abs(this.mePos.y - j)
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
        const score = Math.round(column[i].score).toString()
        rowOutput += `${score + '.'.repeat(4 - score.length)} `
      }
      console.log(rowOutput)
    }
  }

  safetyScore (proposed) {
    let score = 0
    console.log(`Scoring (${proposed.x},${proposed.y}) at ${distanceOf(proposed)}`)
    // Proposed spot is gauranteed loss
    if (distanceOf(proposed) > 4 || !this.isValid(proposed)) {
      return 0
    } else if (this.scoreMatrix[proposed.x][proposed.y].score != 0) {
      return this.scoreMatrix[proposed.x][proposed.y].score
    }

    score += this.spaceScore(proposed)

    const distanceFactor = 5 / (5 + distanceOf(proposed))

    if (distanceOf(proposed.up) > distanceOf(proposed)) {
      score += this.safetyScore(proposed.up) * distanceFactor
    }
    if (distanceOf(proposed.down) > distanceOf(proposed)) {
      score += this.safetyScore(proposed.down) * distanceFactor
    }
    if (distanceOf(proposed.left) > distanceOf(proposed)) {
      score += this.safetyScore(proposed.left) * distanceFactor
    }
    if (distanceOf(proposed.right) > distanceOf(proposed)) {
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
    return this.scoreMatrix[proposed.x][proposed.y].distance
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
