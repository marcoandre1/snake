let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
let score = 0;
let grid = 16;
let snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};
let count = 0;
let apple = {
    x: 320,
    y: 320
};
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// sets canvas width and height for mobile, could be a resize in future if needed
if (window.innerWidth < 400) {
    canvas.width = 300;
    canvas.height = 300;
    grid = 12;
    snake = {
        x: 120,
        y: 120,
        dx: grid,
        dy: 0,
        cells: [],
        maxCells: 3
    };
    count = 0;
    apple = {
        x: 240,
        y: 240
    };
}

// game loop
function loop() {
    requestAnimationFrame(loop);
    // slow game loop to 15 fps instead of 60 - 60/15 = 4
    // slow game loop to 10 fps instead of 60 - 60/10 = 6 for mobile
    if (canvas.width === 300) {
        if (++count < 6) {
            return
        }
    }
    else {
        if (++count < 4) {
            return;
        }
    }
    
    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    snake.x += snake.dx;
    snake.y += snake.dy;
    // wrap snake position on edge of screen
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    }
    else if (snake.x >= canvas.width) {
        snake.x = 0;
    }
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    }
    else if (snake.y >= canvas.height) {
        snake.y = 0;
    }
    // keep track of where snake has been. front of the array is always the head
    snake.cells.unshift({ x: snake.x, y: snake.y });
    // remove cells as we move away from them
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }
    //draw score
    context.font = 'caption';
    context.fillStyle = 'white';
    context.fillText("Score: " + score, 20, 30);
    // draw apple
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
    // draw snake
    context.fillStyle = 'green';
    snake.cells.forEach(function (cell, index) {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        // snake ate apple
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
            score++;
        }
        // check collision with all cells after this one (modified bubble sort)
        for (let i = index + 1; i < snake.cells.length; i++) {

            // collision. reset game
            if (canvas.width === 300) {
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    snake.x = 120;
                    snake.y = 120;
                    snake.cells = [];
                    snake.maxCells = 3;
                    snake.dx = grid;
                    snake.dy = 0;
                    apple.x = getRandomInt(0, 25) * grid;
                    apple.y = getRandomInt(0, 25) * grid;
                    score = 0;
                }
            }
            else {
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    snake.x = 160;
                    snake.y = 160;
                    snake.cells = [];
                    snake.maxCells = 4;
                    snake.dx = grid;
                    snake.dy = 0;
                    apple.x = getRandomInt(0, 25) * grid;
                    apple.y = getRandomInt(0, 25) * grid;
                    score = 0;
                }
            }
        }
    });
}

document.addEventListener('keydown', function (e) {
    // prevent snake from backtracking on itself
    if (e.which === 37 && snake.dx === 0) {
        // left arrow
        snake.dx = -grid;
        snake.dy = 0;
    }
    else if (e.which === 38 && snake.dy === 0) {
        // up arrow
        snake.dy = -grid;
        snake.dx = 0;
    }
    else if (e.which === 39 && snake.dx === 0) {
        // right arrow
        snake.dx = grid;
        snake.dy = 0;
    }
    else if (e.which === 40 && snake.dy === 0) {
        // down arrow
        snake.dy = grid;
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
            snake.dy = -grid;
            snake.dx = 0;
        }
        if (touchendY > touchstartY && snake.dy === 0) {
            // swiped down!
            snake.dy = grid;
            snake.dx = 0;
        }
    }
    else {
        if (touchendX < touchstartX && snake.dx === 0) {
            // swiped left!
            snake.dx = -grid;
            snake.dy = 0;
        }
        if (touchendX > touchstartX && snake.dx === 0) {
            // swiped right!
            snake.dx = grid;
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

requestAnimationFrame(loop);
