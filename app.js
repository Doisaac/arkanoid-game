const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $sprite = document.querySelector('#sprite')
const $bricks = document.querySelector('#bricks')

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

/* BRICKS VARIABLES*/
const brickRowCount = 6
const brickColumnCount = 13
const brickWidth = 30
const brickHeight = 14
const brickPadding = 2
const brickOffsetTop = 80
const brickOffsetLeft = 17
const bricks = []

const BRICK_STATUS = {
  active: 1,
  destroyed: 0
}

for (let col = 0; col < brickColumnCount; col++) {
  bricks[col] = [] // initializes an empty array
  for (let row = 0; row < brickRowCount; row++) {
    // calculates brick position on the screen
    const brickX = col * (brickWidth + brickPadding) + brickOffsetLeft
    const brickY = row * (brickHeight + brickPadding) + brickOffsetTop
    // sets a random color to each brick
    const random = Math.floor(Math.random() * 8)
    // saves each brick information
    bricks[col][row] = {
      x: brickX,
      y: brickY,
      status: BRICK_STATUS.active,
      color: random
    }
  }
}

const PADDLE_SENSITIVITY = 8

function drawBall() {
  context.beginPath()
  context.arc(x, y, ballRadius, 0, Math.PI * 2)
  context.fillStyle = '#fff'
  context.fill()
  context.closePath()
}

function drawPaddle() {
  context.drawImage(
    $sprite, // image
    29, // clipX: cutting coordinates 
    174, // clipY: cutting coordinates 
    paddleWidth, // cut size
    paddleHeight, // cut size
    paddleX, // position x of the draw
    paddleY, // position y of the draw
    paddleWidth, // witdh of the draw
    paddleHeight // height of the draw
  )
}

function drawBricks() {
  for (let col = 0; col < brickColumnCount; col++) {
    for (let row = 0; row < brickRowCount; row++) {
      const currentBrick = bricks[col][row]
      if (currentBrick.status === BRICK_STATUS.destroyed) continue

      const clipX = currentBrick.color * 32

      context.drawImage(
        $bricks,
        clipX,
        0,
        brickWidth,
        brickHeight,
        currentBrick.x,
        currentBrick.y,
        brickWidth,
        brickHeight
      )
    }
  }
}

function collisionDetection() {
  for (let col = 0; col < brickColumnCount; col++) {
    for (let row = 0; row < brickRowCount; row++) {
      const currentBrick = bricks[col][row]
      if (currentBrick.status === BRICK_STATUS.destroyed) continue

      const isBallSameXAsBrick =
        x > currentBrick.x &&
        x < currentBrick.x + brickWidth

      const isBallSameYAsBrick =
        y > currentBrick.y &&
        y < currentBrick.y + brickWidth


      if (
        isBallSameXAsBrick &&
        isBallSameYAsBrick
      ) {
        dy = -dy
        currentBrick.status = BRICK_STATUS.destroyed
      }
    }
  }
}

function ballMovement() {
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

  // ball touches the paddle
  const isBallSameAsPaddle =
    x > paddleX &&
    x < paddleX + paddleWidth

  const isBallTouchingPaddle =
    y + dy > paddleY

  if (isBallSameAsPaddle && isBallTouchingPaddle) {
    dy = -dy // changes the direction
  } else if ( // ball touches the floor
    y + dy > canvas.height - ballRadius ||
    y + dy > paddleY + paddleHeight 
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