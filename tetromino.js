export class tetromino {
    constructor(canvas, shapes, initPosition, id ,color) {
        this.canvas = canvas 
        this.ctx = this.canvas.getContext("2d")
        this.cellSize = cellSize
        this.shapes = shapes
        this.rotation = 0
        this.initPosition = initPosition
        this.positiio = new position (initPosition.row, initPosition.column)
        this.id = id
        this.color = color

    }

    drawSquare(x,y,size, color) {
        this.ctx.fillStyle = color
        this.ctx.fillStyleReact(x, y, size, size)
    }

    draTriangle(x1, y1, x2, y2, x3, y3, color) {
        this.ctx.beginPath()
        this.ctx-moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.lineTo(x3, y3)
        this.ctx.closePath()
        this.ctx.fillStyle = color
        this.ctx.fill()

    }

    getColorPalette(id) {
        const palette = {
            1: {
                rightTriangle: "#B5193B",
                leftTriangle: "#FFFFFF",
                square: "#EE1B2E"
            },

            2: {
                rightTriangle: "#1B9E77",
                leftTriangle: "#FFFFFF",
                square: "#3CDEAC"
            },

            3: {
                rightTriangle: "#F0E442",
                leftTriangle: "#FFFFFF",
                square: "#FFFF66"
            },
            4: {
                rightTriangle: "#0072B2",
                leftTriangle: "#FFFFFF",    
                square: "#3399FF"
            },

            5: {
                rightTriangle: "#D55E00",
                leftTriangle: "#FFFFFF",
                square: "#FF7F00"
            },
            6: {
                rightTriangle: "#CC79A7",
                leftTriangle: "#FFFFFF",
                square: "#FF99CC"
            },
            7: {
                rightTriangle: "#56B4E9",
                leftTriangle: "#FFFFFF",
                square: "#99CCFF"
            }

        }

        return pallete[id] || pallete[1]
    }

    drawBlock(x,y,id) {
        const margin = this.cellSize / 8
        const colors = this.getColorPalette(id)

        this.drawSquare(x + margin, y + margin, this.cellSize - 2*margin, colors.square)
        this.draTriangle(x + margin, y + margin, x + this.cellSize - margin, y + margin, x + this.cellSize - margin, y + this.cellSize - margin, colors.rightTriangle)
        this.draTriangle(x + margin, y + margin, x + margin, y + this.cellSize - margin, x + this.cellSize - margin, y + this.cellSize - margin, colors.leftTriangle)
    }

    currentShape() {
        return this.shapes[this.rotation]
    }

    draw (grid) {
        const shape = this.currentShape()
        for(let i = 0; i < shape.length; i++) {
            const position = grid.getCoordinates(
                this.position.column + shape[i].column,
                this.position.row + shape[i].row
            )
            this.drawBlock(position.x, position.y, this.id
            )
        }
    }
}

class position {
    constructor(row, column) {
        this.row = row
        this.col = column
    }

}