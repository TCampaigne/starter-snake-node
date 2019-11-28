module.exports = {
  compute: (boardJSON, me) => {
    let board = new Array(boardJSON.width)
    for (let column in board) {
      board[column] = new Array(boardJSON.height)
    }
    console.log('Computing game state...')
    // Food pieces
    for (let food of boardJSON.food) {
      board[food.x] ||= []
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

    // Print out board for debugging
    for (let row of board) {
      let rowOutput = ''
      for (let space of row) {
        rowOutput += `${space} `
      }
      
      console.log(rowOutput)
    }

    return board
  }
}
