// canvas + context
const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");
const button = document.getElementById("button");
const btnEasy = document.getElementById("btnEasy");
const btnMedium = document.getElementById("btnMedium");
const btnHard = document.getElementById("btnHard");
const html = document.getElementById("html");
const body = document.getElementById("body");

// snake is dead bool
let snakeDead = false;

// game unit
const unit = 32;

//images
const floor = new Image();
floor.src = "/img/floor.png";

const foodImage = new Image();
foodImage.src = "/img/arbs.png";

// audio
const left = new Audio();
const up = new Audio();
const right = new Audio();
const down = new Audio();
const dead = new Audio();
const eat = new Audio();

left.src = "/audio/left.mp3";
up.src = "/audio/up.mp3";
right.src = "/audio/right.mp3";
down.src = "/audio/down.mp3";
dead.src = "/audio/dead.mp3";
eat.src = "/audio/eat.mp3";

// creating the snake and setting position to center
let snake = [];
snake[0] = {
  x: 9 * unit,
  y: 10 * unit
};

// creating the food
let food = {
  x: Math.floor(Math.random() * 17 + 1) * unit,
  y: Math.floor(Math.random() * 15 + 3) * unit
};

// score
let score = 0;

// controlling the snake
document.addEventListener("keydown", direction);
let drc;

function direction(event) {
  if (event.keyCode === 37 && drc != "RIGHT") {
    left.play();
    drc = "LEFT";
  } else if (event.keyCode === 38 && drc != "DOWN") {
    up.play();
    drc = "UP";
  } else if (event.keyCode === 39 && drc != "LEFT") {
    right.play();
    drc = "RIGHT";
  } else if (event.keyCode === 40 && drc != "UP") {
    down.play();
    drc = "DOWN";
  }
}

// collision function
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

// check if the snake is dead function to show/hide Restart button
const checkDead = () => {
  if (snakeDead) {
    button.className = "button nohide";
    btnEasy.className = "button nohide easy";
    btnMedium.className = "button nohide medium";
    btnHard.className = "button nohide hard";
  } else {
    button.className = "button hide";
    btnEasy.className = "button hide ";
    btnMedium.className = "button hide ";
    btnHard.className = "button hide ";
  }
};

// draw function
const draw = () => {
  context.drawImage(floor, 0, 0);

  // Styling the snake: head - green, body - white, border - red
  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = i === 0 ? "green" : "white";
    context.fillRect(snake[i].x, snake[i].y, unit, unit);

    context.strokeStyle = "red";
    context.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
  // drawing food
  context.drawImage(foodImage, food.x, food.y);

  // current head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // moving direction
  if (drc == "LEFT") {
    snakeX -= unit;
  }
  if (drc == "UP") {
    snakeY -= unit;
  }
  if (drc == "RIGHT") {
    snakeX += unit;
  }
  if (drc == "DOWN") {
    snakeY += unit;
  }

  // snake eats -> refresh food position
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    eat.play();

    let posX = Math.floor(Math.random() * 17 + 1) * unit;
    let posY = Math.floor(Math.random() * 15 + 3) * unit;

    food = {
      x: posX,
      y: posY
    };
  } else {
    // remove tail
    snake.pop();
  }

  // add new head
  let newHead = {
    x: snakeX,
    y: snakeY
  };

  // game over check
  if (
    snakeX < unit || // hits left wall
    snakeX > 17 * unit || // hits right wall
    snakeY < 3 * unit || // hits top wall
    snakeY > 17 * unit || // hits bottom wall
    collision(newHead, snake)
  ) {
    clearInterval(game);
    dead.play();
    snakeDead = true;
    drc = "";
    checkDead();
  }

  snake.unshift(newHead);

  context.fillStyle = "lightgreen";
  context.font = "40px Montserrat";
  context.fillText(`Score: ${score}`, 3 * unit, 1.5 * unit);
};
// set interval speed
let intervalSpeed = 100;

// refreshing the canvas
let game = setInterval(draw, intervalSpeed);

const setSpeed = value => {
  drc = "";
  let gradientImage = "linear-gradient(45deg,  green, blue)";

  if (value === "easy") {
    intervalSpeed = 150;
    gradientImage =
      "linear-gradient(45deg,rgb(0, 128, 122), rgb(154, 154, 197))";
    html.style.background = gradientImage;
  }

  if (value === "medium") {
    intervalSpeed = 100;
    gradientImage = "linear-gradient(45deg,  green, blue)";
    html.style.background = gradientImage;
  }

  if (value === "hard") {
    intervalSpeed = 50;
    gradientImage = "linear-gradient(45deg, rgb(128, 0, 0), rgb(0, 0, 0))";
    html.style.background = gradientImage;
  }
  restartGame();
};

btnEasy.addEventListener("click", () => setSpeed("easy"));
btnMedium.addEventListener("click", () => setSpeed("medium"));
btnHard.addEventListener("click", () => setSpeed("hard"));

// restarting game
const restartGame = () => {
  clearInterval(game);
  drc = "";
  score = 0;
  snakeDead = false;
  checkDead();
  game = setInterval(draw, intervalSpeed);
  snake = [];
  snake[0] = {
    x: 9 * unit,
    y: 10 * unit
  };
};

// Click event listener
button.addEventListener("click", restartGame);
