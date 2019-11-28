module.exports = {
  compute: (boardJSON, me) => {
    let board = new Array(boardJSON.width)
    for (var i = board.length - 1; i >= 0; i--) {
      board[i] = new Array(boardJSON.height)
    }

    // Food pieces
    for (let food of boardJSON.food) {
      board[food.x][food.y] = 'f'
    }

    // All snakes on board
    for (let snake of boardJSON.snakes) {
      for (let part of snake.body) {
        board[part.x][part.y] = 's'
      }
      
      board[snake.body[0].x][snake.body[0].y] = 'S'
    }

    // Label where I am
    for (let part of me.body) {
      board[part.x][part.y] = 'm'
    } 
    board[me.body[0].x][me.body[0].y] = 'M'

    logBoard(board)

    return board
  }
  isSafe: (proposed, board) => {
    return proposed.x != -1
      && proposed.y != -1
      && proposed.x != board.length
      && proposed.y != board[0].length
      && (board[proposed.x][proposed.y] == 'f' || typeof board[proposed.x][proposed.y] == 'undefined')
  }
}

const logBoard = (board) => {
  // Print out board for debugging
  for (var i = 0; i < board[0].length; i++) {
    let rowOutput = ''
    for (let column of board) {
      const char = column[i] || '.'
      rowOutput += `${char} `
    }
    console.log(rowOutput)
  }
}
