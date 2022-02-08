/*
Add your code for Game here
 */

let new_tile_likely = {0:2, 1:2, 2:2, 3:2, 4:2, 5:2, 6:2, 7:2, 8:2, 9:4}

export default function Game(dimension) {
    this.gameState = {board: new Array(dimension*dimension).fill(0), score: 0, won: false, over: false}
    this.dimension = dimension
    this.moveState = {
        mutable: true, 
        R: {board: new Array(dimension*dimension).fill(0), moveSet: [], score: 0, legal: true, win: false}, 
        L: {board: new Array(dimension*dimension).fill(0), moveSet: [], score: 0, legal: true, win: false}, 
        D: {board: new Array(dimension*dimension).fill(0), moveSet: [], score: 0, legal: true, win: false}, 
        U: {board: new Array(dimension*dimension).fill(0), moveSet: [], score: 0, legal: true, win: false}
    }
    this.listeners = {move: [], win: [], lose: []}
    this.setupNewGame()
}

Game.prototype.setupNewGame = function (g=this.gameState) {
    g.board.fill(0); g.score=0; g.won=false; g.over=false
    this.tile(); this.tile()
    this.prime()
}

Game.prototype.loadGame = function (gameState) {
    this.gameState=gameState
    this.prime()
}

Game.prototype.move = function(move, g=this.gameState, m=this.moveState, l=this.listeners) {
    let M=m[move.charAt(0).toUpperCase()]
    if (m.mutable&M.legal) {
        g.board=M.board
        g.score+=M.score
        if (M.win) {this.win()}
        this.tile()
        this.prime()
        this.update(l['move'])
        if (!m.mutable&!M.win) {this.lose()}
    }
}

Game.prototype.win = function(g=this.gameState, l=this.listeners) {
    g.won=true
    this.update(l['win'])
}

Game.prototype.lose = function(g=this.gameState, l=this.listeners) {
    g.over=true
    this.update(l['lose'])
}

Game.prototype.onMove = function (callBack) {
    this.listeners['move'].push(callBack)
}

Game.prototype.onWin = function (callBack) {
    this.listeners['win'].push(callBack)
}

Game.prototype.onLose = function (callBack) {
    this.listeners['lose'].push(callBack)
}

Game.prototype.getGameState = function() {
    return this.gameState
}

Game.prototype.toString = function (d=this.dimension, g=this.gameState, t=false) {
    let s = '' // board as a 1d-array-to-string
    for (let i=0; i<d*d; i++) {
        s=s+'['+g.board[i]+']'
        if(i % d === d-1) {s+='\n'}
    }
    if (t) {s=s+'score: '+g.score}
    return s
}

Game.prototype.tile = function (b=this.gameState.board, t=new_tile_likely) {
    if (!b.includes(0)) {return}
    let s = [] // indeces where there are no tiles as an array
    for (let i=0; i<b.length; i++) {
      if (b[i]<2) {s.push(i)}
    }
    b[s[Math.floor(Math.random()*s.length)]] = t[Math.floor(Math.random()*10)]
}

Game.prototype.prime = function(d=this.dimension, g=this.gameState, m=this.moveState) {
    let row=[]
    let tileable=true
    let curState=this.toString()
    
    // Rightward tile shift
    m.R.score=0
    m.R.board=[...g.board]
    m.R.win=false
    for (let i=0; i<d*d; i+=d) {
        tileable=true
        for (let j=i+d-1; j>=i; j-=1) {
            if (g.board[j]!=0) {
                if (j===i+d-1) {row.push(g.board[j])}
                else if (g.board[j]==row[0]&tileable) {
                    row[0]*=2
                    if (row[0]==2048) {m.R.win=true}
                    m.R.score+=row[0]
                    tileable=false
                }
                else {row.unshift(g.board[j]); tileable=true}
            }
        }
        while (d-row.length>0) {
            row.unshift(0)
        }
        m.R.board.splice(i,d,...row)
        row=[]
    }
    m.R.legal=curState!=this.toString(d,m.R)
    
    // Leftward tile shift
    m.L.score=0
    m.L.board=[...g.board]
    m.L.win=false
    for (let i=0; i<d*d; i+=d) {
        tileable=true;
        for (let j=i; j<i+d; j+=1) {
            if (g.board[j]!=0) {
                if (j===i) {row.push(g.board[j])}
                else if (g.board[j]==row[row.length-1]&tileable) {
                    row[row.length-1]*=2
                    if (row[row.length-1]==2048) {m.L.win=true}
                    m.L.score+=row[row.length-1]
                    tileable=false
                }
                else {row.push(g.board[j]); tileable=true}
            }
        }
        while (d-row.length>0) {
            row.push(0)
        }
        m.L.board.splice(i,d,...row)
        row=[]
    }
    m.L.legal=curState!=this.toString(d,m.L)
    
    // Downward tile shift
    m.D.score=0
    m.D.board=[...g.board]
    m.D.win=false
    for (let i=0; i<d; i+=1) {
        tileable=true;
        for (let j=i+(d-1)*d; j>=i; j-=d) {
            if (g.board[j]!=0) {
                if (j===i+(d-1)*d) {row.push(g.board[j])}
                else if (g.board[j]==row[0]&tileable) {
                    row[0]*=2
                    if (row[0]==2048) {m.D.win=true}
                    m.D.score+=row[0]
                    tileable=false
                }
                else {row.unshift(g.board[j]); tileable=true}
            }
        }
        while (d-row.length>0) {
            row.unshift(0)
        }
        for (let j=i+(d-1)*d; j>=i; j-=d) {
            m.D.board[j]=row.pop()
        }
    }
    m.D.legal=curState!=this.toString(d,m.D)
    
    // Upward tile shift
    m.U.score=0
    m.U.board=[...g.board]
    m.U.win=false
    for (let i=0; i<d; i+=1) {
        tileable=true
        for (let j=i; j<=i+(d-1)*d; j+=d) {
            if (g.board[j]!=0) {
                if (j===i) {row.push(g.board[j])}
                else if (g.board[j]==row[row.length-1]&tileable) {
                    row[row.length-1]*=2
                    if (row[row.length-1]==2048) {m.U.win=true}
                    m.U.score+=row[row.length-1]
                    tileable=false
                }
                else {row.push(g.board[j]); tileable=true}
            }
        }
        while (d-row.length>0) {
            row.push(0)
        }
        for (let j=i+(d-1)*d; j>=i; j-=d) {
            m.U.board[j]=row.pop()
        }
    }
    m.U.legal=curState!=this.toString(d,m.U)
    
    m.mutable=m.R.legal|m.L.legal|m.D.legal|m.U.legal
    g.over=!m.mutable
}

Game.prototype.update = function(event, g=this.gameState) {
    for (const listener of event) {
        listener(g)
    }
}