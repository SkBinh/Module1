let board;
let boardWidth = 1000;
let boardHeight = 1000;
let ctx;
//slide
let slideWidth = 200;
let slideHeight = 15;
let slideVelocityX = 100;

let slide ={
    x: boardWidth / 2 - slideWidth / 2,
    y: boardHeight - slideHeight -5,
    width: slideWidth,
    height: slideHeight,
    velocityX: slideVelocityX
}
//ball
let ballWidth = boardWidth / 50;
let ballHeight = boardHeight / 50;
let ballVelocityX = 10;
let ballVelocityY = 5;

let ball = {
    x: boardWidth / 2,
    y : boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
}
//block
let blockArr = [];
let blockWidth = boardWidth / 10;
let blockHeight = boardHeight / 50;
let blockColumns = boardWidth / blockWidth;
let blockRows = 3;
let blockMaxRows = 10;
let blockCount = 0;

let blockX = 10;
let blockY = 45;

let score = 0;
let gameOver = false;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    ctx = board.getContext("2d"); 

    ctx.fillStyle = "white";
    ctx.fillRect(slide.x, slide.y, slide.width, slide.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveSlide);

    createBlock();
}
function update () {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    ctx.clearRect(0, 0, boardWidth, boardHeight);
    //slide
    ctx.fillStyle = "white";
    ctx.fillRect(slide.x, slide.y, slide.width, slide.height);
    //ball
    ctx.fillStyle = "red";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height);

    if (ball.y <= 0) {
        ball.velocityY *= -1;
        
    }else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {
        ball.velocityX *= -1;      
    }else if (ball.y + ball.height >= boardHeight) {
        ctx.font = boardWidth /20  +'px' + " Arial" ; 
        ctx.textAlign ="center";  
        ctx.fillText("Game Over: Press 'Space' to Restart", boardWidth /2 , boardHeight / 2);
        ctx.textAlign ="start";
        gameOver = true;
    }

    if (topCollision(ball, slide) || bottomCollision(ball, slide)) {
        ball.velocityY *= -1;
    }else if (leftCollision(ball, slide) || rightCollision(ball, slide)) {
        ball.velocityX *= -1;
    }
    //block
    ctx.fillStyle = "lightblue";
    for (let i = 0; i < blockArr.length; i++) {
        let block = blockArr[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true;
                ball.velocityY *= -1;
                blockCount -= 1;
                score += 1000;
            }else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true;
                ball.velocityX *= -1;
                blockCount -= 1;
                score += 1000;
            }

            ctx.fillRect(block.x, block.y, block.width, block.height);
        }
    }
    if (blockCount == 0) {    
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlock();
    }
    ctx.font = "25px Arial";
    ctx.fillText(score, 25, 25);
}
function outOfBounds(xPositon) {
    return (xPositon < 0 || xPositon + slide.width > boardWidth);
}
function moveSlide (e) {
    if (gameOver){
        if(e.code == "Space"){
            resetGame();
        }
    }
    if (e.code == "ArrowLeft") {
        let nextSlideX = slide.x - slide.velocityX;
        if (!outOfBounds(nextSlideX)) {
            slide.x = nextSlideX;
        }
    }else if (e.code == "ArrowRight") {
        let nextSlideX = slide.x + slide.velocityX;
        if (!outOfBounds(nextSlideX)) {
            slide.x = nextSlideX;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
function topCollision(ball, block) {
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block) {
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) {
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlock() {
    blockArr = [];
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x: blockX + c*blockWidth + c*10,
                y: blockY + r*blockHeight + r*10,
                width: blockWidth,
                height: blockHeight,
                break: false
            }
            blockArr.push(block);
        }
    }
    blockCount = blockArr.length;
}

function resetGame() {
    gameOver = false;
    slide ={
        x: boardWidth / 2 - slideWidth / 2,
        y: boardHeight - slideHeight -5,
        width: slideWidth,
        height: slideHeight,
        velocityX: slideVelocityX
    }

    ball = {
        x: boardWidth / 2 - ballWidth / 2,
        y: boardHeight / 2 - ballHeight / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: ballVelocityX,
        velocityY: ballVelocityY
    }
    blockArr = [];
    blockRows = 3;
    score = 0;
    createBlock();
}