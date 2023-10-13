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
        ['0', '1', '2'], // Top row
        ['3', '4', '5'], // Middle row
        ['6', '7', '8'], // Bottom row

        // Vertical combinations
        ['0', '3', '6'], // Left column
        ['1', '4', '7'], // Middle column
        ['2', '5', '8'], // Right column

        // Diagonal combinations
        ['0', '4', '8'], // Top-left to bottom-right diagonal
        ['2', '4', '6']  // Top-right to bottom-left diagonal
      ];
      
    return {moves, boxes, winningCombinations};
})();

const Player = (player_letter) => {
    const letter = player_letter;
    let name = '';
    let positions = [];

    return {name, letter, positions};
};

const displayController = (() => {

    const Player1 = Player('X');
    const Player2 = Player('O');
    const players = [Player1, Player2];
    let currentPlayer = Player1;

    startButton = document.getElementById('start-button');
    startButton.addEventListener('click', startGame);

    const currentPlayerDisplay = document.getElementById('current-player');
    
    function startGame() {
        startButton.textContent = 'Restart';
        currentPlayer = Player1;
        

        const player1Name = document.getElementById('player1').value;
        const player2Name = document.getElementById('player2').value;

        Player1.name = player1Name;
        Player2.name = player2Name;

        displayCurrentPlayer();
        
        gameBoard.moves = [null,null,null,
                            null,null,null,
                            null,null,null];
        result.textContent = '';

        gameBoard.boxes.forEach(function(box) {
            box.textContent = '';
            box.addEventListener('click', addMark);
        })

        for (let player of players) {
            player.positions = [];
        }
    }

    function switchPlayers() {
        if (currentPlayer === Player1) currentPlayer = Player2;
        else currentPlayer = Player1;
    }
    
    function addMark(event) {
        const box = event.target;
        gameBoard.moves[box.id] = currentPlayer.letter;
        console.log(gameBoard.moves);
        box.textContent = currentPlayer.letter;
        currentPlayer.positions.push(box.id);
        console.log(currentPlayer.positions);
        checkWin(currentPlayer);
        if (!checkWin(currentPlayer)) {
            switchPlayers();
            displayCurrentPlayer();
        }
        
        box.removeEventListener('click', addMark);
    }

    const result = document.getElementById('game-result');

    function checkWin(player) {
        let win = false;
        gameBoard.winningCombinations.forEach(function(combo) {
            let winCounter = 0;
            combo.forEach(function(position) {
                if (player.positions.includes(position)) {
                    winCounter++;
                }
                if (winCounter === 3) {
                    win = true;
                    if (currentPlayer.letter === 'X') {
                        console.log('x wins');
                        result.textContent = 'X wins'
                        stopGame();
                    }
                    else {
                        console.log('o wins');
                        result.textContent = 'O wins'
                        stopGame();
                    }
                }
                else if (checkFullBoard()) {
                    win = true;
                    console.log('tie')
                    result.textContent = 'Tie'
                    stopGame();
                }
            })
        })
        return win;
    }

    function checkFullBoard() {
        let full = true;
        for (let square of gameBoard.moves) {
            if (square == null) {
                full = false;
            }
        }
        return full;
    }

    function stopGame() {
        gameBoard.boxes.forEach(function(box) {
            box.removeEventListener('click', addMark);
        })
        currentPlayerDisplay.textContent = '';
    }

    function displayCurrentPlayer() {
        currentPlayerDisplay.textContent = `${currentPlayer.name}'s turn`
    }
})();

//driver script

//gameBoard.displayMoves();