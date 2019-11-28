module.exports = {
  compute: (boardJSON, me) => {
    let board = new Array(boardJSON.width)
    for (var i = board.length - 1; i >= 0; i--) {
      board[i] = new Array(boardJSON.height)
    }
    console.log('Computing game state...')

    // Food pieces
    for (let food of boardJSON.food) {
      console.log(`Food piece at (${food.x},${food.y})`)
      board[food.x][food.y] = 'f'
    }

    // All snakes on board
    for (let snake of boardJSON.snakes) {
      for (let part of snake.body) {
        console.log(`Snake piece at (${part.x},${part.y})`)
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
}

const logBoard = (board) => {
  // Print out board for debugging
  for (var i = board[0].length - 1; i >= 0; i--) {
    let rowOutput = ''
    for (let column of board) {
      const char = column[i] || '.'
      rowOutput += `${char} `
    }
    console.log(rowOutput)
  }
}
