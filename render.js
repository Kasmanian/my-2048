/*
Logic for rendering the 2048 board
 */

import Game from "./engine/game.js";
const key = {37: 'left', 38: 'up', 39: 'right', 40: 'down'}
const dye = {0: "#cdc1b4", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563", 32: "#f67c60", 64: "#f65e3b", 128: "#edcf73", 256: "#edcc62", 512: "#edc850", 1024: "#edc53f", 2048: "#edc22d"}
const txt = {0: "transparent", 2: "#776e65", 4: "#776e65", 8: "#f9f6f2", 16: "#f9f6f2", 32: "#f9f6f2", 64: "#f9f6f2", 128: "#f9f6f2", 256: "#f9f6f2", 512: "#f9f6f2", 1024: "#f9f6f2", 2048: "#f9f6f2"}
let game = new Game(4);
// game.loadGame({board: [2,2,16,0,16,16,4,4,2,2,1024,8,8,0,1024,2], score: 0, won: false, over: false})

const renderBoardState = function(state) {
    let tiles = ``
    let todos = ``
    let style = `"grid-template-columns: repeat(${game.dimension}, 80px); 
                        grid-template-rows: repeat(${game.dimension}, 80px);"`
    for (let tile of state.board) {
        let cell="cell"; if (tile==2048) {cell="_2048_"}
        tiles+=`<div class=${cell} style="background: ${dye[tile]}; color: ${txt[tile]};">${tile}</div>`
    }
    if (!state.over&!state.won) {
        todos = `<div class="todo" id="todo">Join the tiles, get to&nbsp;<b>2048!</b></div>`
    } else if (!state.over&state.won) {
        todos = `<div class="todo" id="todo">You've won! Play on or try a&nbsp;<b class="reset"> new game!</b></div>`
    } else {
        todos = `<div class="todo" id="todo">No more moves, try a&nbsp;<b class="reset"> new game!</b></div>`
    }
    return `<section class="board" id="board">
                <div class="title">2048</div>
                <div class="ui">
                    <div class="scoreboard">
                        <div class="label">SCORE</div>
                        <div class="score">${state.score}</div>
                    </div>
                    <div>
                        <button type="button" class="reset button">New Game</button>
                    </div>
                </div>
                <div class="container" id="tiles">
                    <div class="grid" style=${style}>${tiles}</div>
                </div>
                ${todos}
            </section>`
}

const renderOverWindow = function(state) {
    let statement = ""
    if (!state.won) {statement = "Game Over!"}
    return `<section class="announcement" id="state">
                <div class="statement">${statement}</div>
            </section>`
}

const handleKeyPressed = function(event) {
    if (key[event.keyCode]!=undefined) {
        game.move(key[event.keyCode])
    }
}

const handleResetBoard = function(event) {
    game.setupNewGame()
    let _status = document.getElementById("state")
    if (_status!=null) {_status.remove()}
    let elebody = document.getElementsByTagName("BODY")[0]
    elebody.classList.add("reboard")
    let element = document.getElementById("board")
    let reboard = renderBoardState(game.gameState)
    $(reboard).insertAfter(element)
    element.remove()
    elebody.classList.remove("reboard")
}

game.onMove(gameState => {
    let element = document.getElementById("board")
    let reboard = renderBoardState(gameState)
    $(reboard).insertAfter(element)
    element.remove()
});

game.onWin(async gameState => {
    await sleep(1000);
    let wrapper = document.getElementById("tiles")
    let element = document.getElementById("board")
    let fadable = element.getElementsByClassName("cell")
    wrapper.classList.add("fade")
    for (let f of fadable) {
        f.classList.add("loboard")
    }
    let reboard = renderOverWindow(gameState)
    $(reboard).insertAfter(element)
});

game.onLose(async gameState => {
    await sleep(1000);
    let wrapper = document.getElementById("tiles")
    let element = document.getElementById("board")
    let fadable = element.getElementsByClassName("cell")
    wrapper.classList.add("fade")
    for (let f of fadable) {
        f.classList.add("noboard")
    }
    let reboard = renderOverWindow(gameState)
    $(reboard).insertAfter(element)
});

const loadBoardIntoDOM = function(game) {
    // Grab a jQuery reference to the root HTML element
    const $root = $('#root');
    $($root).append(renderBoardState(game.gameState))
    $($root).on("click", ".reset", handleResetBoard);
    document.onkeydown = function(e) {
        handleKeyPressed(e)
        e.preventDefault();
    };
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

/**
 * Use jQuery to execute the loadHeroesIntoDOM function after the page loads
 */
$(function() {
    loadBoardIntoDOM(game);
});