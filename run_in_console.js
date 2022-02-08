import keypress from 'keypress';
import Game from "./engine/game.js";

keypress(process.stdin);


/**
 * The code in this file is used to run your game in the console. Use it
 * to help develop your game engine.
 *
 */

let game = new Game(4);
// game.loadGame({board: [2,2,16,0,16,16,4,4,2,2,1024,8,8,0,1024,2], score: 0, won: false, over: false})
console.log(game.toString(game.dimension, game.gameState, true));

game.onMove(gameState => {
    if (!gameState.won) {
        console.log(game.toString(game.dimension, game.gameState, true));
    }
    // console.log(game.gameState);
});

game.onWin(gameState => {
    console.log('You won with a gameState of...', gameState)
});

game.onLose(gameState => {
    console.log('You lost! :(', gameState)
    console.log(`Your score was ${gameState.score}`);
});

process.stdin.on('keypress', function (ch, key) {
    switch (key.name) {
        case 'right':
            game.move('right');
            break;
        case 'left':
            game.move('left');
            break;
        case 'down':
            game.move('down');
            break;
        case 'up':
            game.move('up');
            break;
    }
    if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
    }
});


process.stdin.setRawMode(true);
process.stdin.resume();