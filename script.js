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
    let nextMove = null;

    let difficulty = 'none';
    return {name, letter, positions, nextMove, difficulty};
};

const displayController = (() => {

    const Player1 = Player('X');
    const Player2 = Player('O');
    const players = [Player1, Player2];
    let currentPlayer = Player1;

    let startButton = document.getElementById('start-button');
    startButton.addEventListener('click', startGame);

    const currentPlayerDisplay = document.getElementById('current-player');

    // assigns the dropdown elements to variables
    const difficulty1 = document.getElementById('difficulty-1');
    const difficulty2 = document.getElementById('difficulty-2');

    function startGame() {
        
        const player1Name = document.getElementById('player1').value;
        const player2Name = document.getElementById('player2').value;


        if (player1Name !== '' && player2Name !== '') {

            Player1.difficulty = difficulty1.value;
            Player2.difficulty = difficulty2.value;

            startButton.textContent = 'Restart';
            
            Player1.name = player1Name;
            Player2.name = player2Name;
            
    
            currentPlayer = Player1;
    
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

            chooseMove();
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

        //calls aiMove() with the next player
        chooseMove();
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
                    result.textContent = `${currentPlayer.name} wins`;
                    stopGame();
                }
            });
        });

        if (!win && checkFullBoard()) {
            win = true;
            console.log('tie');
            result.textContent = 'Tie';
            stopGame();
        }
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

    function randomMove() {
        /*
        If the current player is an ai, randomly selects an open square and clicks it
        */
        if (currentPlayer.difficulty !== 'none') {
            let unoccupiedSquares = [];

            //iterates through the array of 'played' moves and adds the 'unplayed' indices to an array
            index = 0;
            for (let square of gameBoard.moves) {
                if (square == null) {
                    unoccupiedSquares.push(index);
                }
                index++;
            }

            // selects an open square by first choosing a random index from the array of 'unplayed' indices,
            // then selecting the square with the corresponding id
            const randomIndex = Math.floor(Math.random() * unoccupiedSquares.length);
            const randomSquareIndex = unoccupiedSquares[randomIndex];
            const randomSquare = document.getElementById(`${randomSquareIndex}`);

            // clicks the square, if it exists, after a 50 ms delay
            if (randomSquare !== null) {
                setTimeout(function() {
                    randomSquare.click();
                }, 50);
                
            }
        }
    }

    function probabilityOfTrue(probability) {
        let boolean = false;
        const randomValue = Math.random();
        if (randomValue < probability) {
            boolean = true;
        }
        return boolean;
    }

    function chooseMove() {
        if (currentPlayer.difficulty == 'easy') {
            randomMove();
        }
        else if (currentPlayer.difficulty == 'medium') {
            if (probabilityOfTrue(0.5)) {
                miniMaxMove();
            }
            else {
                randomMove();
            }
        }
        else if (currentPlayer.difficulty == 'hard') {
            if (probabilityOfTrue(0.80)) {
                miniMaxMove();
            }
            else {
                randomMove();
            }
        }
        else if (currentPlayer.difficulty == 'impossible') {
            miniMaxMove();
        }
    }

    function miniMaxMove() {
        // My goal here is to get the index of the best move so I can click it's corresponding square
             
        if (currentPlayer.difficulty !== 'none') {

            let nextPlayerLetter;

            // reveals the best move's index
            if (currentPlayer.letter === 'X') {
                nextPlayerLetter = 'O';
            }
            else {
                nextPlayerLetter = 'X';
            }
            const bestSquareIndex = miniMax(gameBoard.moves, currentPlayer.letter, nextPlayerLetter, 0)[1];

            // chooses the corresponding square
            const bestSquare = document.getElementById(`${bestSquareIndex}`);

            // clicks the square
            if (bestSquare !== null) {
                setTimeout(function() {
                    bestSquare.click();
                }, 50);
            }
        }
    }

    function simulatedWin(board, playerLetter) {
        let positions = [];
        
        // populates positions array
        for (let i=0; i < board.length; i++) {
            
            if (playerLetter === 'X') {
                if (board[i] === 'X') {
                    positions.push(String(i));
                }
            }
            else {
                if (board[i] === 'O') {
                    positions.push(String(i));
                }
            }
        }

        let win = false;
        gameBoard.winningCombinations.forEach(function(combo) {
            let winCounter = 0;
            combo.forEach(function(position) {
                if (positions.includes(position)) {
                    winCounter++;
                }
                if (winCounter === 3) {
                    win = true;
                }
            });
        });

        return win;
    }

    function fullBoard(board) {
        // checks for a full board
        let full = true;
        for (let position of board) {
            if (position === null) {
                full = false;
            }
        }
        return full;
    }

    function score(board, playerLetter, depth) {
        if (simulatedWin(board, playerLetter) && playerLetter === 'X') {
            return 10 - depth;
        }
        else if (simulatedWin(board, playerLetter) && playerLetter === 'O') {
            return depth -10;
        }
        else return 0;
    }

    function miniMax(gameState, currentPlayerLetter, nextPlayerLetter, depth) {
        // base case
        if (fullBoard(gameState) || simulatedWin(gameState, nextPlayerLetter)) return [score(gameState, nextPlayerLetter, depth), null];

        depth++;

        let scores = [];
        let moves = [];

        for (let move of getAvailableMoves(gameState)) {
            let possibleState = getNewState(gameState, move, currentPlayerLetter);
            scores.push(miniMax(possibleState, nextPlayerLetter, currentPlayerLetter, depth)[0]);
            moves.push(move);
        }

        //maximizing calculation
        if (currentPlayerLetter === 'X') {
            const maxScore = Math.max(...scores);
            const maxScoreIndex = scores.indexOf(maxScore);
            let nextMove = moves[maxScoreIndex];
            //console.log(maxScore, nextMove, currentPlayerLetter);
            //console.log(gameState);
            //console.log(scores);
            //console.log(moves);
            return [maxScore, nextMove];
        }

        //minimizing calculation
        else {
            const minScore = Math.min(...scores);
            const minScoreIndex = scores.indexOf(minScore);
            let nextMove = moves[minScoreIndex];
            //console.log(minScore, nextMove, currentPlayerLetter);
            //console.log(gameState);
            //console.log(scores);
            //console.log(moves);
            return [minScore, nextMove];
        }
    }

    function getNewState(currentState, move, playerLetter) {

        // create a new state where the given index is filled with the current letter
        let newState = currentState.slice();
        newState[move] = playerLetter;

        return newState;
    }
    //console.log(getNewState([null, null, null, null, null, null, null, null, null], 3, 'X'));

    function getAvailableMoves(currentState) {

        // a list of available indexes to move to
        let availableMoves = [];

        // iterate through each board position, and if the position is empty,
        // add that index to the list of available moves
        for (let i = 0; i < currentState.length; i++) {
            if (currentState[i] === null) {
                availableMoves.push(i);
            }
        }
        return availableMoves;
    }
    //console.log(getAvailableMoves([null, null, null, null, null, null, null, 'X', null]));

    // . . .   X's turn. miniMax should pick index 8 for the best move if working correctly.
    // . o o
    // x x .
    console.log(miniMax([null, null, null, null, 'O', 'O', 'X', 'X', null], 'X', 'O', 0));
    //console.log(miniMax(['X', 'O', 'X', null, null, 'O', 'X', 'X', 'O'], 'O', 'X'));
    //console.log(miniMax([null, null, null, null, null, null, null, 'X', null], 'O', 'X'));
})();

