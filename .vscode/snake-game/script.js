const CELL_SIZE = 40;
const CANVAS_SIZE = 600;
//made faster
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
//this
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};

let MOVE_INTERVAL = 120;

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head: head,
    body: body,
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake(color) {
  return {
    color: color,
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
  };
}

let snake1 = initSnake('blue');

let apple1 = {
  color: 'red',
  position: initPosition(),
};
let apple2 = {
  color: 'red',
  position: initPosition(),
};

function drawApple(ctx, x, y) {
  let img = document.getElementById('apple');
  ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnakeHead(ctx, x, y) {
  let img = document.getElementById('snakeHead');
  ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnakeBody(ctx, x, y) {
  let img = document.getElementById('snakeBody');
  ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
  let scoreCanvas;
  if (snake.color == snake1.color) {
    scoreCanvas = document.getElementById('score1Board');
  }
  let scoreCtx = scoreCanvas.getContext('2d');

  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = '30px Arial';
  scoreCtx.fillStyle = snake.color;
  scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

//-----------------------
function drawSpeed(snake) {
  let speedCanvas;
  if (snake.color == snake1.color) {
    speedCanvas = document.getElementById('speedBoard');
  }
  let speedCtx = speedCanvas.getContext('2d');

  speedCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  speedCtx.font = '30px Arial';
  speedCtx.fillStyle = snake.color;
  speedCtx.fillText(MOVE_INTERVAL, 10, speedCanvas.scrollHeight / 2);
}
//------------------------

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById('snakeBoard');
    let ctx = snakeCanvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawSnakeHead(ctx, snake1.head.x, snake1.head.y, snake1.color);
    for (let i = 1; i < snake1.body.length; i++) {
      drawSnakeBody(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
    }

    // drawCell(ctx, apple.position.x, apple.position.y, apple.color);
    drawApple(ctx, apple1.position.x, apple1.position.y, apple1.color);
    drawApple(ctx, apple2.position.x, apple2.position.y, apple2.color);

    // drawCell(ctx, apple1.position.x, apple1.position.y, apple1.color);
    // drawCell(ctx, apple2.position.x, apple2.position.y, apple2.color);

    drawScore(snake1);
  }, REDRAW_INTERVAL);
}

// function draw() {
//   setInterval(function () {
//     let snakeCanvas = document.getElementById('snakeBoard');
//     let ctx = snakeCanvas.getContext('2d');

//     ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

//     drawSnakeHead(ctx, snake1.head.x, snake1.head.y, snake1.color);
//     for (let i = 1; i < snake1.body.length; i++) {
//       drawSnakeBody(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
//     }

//     // mengganti dengan gambar apel
//     var img = document.getElementById('apple');
//     drawApple(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
//     drawApple(img, apple2.position.x * CELL_SIZE, apple2.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

//     // drawCell(ctx, apple.position.x, apple.position.y, apple.color);
//     // drawCell(ctx, apple2.position.x, apple2.position.y, apple2.color);

//     drawScore(snake1);
//   }, REDRAW_INTERVAL);
// }

function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}

function eat(snake, apple) {
  if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
    apple.position = initPosition();
    snake.score++;
    snake.body.push({ x: snake.head.x, y: snake.head.y });

    // if (snake.position.x == apple.position.x && snake.position.y == apple.position.y) {
    //   apple.position = initPosition();
    //   snake.score++;
  }
}

//---------------
function kebut() {
  snake.speed = MOVE_INTERVAL;
  if (snake.score % 5 == 0) {
    snake.speed = (100 - snake.speed) * -1;
  }
}
//----------------------

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apple1);
  eat(snake, apple2);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apple1);
  eat(snake, apple2);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apple1);
  eat(snake, apple2);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apple1);
  eat(snake, apple2);
}

function checkCollision(snake) {
  let isCollide = false;
  //this
  for (let i = 0; i < snake.length; i++) {
    for (let j = 0; j < snake.length; j++) {
      for (let k = 1; k < snake[j].body.length; k++) {
        if (snake[i].head.x == snake[j].body[k].x && snake[i].head.y == snake[j].body[k].y) {
          isCollide = true;
        }
      }
    }
  }
  if (isCollide) {
    alert('Game over');
    snake1 = initSnake('blue');
  }
  return isCollide;
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }

  moveBody(snake);
  if (!checkCollision(snake1)) {
    setTimeout(function () {
      move(snake);
    }, MOVE_INTERVAL);
  } else {
    initGame();
  }
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') {
    turn(snake1, DIRECTION.LEFT);
  } else if (event.key === 'ArrowRight') {
    turn(snake1, DIRECTION.RIGHT);
  } else if (event.key === 'ArrowUp') {
    turn(snake1, DIRECTION.UP);
  } else if (event.key === 'ArrowDown') {
    turn(snake1, DIRECTION.DOWN);
  }
});
function initGame() {
  move(snake1);
}
initGame();
