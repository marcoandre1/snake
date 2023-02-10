const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// sets canvas width and height for mobile, could be a resize in future if needed
if (window.innerWidth < 400) {
    canvas.width = 300;
    canvas.height = 300;
} else {
    canvas.width = 400;
    canvas.height = 400;
}

// sets the pixels in a rectangular area to transparent black
ctx.clearRect(0, 0, canvas.width, canvas.height);

// square dimension in pixels
const square = canvas.width === 300 ? 12 : 16;

let snake = {
    x: canvas.width === 300 ? 120 : 160,
    y: canvas.width === 300 ? 120 : 160,
    dx: square,
    dy: 0,
    cells: [],
    maxCells: 4
};

let apple = {
    x: canvas.width === 300 ? 240 : 320,
    y: canvas.width === 300 ? 240 : 320
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

let score = 0;

let previousGameTimeStamp = performance.now();
let previousTimeStamp = performance.now();
const intendedFps = 15
const fpsInterval = 1000 / intendedFps;

// game loop
function loop(timestamp) {

    const gameElapsed = timestamp - previousGameTimeStamp;

    const elapsed = (timestamp - previousTimeStamp) / 1000;

    if (gameElapsed > fpsInterval) {
        // commonly required at the start of each frame in an animation
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const fps = Math.round(1 / elapsed);
        ctx.font = 'caption';
        ctx.fillStyle = 'white';
        ctx.fillText("device FPS: " + fps, 20, 50);

        const gameFps = Math.round(1000 / gameElapsed);
        ctx.font = 'caption';
        ctx.fillStyle = 'white';
        ctx.fillText("game FPS: " + gameFps, 20, 70);
    
        //draw score
        ctx.font = 'caption';
        ctx.fillStyle = 'white';
        ctx.fillText("Score: " + score, 20, 30);
    
        // draw apple
        ctx.fillStyle = `rgb(
            255,
            ${Math.floor(255 - 42.5 * (score % 6))},
            0)`;
        ctx.fillRect(apple.x, apple.y, square - 1, square - 1);
    
        // snake head moves in the x, y direction
        snake.x += snake.dx;
        snake.y += snake.dy;
    
        // wrap snake position on edge of screen
        if (snake.x < 0) {
            snake.x = canvas.width - square;
        }
        else if (snake.x >= canvas.width) {
            snake.x = 0;
        }
        if (snake.y < 0) {
            snake.y = canvas.height - square;
        }
        else if (snake.y >= canvas.height) {
            snake.y = 0;
        }
    
        // Keeps track of the snake head by inserting the given values to the beginning of the array
        snake.cells.unshift({ x: snake.x, y: snake.y });
        
        // remove cells as we move away from them
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }
        
        // draw snake
        ctx.fillStyle = 'green';
        snake.cells.forEach(function (cell, index) {
            ctx.fillRect(cell.x, cell.y, square - 1, square - 1);
            // snake ate apple
            if (cell.x === apple.x && cell.y === apple.y) {
                score++;
                snake.maxCells++;
                apple.x = getRandomInt(0, 25) * square;
                apple.y = getRandomInt(0, 25) * square;
            }
            // check collision with all cells after this one (modified bubble sort)
            for (let i = index + 1; i < snake.cells.length; i++) {
    
                // collision. reset game
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    snake.x = canvas.width === 300 ? 120 : 160;
                    snake.y = canvas.width === 300 ? 120 : 160;
                    snake.cells = [];
                    snake.maxCells = 4;
                    snake.dx = square;
                    snake.dy = 0;
                    apple.x = getRandomInt(0, 25) * square;
                    apple.y = getRandomInt(0, 25) * square;
                    score = 0;
                }
            }
        });

        previousGameTimeStamp = timestamp;
    }

    previousTimeStamp = timestamp;

    // keeps the loop going
    window.requestAnimationFrame(loop);
}

// initialize the loop
window.requestAnimationFrame(loop);

document.addEventListener("keydown", (event) => {
    // prevent snake from backtracking on itself
    if ((event.key === "ArrowLeft" || event.key === "a") && snake.dx === 0) {
        snake.dx = -square;
        snake.dy = 0;
    }
    else if ((event.key === "ArrowUp" || event.key === "w") && snake.dy === 0) {
        snake.dy = -square;
        snake.dx = 0;
    }
    else if ((event.key === "ArrowRight" || event.key === "d") && snake.dx === 0) {
        snake.dx = square;
        snake.dy = 0;
    }
    else if ((event.key === "ArrowDown" || event.key === "s") && snake.dy === 0) {
        snake.dy = square;
        snake.dx = 0;
    }
});

let touchstartX = 0
let touchendX = 0
let touchstartY = 0
let touchendY = 0
    
function checkDirection() {
    if (Math.abs(touchendY - touchstartY) > Math.abs(touchendX - touchstartX)) {
        if (touchendY < touchstartY && snake.dy === 0) {
            // swiped up!
            snake.dy = -square;
            snake.dx = 0;
        }
        if (touchendY > touchstartY && snake.dy === 0) {
            // swiped down!
            snake.dy = square;
            snake.dx = 0;
        }
    }
    else {
        if (touchendX < touchstartX && snake.dx === 0) {
            // swiped left!
            snake.dx = -square;
            snake.dy = 0;
        }
        if (touchendX > touchstartX && snake.dx === 0) {
            // swiped right!
            snake.dx = square;
            snake.dy = 0;
        }
    }
}

document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX
    touchstartY = e.changedTouches[0].screenY
})
  
document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX
    touchendY = e.changedTouches[0].screenY
    checkDirection()
})
