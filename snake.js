const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];

let apple = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};

let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let gameRunning = true;

// Event listeners para controlar la serpiente
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    switch(e.key) {
        case 'ArrowUp':
            if (direction.y === 0) nextDirection = { x: 0, y: -1 };
            e.preventDefault();
            break;
        case 'ArrowDown':
            if (direction.y === 0) nextDirection = { x: 0, y: 1 };
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if (direction.x === 0) nextDirection = { x: -1, y: 0 };
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (direction.x === 0) nextDirection = { x: 1, y: 0 };
            e.preventDefault();
            break;
    }
});

function update() {
    if (!gameRunning) return;

    direction = nextDirection;

    // Nueva cabeza
    const head = snake[0];
    const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };

    // Verificar colisión con bordes
    if (newHead.x < 0 || newHead.x >= tileCount || 
        newHead.y < 0 || newHead.y >= tileCount) {
        endGame();
        return;
    }

    // Verificar colisión con sí misma
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return;
    }

    snake.unshift(newHead);

    // Verificar si comió la manzana
    if (newHead.x === apple.x && newHead.y === apple.y) {
        score += 10;
        apple = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } else {
        snake.pop();
    }
}

function draw() {
    // Limpiar canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar serpiente
    ctx.fillStyle = '#00ff00';
    snake.forEach((segment, index) => {
        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );

        // Cabeza diferente color
        if (index === 0) {
            ctx.fillStyle = '#00cc00';
            ctx.fillRect(
                segment.x * gridSize + 1,
                segment.y * gridSize + 1,
                gridSize - 2,
                gridSize - 2
            );
            ctx.fillStyle = '#00ff00';
        }
    });

    // Dibujar manzana
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(
        apple.x * gridSize + gridSize / 2,
        apple.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Dibujar puntuación
    const scoreElement = document.getElementById('score') || createScoreElement();
    scoreElement.textContent = `Puntuación: ${score}`;
}

function createScoreElement() {
    const scoreDiv = document.createElement('div');
    scoreDiv.id = 'score';
    document.body.appendChild(scoreDiv);
    return scoreDiv;
}

function endGame() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('¡GAME OVER!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText(`Puntuación: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

function gameLoop() {
    update();
    draw();
}

// Iniciar el juego
setInterval(gameLoop, 100);
