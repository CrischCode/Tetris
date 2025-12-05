class Grid {
    constructor(canvas, cellSize, space, rows, cols, cellSize) {
        this.canvas = canvas
        this.cellSize = cellSize
        this.space = space
        this.rows = rows
        this.cols = cols
        this.matriz = []
        this.restarMatriz()
    }
    restarMatriz(){
        for(let r = 0; r < this.rows; r++){
            this.matriz[r] = []
            for(let c = 0; c < this.cols; c++){
                this.matriz(r)[c]=0
            }
        }
    }

    drawGrid(x,y,side,color, borderColor){
        const bordeSize = side / 10

        this.ctx.fillStyle = color
        this.ctx.fillRect(x,y,side,side)

        this.ctx.strokeStyle = borderColor
        this.ctx.lineWith = borderSize
        this.ctx.strokeRect(x+bordeSize/2, y+bordeSize/2, side-bordeSize, side-bordeSize)
    }

    getCoordinates(col, row) {
        return {x:col* (this.cellSize+this.space), y:row*(this.cellSize+this.space)}
    }

    draw () {
        for(let r = 0; r < this.row; r++) {
            for(let c = 0; c <this.cols; c++) {
                const position = this.getCoordinates(c,r)
                this.drawGrid(position.x, position.y, this.cellSize, '#000', '#555')
            }
        }
    }
}