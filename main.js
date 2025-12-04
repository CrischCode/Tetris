const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const $score = document.querySelector('span');

const BLOCK_SIZE = 20;
const BLOCK_WIDTH = 14;
const BOARD_HEIGHT = 30;
let score = 0;

canvas.width = BLOCK_SIZE * BLOCK_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

const board = Array.from({ length: BOARD_HEIGHT }, () => Array(BLOCK_WIDTH).fill(0));

// Piezas
const PIECES = [
    [
        [1,1],
        [1,1]
    ],
    [
        [1,1,1,1]
    ],
    [
        [0,1,0],
        [1,1,1]
    ],
    [
        [1,1,0],
        [0,1,1]
    ],
    [
        [1,0],
        [1,0],
        [1,0]
    ],
    [
        [0,1],
        [0,1],
        [0,1]
    ]
];

// Pieza activa
const piece = {
    position: { x: Math.floor(BLOCK_WIDTH / 2 - 1), y: 0 },
    shape: PIECES[0].map(row => [...row])
};

// Game loop variables
let dropCounter = 0;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > 1000) {
        piece.position.y++;
        dropCounter = 0;

        if (checkCollision()) {
            piece.position.y--;
            solidifyPiece();
            removeRows();
        }
    }

    draw();
    window.requestAnimationFrame(update);
}

function draw() {
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Dibuja el tablero
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                context.fillStyle = "yellow";
                context.fillRect(x, y, 1, 1);
            }
        });
    });

    // Dibuja la pieza activa
    piece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value === 1) {
                context.fillStyle = "red";
                context.fillRect(dx + piece.position.x, dy + piece.position.y, 1, 1);
            }
        });
    });

    $score.innerText = score;
}

// Movimiento y rotación con WASD
document.addEventListener("keydown", (event) => {
    if (event.key === "a" || event.key === 'A') {
        piece.position.x--;
        if (checkCollision()) {
            piece.position.x++;
        }
    }

    if (event.key === "d" || event.key === 'D') {
        piece.position.x++;
        if (checkCollision()) {
            piece.position.x--;
        }
    }

    if (event.key === "s" || event.key === 'S') {
        piece.position.y++;
        if (checkCollision()) {
            piece.position.y--;
            solidifyPiece();
            removeRows();
        }
    }

    if (event.key === 'w' || event.key === 'W') {
        // Rotar la matriz (pieza) 90 grados a la derecha
        const N = piece.shape.length;
        const M = piece.shape[0].length;
        const rotated = [];
        for (let x = 0; x < M; x++) {
            rotated[x] = [];
            for (let y = N - 1; y >= 0; y--) {
                rotated[x][N - 1 - y] = piece.shape[y][x];
            }
        }
        const prevShape = piece.shape.map(row => [...row]);
        piece.shape = rotated;
        if (checkCollision()) {
            piece.shape = prevShape; // Si colisiona, no rota
        }
    }
});

function checkCollision() {
    return piece.shape.some((row, y) => {
        return row.some((value, x) => {
            if (value === 0) return false;
            const boardY = y + piece.position.y;
            const boardX = x + piece.position.x;
            return (
                boardY >= BOARD_HEIGHT ||
                boardX < 0 ||
                boardX >= BLOCK_WIDTH ||
                board[boardY]?.[boardX] === 1
            );
        });
    });
}

// Solidifica la pieza y genera una nueva
function solidifyPiece() {
    piece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value === 1) {
                board[dy + piece.position.y][dx + piece.position.x] = 1;
            }
        });
    });

    // Nueva pieza aleatoria (copia profunda)
    const next = PIECES[Math.floor(Math.random() * PIECES.length)];
    piece.shape = next.map(row => [...row]);
    piece.position.x = Math.floor(BLOCK_WIDTH / 2 - Math.floor(piece.shape[0].length / 2));
    piece.position.y = 0;

    if (checkCollision()) {
        window.alert('Game Over');
        board.forEach((row) => row.fill(0));
        score = 0;
    }
}

// Quitar líneas completas
function removeRows() {
    const rowsToRemove = [];
    board.forEach((row, y) => {
        if (row.every((value) => value === 1)) {
            rowsToRemove.push(y);
        }
    });

    rowsToRemove.forEach((y) => {
        board.splice(y, 1);
        const newRow = Array(BLOCK_WIDTH).fill(0);
        board.unshift(newRow);
        score += 10;
    });
}

update();