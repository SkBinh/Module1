// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Superman class
class Superman {
  constructor() {
    this.x = 100;
    this.y = canvas.height / 2;
    this.size = 30;
    this.gravity = 0.6;
    this.lift = -10;
    this.velocity = 0;
  }

  draw() {
    ctx.fillStyle = "#ff0";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Prevent Superman from going off screen
    if (this.y + this.size > canvas.height) {
      this.y = canvas.height - this.size;
      this.velocity = 0;
    } else if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }

  flyUp() {
    this.velocity = this.lift;
  }
}

// Pipe class
class Pipe {
  constructor() {
    this.x = canvas.width;
    this.width = 60;
    this.gap = 150;
    this.top = Math.floor(Math.random() * (canvas.height - this.gap));
    this.bottom = this.top + this.gap;
  }

  draw() {
    ctx.fillStyle = "#0f0";
    ctx.fillRect(this.x, 0, this.width, this.top);
    ctx.fillRect(this.x, this.bottom, this.width, canvas.height - this.bottom);
  }

  update() {
    this.x -= 3; // Speed of pipes moving left
  }

  offScreen() {
    return this.x + this.width < 0;
  }
}

// Initialize game variables
const superman = new Superman();
let pipes = [];
let frameCount = 0;
let score = 0;
let gameOver = false;

// Control Superman with the space key
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !gameOver) {
    superman.flyUp();
  }
});

// Create new pipes every 90 frames
function addPipe() {
  pipes.push(new Pipe());
}

// Check collision between Superman and pipe
function checkCollision(pipe) {
  return (
    superman.x + superman.size > pipe.x &&
    superman.x < pipe.x + pipe.width &&
    (superman.y < pipe.top || superman.y + superman.size > pipe.bottom)
  );
}

// Update game state
function updateGame() {
  superman.update();

  // Create new pipes periodically
  if (frameCount % 90 === 0) {
    addPipe();
  }

  // Update each pipe's position and check for collisions
  pipes.forEach((pipe, index) => {
    pipe.update();
    if (checkCollision(pipe)) {
      gameOver = true;
    }

    // Remove pipes that are off screen and increment score
    if (pipe.offScreen()) {
      pipes.splice(index, 1);
      score++;
    }

  });

  frameCount++;
}

// Render game objects
function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Superman and pipes
  superman.draw();
  pipes.forEach(pipe => pipe.draw());

  // Display score
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 20, 30);

  // Show game over message if needed
  if (gameOver) {
    ctx.fillStyle = "#f00";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2);
    ctx.fillText("Press F5 to Restart", canvas.width / 2 - 100, canvas.height / 2 + 40);
  }
}

// Main game loop
function gameLoop() {
  if (!gameOver) {
    updateGame();
    renderGame();
    requestAnimationFrame(gameLoop);
  } else {
    renderGame(); // Display game over message
  }
}

// Start game loop
gameLoop();
