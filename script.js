/*
I need to fit every bit of logic into the game, player, or gameboard
objects. I also want to keep the DOM and game logic as separate as
possible. I can accomplish this by making this work in the console
first.

I can manipulate the array, without yet linking parts of the array
to the DOM. Then I can link it to the DOM after.

Functionality list:
-Switching turns so I know whether it is 'x' or 'o'
-Storing values in correct board array index on click
-displaying values on board after the fact
-checking for win and tie conditions
*/

const gameBoard = (() => {
    let moves = [null,null,null,
                 null,null,null,
                 null,null,null];
    const boxes = document.querySelectorAll('.box');
    return {moves, boxes};
})();

const displayController = (() => {
    let currentPlayer = 'x';

    const switchPlayers = function() {
        if (currentPlayer === 'x') currentPlayer = 'o';
        else currentPlayer = 'x';
    }
    
    gameBoard.boxes.forEach(function(box) {
        box.addEventListener('click', function addMark() {
            gameBoard.moves[box.id] = currentPlayer;
            console.log(gameBoard.moves);
            box.textContent = currentPlayer;
            switchPlayers();
            box.removeEventListener('click', addMark);
        })
    })
})();

const Player = (name, letter) => {

};

//driver script
//gameBoard.displayMoves();