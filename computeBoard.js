class Board {
  constructor(json, me) {
    this.width = json.width
    this.height = json.height

    this.board = new Array(json.width)
    for (var i = this.board.length - 1; i >= 0; i--) {
      this.board[i] = new Array(json.height)
    }

    // Food pieces
    for (let food of json.food) {
      this.board[food.x][food.y] = 'f'
    }

    // All snakes on this.board
    for (let snake of json.snakes) {
      for (let part of snake.body) {
        this.board[part.x][part.y] = 's'
      }
      
      this.board[snake.body[0].x][snake.body[0].y] = 'S'
    }

    // Label where I am
    for (let part of me.body) {
      this.board[part.x][part.y] = 'm'
    } 
    this.board[me.body[0].x][me.body[0].y] = 'M'
  }

  log () {
    for (var i = 0; i < this.board[0].length; i++) {
      let rowOutput = ''
      for (let column of this.board) {
        const char = column[i] || '.'
        rowOutput += `${char} `
      }
      console.log(rowOutput)
    }
  }

  isOpen (proposed, board)  {
    return proposed.x >= 0
      && proposed.y >= 0
      && proposed.x < this.width
      && proposed.y < this.height
      && (board[proposed.x][proposed.y] == 'f' || typeof board[proposed.x][proposed.y] == 'undefined')
  }
}

module.exports = Board
