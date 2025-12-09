const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const $score = document.querySelector('span');

const BLOCK_SIZE = 22;
const BLOCK_WIDTH = 14;
const BOARD_HEIGHT = 25;
let score = 0;

canvas.width = BLOCK_SIZE * BLOCK_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

const board = Array.from({ length: BOARD_HEIGHT }, () => Array(BLOCK_WIDTH).fill(0));

// Piezas
const PIECES = [
    // 1: O (Amarillo)
    { 
        shape: [
            [1, 1],
            [1, 1]
        ],
        colorIndex: 1 
    },
    // 2: I (Cian)
    { 
        shape: [
            [2, 2, 2, 2]
        ],
        colorIndex: 2 
    },
    // 3: T (Púrpura)
    { 
        shape: [
            [0, 3, 0],
            [3, 3, 3]
        ],
        colorIndex: 3 
    },
    // 4: Z (Rojo)
    { 
        shape: [
            [4, 4, 0],
            [0, 4, 4]
        ],
        colorIndex: 4 
    },
    // 5: S (Lima)
    { 
        shape: [
            [0, 5, 5],
            [5, 5, 0]
        ],
        colorIndex: 5 
    },
    // 6: L (Naranja)
    { 
        shape: [
            [6, 0],
            [6, 0],
            [6, 6]
        ],
        colorIndex: 6 
    },
    // 7: J (Azul)
    { 
        shape: [
            [0, 7],
            [0, 7],
            [7, 7]
        ],
        colorIndex: 7 
    }
];

// Pieza activa
const piece = {
    position: { x: Math.floor(BLOCK_WIDTH / 2 - 1), y: 0 },
    shape: PIECES[0].shape.map(row => [...row]),
    colorIndex: PIECES[0].colorIndex
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
            if (value !== 0) {
                context.fillStyle = COLORS[value];
                context.fillRect(x, y, 1, 1);
            }
        });
    });

    // Dibuja la pieza activa
    piece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value !== 0) {
                context.fillStyle = COLORS[piece.colorIndex];
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
                board[boardY]?.[boardX] !== 0
            );
        });
    });
}

// Solidifica la pieza y genera una nueva
function solidifyPiece() {
    piece.shape.forEach((row, dy) => {
        row.forEach((value, dx) => {
            if (value !== 0) {
                board[dy + piece.position.y][dx + piece.position.x] = value;
            }
        });
    });

    // Nueva pieza aleatoria (copia profunda)
    const nextPieceIndex = Math.floor(Math.random() * PIECES.length);
    const next = PIECES[nextPieceIndex];
    piece.shape = next.shape.map(row => [...row]);
    piece.colorIndex = next.colorIndex;
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
        if (row.every((value) => value !== 0)) {
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

// Darle color a la pieza 

const COLORS = [
    null,
    'yellow',
    'cyan',
    'purple',
    'green',
    'red',
    'orange',
    'blue'
]

update();