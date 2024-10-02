const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 100, y: 100 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let playerName = '';
let playerHistory = JSON.parse(localStorage.getItem('playerHistory')) || [];

document.getElementById('highScore').innerText = highScore;
document.getElementById('playerHistory').innerHTML = playerHistory.map(player => 
    `<li>${player.name}: ${player.score}</li>`).join('');

const startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', startGame);

function startGame() {
    playerName = document.getElementById('playerName').value.trim();
    if (!playerName) {
        alert('Please enter your name!');
        return;
    }
    
    document.getElementById('login').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');
    direction = { x: 0, y: 0 };
    snake = [{ x: 200, y: 200 }];
    score = 0;
    spawnFood();
    gameLoop();
}

function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        endGame();
        return;
    }

    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 10;
        snake.push({ ...snake[snake.length - 1] });
        spawnFood();
    }

    drawGame();
    setTimeout(gameLoop, 100); 
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x * 20, y: snake[0].y + direction.y * 20 };
    snake.unshift(head);
    snake.pop();
}

function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    return false;
}

function endGame() {
    document.getElementById('game-over').classList.remove('hidden');
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').innerText = highScore;
    }

    playerHistory.push({ name: playerName, score });
    localStorage.setItem('playerHistory', JSON.stringify(playerHistory));
    document.getElementById('playerHistory').innerHTML = playerHistory.map(player => 
        `<li>${player.name}: ${player.score}</li>`).join('');

    setTimeout(() => {
        document.getElementById('login').classList.remove('hidden');
    }, 2000);
}

function spawnFood() {
    food.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
    food.y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
}

function drawGame() {
    // Clear the canvas before each draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    snake.forEach(segment => {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x, segment.y, 20, 20);  // Draw each snake segment
    });

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);

    // Update score
    document.getElementById('score').innerText = score;
}

// Set direction based on key press
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});
