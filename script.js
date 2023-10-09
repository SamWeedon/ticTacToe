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
    
    const winningCombinations = [
        // Horizontal combinations
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
      
        // Vertical combinations
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
      
        // Diagonal combinations
        [0, 4, 8], // Top-left to bottom-right diagonal
        [2, 4, 6]  // Top-right to bottom-left diagonal
      ];
      
    return {moves, boxes};
})();

const Player = (player_name, player_letter) => {
    const name = player_name;
    const letter = player_letter;

    return {name, letter};
};

const displayController = (() => {
    const Player1 = Player('Sam', 'X');
    const Player2 = Player('Bob', 'O');

    let currentPlayer = Player1;

    const switchPlayers = function() {
        if (currentPlayer === Player1) currentPlayer = Player2;
        else currentPlayer = Player1;
    }
    
    gameBoard.boxes.forEach(function(box) {
        box.addEventListener('click', function addMark() {
            gameBoard.moves[box.id] = currentPlayer.letter;
            console.log(gameBoard.moves);
            box.textContent = currentPlayer.letter;
            switchPlayers();
            box.removeEventListener('click', addMark);
        })
    })
    const checkWin = function() {
        win = true;
        for (let combo in gameBoard.winningCombinations) {
            for (index in combo) {
                if (gameBoard.moves.includes(index)) {
                
                }
                
            }
        }
    }
})();

//driver script

//gameBoard.displayMoves();