let gameCanvas = document.getElementById("game");
let ctx = gameCanvas.getContext("2d");

// CANVAS STYLES
const CANVAS_BORDER_COLOR = "black";
const CANVAS_BG_COLOR = "white";
ctx.fillStyle = CANVAS_BG_COLOR;
ctx.strokeStyle = CANVAS_BORDER_COLOR;

ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
/////////////////

// SNAKE STUFF
const SNAKE_COLOR = "lightgreen";
const SNAKE_BORDER_COLOR = "darkgreen";

let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
  { x: 100, y: 150 },
  { x: 90, y: 150 }
];

// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

let score = 0;
let speed = 100;

// Snake color rendering
function drawSnakePart(snakePart) {
  ctx.fillStyle = SNAKE_COLOR;
  ctx.strokeStyle = SNAKE_BORDER_COLOR;

  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

// Snake body rendering
function drawSnake() {
  snake.forEach(drawSnakePart);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  // unshift adds to start of array returns new length
  snake.unshift(head);

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    score += 1;
    speed -= 5;
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("speed").innerHTML = "Speed: " + speed;
    createFood();
  } else {
    // pop removes last element of snake array
    snake.pop();
  }
}
///////////////

// food stuffs

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}
function createFood() {
  foodX = randomTen(0, gameCanvas.width - 10);
  foodY = randomTen(0, gameCanvas.height - 10);
  snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x == foodX && part.y == foodY;
    if (foodIsOnSnake) createFood();
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.strokestyle = "darkred";
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}

//////////////

function gameOver() {
  for (i = 4; i < snake.length; i++) {
    const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;

    if (didCollide) return true;
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > gameCanvas.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > gameCanvas.height - 10;

  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

// key bindings and events
function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.keyCode;
  const up = dy === -10;
  const down = dy === 10;
  const right = dx === 10;
  const left = dx === -10;

  if (keyPressed === LEFT_KEY && !right) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !up) {
    dx = 0;
    dy = -10;
  }

  if (keyPressed === RIGHT_KEY && !left) {
    dx = 10;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !down) {
    dx = 0;
    dy = 10;
  }
}
document.addEventListener("keydown", changeDirection);
//////////////////////////

// animation functions
function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";

  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function main() {
  if (gameOver()) return;

  setTimeout(function onTick() {
    changingDirection = false;
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    // loop main
    main();
  }, speed);
}
createFood();
main();
///////////////////////
