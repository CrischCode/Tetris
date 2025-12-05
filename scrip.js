import { BoardTetris } from "./boardTetris.js";

const canvasTetris = document.getElementById('canvas')
const rows = 20
const cols = 10
const cellSize = 26
const space = 2

const boardT = new BoardTetris(canvasTetris, rows, cols, cellSize, space)

function update() {
    boardT.draw()
    requestAnimationFrame(update)
}

update()
