const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 448
canvas.height = 400

/* GAME VARIABLES */

/* BALL VARIABLES */
const ballRadius = 3
/* ball position */
let x = canvas.width / 2
let y = canvas.height - 30
/* ball speed */
let dx = -3
let dy = -3

/* PADDLE VARIABLES */
const paddleHeight = 10
const paddleWidth = 50

let paddleX = (canvas.width - paddleWidth) / 2
let paddleY = canvas.height - paddleHeight - 10

let rightPressed = false
let leftPressed = false

const PADDLE_SENSITIVITY = 8

function drawBall() {
  context.beginPath()
  context.arc(x, y, ballRadius, 0, Math.PI * 2)
  context.fillStyle = '#fff'
  context.fill()
  context.closePath()
}

function drawPaddle() {
  context.fillStyle = '#fff'
  context.fillRect(
    paddleX,
    paddleY,
    paddleWidth,
    paddleHeight
  )
}

function drawBricks() { }

function collisionDetection() {
  // lateral rebound
  if (
    x + dx > canvas.width - ballRadius || // rigth wall
    x + dx < ballRadius // left wall
  ) {
    dx = -dx
  }

  // top wall
  if (y + dy < ballRadius) {
    dy = -dy
  }
}

function ballMovement() {
  // ball touches the paddle
  const isBallSameAsPaddle =
    x > paddleX &&
    x < paddleX + paddleWidth

  const isBallTouchingPaddle =
    y + dy > paddleY

  if (isBallSameAsPaddle && isBallTouchingPaddle) {
    dy = -dy // changes the direction
  } else if ( // ball touches the floor
    y + dy > canvas.height - ballRadius
  ) {
    console.log('Game Over')
  }

  x += dx
  y += dy
}

function paddleMovement() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += PADDLE_SENSITIVITY
  } else if (leftPressed && paddleX > 0) {
    paddleX -= PADDLE_SENSITIVITY
  }
}

function cleanCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height)
}

function initEvents() {
  document.addEventListener('keydown', keyDownHandler)
  document.addEventListener('keyup', keyUpHandler)

  function keyDownHandler(event) {
    const { key } = event
    if (key === 'Rigth' || key === 'ArrowRight') {
      rightPressed = true;
    } else if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = true;
    }
  }

  function keyUpHandler(event) {
    const { key } = event
    if (key === 'Rigth' || key === 'ArrowRight') {
      rightPressed = false;
    } else if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = false;
    }
  }
}

function draw() {
  console.log(rightPressed, leftPressed)
  cleanCanvas()
  // drawing the elements
  drawBall()
  drawPaddle()
  drawBricks()

  // colisions and movements
  collisionDetection()
  ballMovement()
  paddleMovement()

  window.requestAnimationFrame(draw)
}

draw()
initEvents()