const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

const Board = require('./computeBoard.js')
const Position = require('./position.js')
const Snake = require('./snake.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game

  // Response data
  const data = {
    color: '#ff00f7',
    headType: 'beluga',
    tailType: 'hook',
  }

  return response.json(data)
})

// Handle POST request to '/move'
app.post('/move', (request, response) => {

  const me = new Snake(request.body.you)
  console.log(`Current location is x:${me.head.x} y:${me.head.y}`)

  const board = new Board(request.body.board, request.body.you)
  board.log()
  let move = 'up'

  const moves = {
    up: board.safetyScore(me.up),
    down: board.safetyScore(me.down),
    left: board.safetyScore(me.left),
    right: board.safetyScore(me.right),
  }

  move = Object.keys(moves).reduce((a, b) => obj[a] > obj[b] ? a : b)

  console.log(`Move is:${move}`)
  return response.json({
    move: move,
  })
})

app.post('/end', (request, response) => {
  // NOTE: Any cleanup when a game is complete.
  return response.json({})
})

app.post('/ping', (request, response) => {
  // Used for checking if this snake is still alive.
  return response.json({});
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})

process.on('uncaughtException', function(err) {
  // handle the error safely
  console.log(err)
})
