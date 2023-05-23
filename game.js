class Board {
    constructor() {
        this.board = [
            [2, 0, 0, 0, 0, 1],
            [2, 0, 0, 0, 0, 1],
            [2, 0, 0, 0, 0, 1],
            [0, 0, 0]
        ];
    }
    move(r1, c1, r2, c2) {
        let temp = this.board[r2][c2];
        this.board[r2][c2] = this.board[r1][c1];
        this.board[r1][c1] = temp;
    }
    at(r, c) {
        return this.board[r][c];
    }
    
    swap(r, c) {
        let c2 = (c+3)%6;
        if (this.at(r, c) == this.at(r, c2)) {
            throw new Error("invalid move");
            return;
        }
        if (this.at(r, c2) != 0) {
            this.toJail(r, c2);
        }
        this.move(r, c, r, c2);
    }
    toJail(r, c) {
        if (this.board[3].includes(0)) {
            for (let i = 0; i < 3; i++) {
                if (this.board[3][i] == 0) {
                    this.move(r, c, 3, i);
                    return;
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            if (this.at(3, i) == (3-this.at(r, c))) {
                this.move(r, c, 3, i);
                return;
            }
        }
    }
    draw(ctx) {
        let offX = (width-unit*4)/2;
        let offY = (height-unit*9)/2;
        ctx.fillStyle = "#cccccc";
        ctx.fillRect(offX, offY, unit*4, unit*9);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 7; j++) {
                ctx.fillStyle = "#a0a0a0";
                if (j == 3) {
                    ctx.fillStyle = '#555555';
                }
                let x = offX+unit*0.25+(unit*1.25*i);
                let y = offY+unit*0.25+(unit*1.25*j);
                ctx.fillRect(x, y, unit, unit);
                let piece;
                if (j == 3) {
                    piece = this.board[3][i];
                } else if (j < 3) {
                    piece = this.board[i][j];
                } else {
                    piece = this.board[i][j-1];
                }
                if (piece == 1) {
                    ctx.fillStyle = '#0000ff';
                } else if (piece == 2) {
                    ctx.fillStyle = '#ff0000';
                } else {
                    ctx.fillStyle = "#a0a0a0";
                    if (j == 3) {
                        ctx.fillStyle = '#555555';
                    }
                }
                ctx.beginPath();
                ctx.arc(x+unit/2, y+unit/2, unit*0.4, 0, 2* Math.PI);
                ctx.fill();
                ctx.closePath();
                let j2 = j;
                if (j > 3) {
                    j2 -= 1;
                }
                if (selected[0] == i && selected[1] == j2 && j != 3) {
                    ctx.fillStyle = '#00ff0055';
                    ctx.fillRect(x, y, unit, unit);
                }
            }
        }
    }
}

function reset() {
    board.board = [
        [2, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 1],
        [0, 0, 0]
    ];
    board.turn = 1;
}

window.onload = init;
let canvas;
let ctx;
let width;
let height;
let unit;
let board;
let alerted = 0;
let selected = [-1, -1];
let isSelected = false;
let turn = 1;
let step = 1;
let cheatcode = 0;

function canvasSize() {
    width = window.innerWidth;
    height = window.innerHeight;
    ctx.canvas.width = width;
    ctx.canvas.height = height;
}

function init() {
    canvas = document.getElementById("gameWindow");
    ctx = canvas.getContext("2d");
    board = new Board();
    window.requestAnimationFrame(draw);
    window.addEventListener('click', function(event) {
        let offX = (width-unit*4)/2;
        let offY = (height-unit*9)/2;
        let x = Math.floor((event.pageX-offX)/(unit*1.25));
        let y = Math.floor((event.pageY-offY)/(unit*1.25));
        if (cheatcode == 0 && x == 2 && y == 3) {
            cheatcode = 1;
        } else if (cheatcode == 1 && x == 0 && y == 3) {
            cheatcode = 2;
        } else if (cheatcode == 2 && x == 1 && y == 3) {
            cheatcode = 3;
        } else if (cheatcode == 3 && x == 0 && y == 3) {
            cheatcode = 4;
        } else if (cheatcode == 4 && x == 2 && y == 3) {
            cheatcode = 5;
        } else if (cheatcode == 5) {
            if (y > 3) {
                y -= 1;
            }
            board.board[x][y] = turn;
            cheatcode = 0;
            return;
        } else {
            cheatcode = 0;
        }
        if (x < 0 || x > 2 || y < 0 || y > 7 || y == 3) {
            return;
        }
        if (y > 3) {
            y -= 1;
        }
        if (step == 1) {
            if (isSelected) {
                if (x == selected[0] && y == selected[1]) {
                    selected = [-1, -1];
                    isSelected = false;
                }
                if (Math.abs(selected[0]-x)+Math.abs(selected[1]-y) != 1) {
                    return;
                }
                if (board.at(x, y) != 0) {
                    return;
                }
                if (board.at(x, (y+3)%6) == turn && this.board[3].includes(turn)) {
                    return;
                }
                board.move(selected[0], selected[1], x, y);
                selected = [-1, -1];
                isSelected = false;
                step = 2;
            } else {
                if (board.at(x, y) != turn) {
                    return;
                }
                selected = [x, y];
                isSelected = true;
            }
        } else {
            if (board.at(x, y) != turn) {
                return;
            }
            board.swap(x, y);
            step = 1;
            turn = 3-turn;
        }
        if (board.board[3][0] == board.board[3][1] && board.board[3][0] == board.board[3][2] && board.board[3][0] > 0) {
            setTimeout(reset, 1000);
        }
    });
}

function draw(ts) {
    canvasSize();
    unit = Math.min(width/4, height/9);
    board.draw(ctx);
    window.requestAnimationFrame(draw);
}