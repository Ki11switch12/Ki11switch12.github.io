const GRID_SIZE = 20;
const GRID_WIDTH = 400 / GRID_SIZE;
const GRID_HEIGHT = 400 / GRID_SIZE;
const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };
const FPS = 10;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let score = 0;
const scoreCounter = document.getElementById("scoreCounter");

class Snake {
  constructor() {
    this.body = [{ x: GRID_WIDTH / 2, y: GRID_HEIGHT / 2 }];
    this.direction = RIGHT;
  }

  move() {
    const head = { ...this.body[0] };
    head.x = (head.x + this.direction.x + GRID_WIDTH) % GRID_WIDTH;
    head.y = (head.y + this.direction.y + GRID_HEIGHT) % GRID_HEIGHT;
    this.body.unshift(head);
    this.body.pop();
  }

  changeDirection(dx, dy) {
    if (dx !== -this.direction.x && dy !== -this.direction.y) {
      this.direction.x = dx;
      this.direction.y = dy;
    }
  }

  grow() {
    const tail = { ...this.body[this.body.length - 1] };
    this.body.push(tail);
  }

  checkCollision(foodPosition) {
    const head = this.body[0];
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true; // Snake collided with itself
      }
    }

    if (head.x === foodPosition.x && head.y === foodPosition.y) {
      return "food"; // Snake collided with the food
    }

    return false;
  }

  draw() {
    this.body.forEach((segment) => {
      ctx.fillStyle = "green";
      ctx.fillRect(
        segment.x * GRID_SIZE,
        segment.y * GRID_SIZE,
        GRID_SIZE,
        GRID_SIZE
      );
    });
  }
}

class Food {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.randomizePosition();
  }

  randomizePosition() {
    this.position.x = Math.floor(Math.random() * GRID_WIDTH);
    this.position.y = Math.floor(Math.random() * GRID_HEIGHT);
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.position.x * GRID_SIZE,
      this.position.y * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE
    );
  }
}

const snake = new Snake();
let food = new Food();

function update() {
  snake.move();

  const collision = snake.checkCollision(food.position);
  if (collision === "food") {
    snake.grow();
    food.randomizePosition();
    score++;
    scoreCounter.textContent = "Score: " + score;
  } else if (collision) {
    clearInterval(gameLoop);
    alert("Game Over! Your final score is: " + score);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.draw();
  food.draw();
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      snake.changeDirection(0, -1);
      break;
    case "ArrowDown":
      snake.changeDirection(0, 1);
      break;
    case "ArrowLeft":
      snake.changeDirection(-1, 0);
      break;
    case "ArrowRight":
      snake.changeDirection(1, 0);
      break;
  }
});

const gameLoop = setInterval(update, 1000 / FPS);
