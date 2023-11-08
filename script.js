const gameBoard = (() => {

    // represents a tic-tac-toe board
    let moves = [null,null,null,
                 null,null,null,
                 null,null,null];

    // the 'boxes' of the board in the DOM
    const boxes = document.querySelectorAll('.box');
    
    // combinations of three-in-a-row based on their respective indices in the board
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
    // represents a player in the game of tic-tac-toe

    const letter = player_letter;
    let name = '';
    let positions = []; // an array of the indices the player occupies
    let difficulty = 'none'; // the difficulty of the AI, if enabled
    return {name, letter, positions, difficulty};
};

const displayController = (() => {
    // controls all logic for moves and their display in the DOM

    // creates two player objects
    const Player1 = Player('X');
    const Player2 = Player('O');
    const players = [Player1, Player2];
    let currentPlayer = Player1;
    
    // adds an event listener to the 'start' button in the DOM
    let startButton = document.getElementById('start-button');
    startButton.addEventListener('click', startGame);

    // the part of the DOM that shows the current player's name
    const currentPlayerDisplay = document.getElementById('current-player');

    // assigns the dropdown elements for difficulty choice to variables
    const difficulty1 = document.getElementById('difficulty-1');
    const difficulty2 = document.getElementById('difficulty-2');

    function startGame() {
        // called when the user clicks the 'start' or 'restart' button in the DOM

        // gets the player names from the user input in the DOM
        const player1Name = document.getElementById('player1').value;
        const player2Name = document.getElementById('player2').value;

        if (player1Name !== '' && player2Name !== '') { // if the players' names have been entered

            // get the AI difficulty from the DOM
            Player1.difficulty = difficulty1.value;
            Player2.difficulty = difficulty2.value;

            startButton.textContent = 'Restart';
            
            Player1.name = player1Name;
            Player2.name = player2Name;
            
            currentPlayer = Player1;
    
            displayCurrentPlayer();
            
            // resets the board positions
            gameBoard.moves = [null,null,null,
                                null,null,null,
                                null,null,null];
            result.textContent = '';
            
            // resets the board in the DOM
            gameBoard.boxes.forEach(function(box) {
                box.textContent = '';
                box.addEventListener('click', handleBoxClick);
            })
            
            //resets the Player positions
            for (let player of players) {
                player.positions = [];
            }

            // executes an AI move if applicable
            chooseMove();
        }
    }

    function switchPlayers() {
        if (currentPlayer === Player1) currentPlayer = Player2;
        else currentPlayer = Player1;
    }
    
    function handleBoxClick(event) {

        // the box that was clicked
        const box = event.target;

        // updates the gameboard and Player positions
        gameBoard.moves[box.id] = currentPlayer.letter;
        currentPlayer.positions.push(box.id);

        // updates the board display in the DOM
        box.textContent = currentPlayer.letter;
        
        // if there is no win, switch players etc.
        if (!checkWin(currentPlayer)) {
            switchPlayers();
            displayCurrentPlayer();
        }
        box.removeEventListener('click', handleBoxClick);

        // executes an AI move for the next player if applicable
        chooseMove();
    }

    // gets the DOM element that contains the game result
    const result = document.getElementById('game-result');

    function checkWin(player) {

        // checks for a match between the the 'winning positions' and the player's positions
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

        // checks for 'tie' conditions (a full board and no win)
        if (!win && fullBoard(gameBoard.moves)) {
            win = true;
            result.textContent = 'Tie';
            stopGame();
        }

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

    function stopGame() {
        // stops the game from continuing

        gameBoard.boxes.forEach(function(box) {
            box.removeEventListener('click', handleBoxClick);
        })
        currentPlayerDisplay.textContent = '';
    }

    function displayCurrentPlayer() {
        currentPlayerDisplay.textContent = `${currentPlayer.name}'s turn`
    }

    function randomMove() {
        //Randomly selects an open square and clicks it

        if (currentPlayer.difficulty !== 'none') {
            let unoccupiedSquares = [];

            //iterates through the array of moves and adds the 'unplayed' indices to an array
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

    function miniMaxMove() {
        // Gets the index of the best move and clicks its corresponding square
             
        if (currentPlayer.difficulty !== 'none') {

            let nextPlayerLetter;

            if (currentPlayer.letter === 'X') {
                nextPlayerLetter = 'O';
            }
            else {
                nextPlayerLetter = 'X';
            }

            // reveals the best move's index
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

    function returnTrueWithProbability(probability) {
        // returns true with the given probability. Otherwise returns false

        let boolean = false;
        const randomValue = Math.random();
        if (randomValue < probability) {
            boolean = true;
        }
        return boolean;
    }

    function chooseMove() {
        // increases the probability of a move using the minimax algorithm as opposed to a random move,
        // in accord with the AI difficulty level

        if (currentPlayer.difficulty == 'easy') {
            randomMove();
        }
        else if (currentPlayer.difficulty == 'medium') {
            if (returnTrueWithProbability(0.5)) {
                miniMaxMove();
            }
            else {
                randomMove();
            }
        }
        else if (currentPlayer.difficulty == 'hard') {
            if (returnTrueWithProbability(0.80)) {
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

    function simulatedWin(board, playerLetter) {
        // uses the same logic as 'checkWin()' but with the 'simulated board' in the minimax
        // algorithm as opposed to the actual board represented in the DOM

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

    function score(board, playerLetter, depth) {
        // Returns the score from the "maximizing-player" (X) perspective. The score
        // is modulated by the "depth" or number of moves until the win or loss from the initial move.
        // The greater the depth, the worse for the maximizing player, because it means more moves
        // until a win. This is useful in an instance where two separate move choices would both lead
        // to the same outcome (a win or loss) but one will get there faster. The maximizing player
        // wishes to reach a win as fast as possible while the minimizing player wishes to prolong
        // the game as much as possible if they cannot win. Depth does not influence the outcome of the game,
        // but rather the speed with which a conclusion is reached.

        if (simulatedWin(board, playerLetter) && playerLetter === 'X') {
            return 10 - depth;
        }
        else if (simulatedWin(board, playerLetter) && playerLetter === 'O') {
            return depth - 10;
        }
        else return 0;
    }

    function miniMax(gameState, currentPlayerLetter, nextPlayerLetter, depth) {
        // The minimax algorithm is a brute-force algorithm that can be used to choose the best move in 
        // solved, turn-taking games such as tic-tac-toe. It works by employing the concept of a "maximizing"
        // player and a "minimizing" player. The maximizing player seeks to maximize their score while the 
        // minimizing player seeks to minimize their opponents score. Thus, when viewed only from the maximizing
        // player's perspective, the minimizing player seeks to MINImize the MAXimum score, hence the name minimax.
        // The algorithm works recursively, with each recursion revealing the score of a new game state, until all
        // possible game states and their respective scores are revealed. In this way, the algorithm can choose which 
        // move will lead to the highest score (when it is maximizing player's turn) and which will lead to the lowest
        // score (when it is the minimizing player's turn). For this program, I have chosen X as the maximizing player.

        // if the game is over, return the score
        if (fullBoard(gameState) || simulatedWin(gameState, nextPlayerLetter)) return [score(gameState, nextPlayerLetter, depth), null];

        // update the depth of the current game state
        depth++;

        let scores = []; // a list of all possible scores after all possible moves
        let moves = []; // a list of all possible moves

        // for all availables moves, updates the scores list by recursively calling miniMax with the players switched.
        // Then, updates the moves list so that the indices of the scores and their respective moves match up.
        for (let move of getAvailableMoves(gameState)) {
            let possibleState = getNewState(gameState, move, currentPlayerLetter);
            scores.push(miniMax(possibleState, nextPlayerLetter, currentPlayerLetter, depth)[0]);
            moves.push(move);
        }

        //maximizing calculation
        if (currentPlayerLetter === 'X') {
            const maxScore = Math.max(...scores);
            const maxScoreIndex = scores.indexOf(maxScore);
            let bestMove = moves[maxScoreIndex];
            return [maxScore, bestMove];
        }

        //minimizing calculation
        else {
            const minScore = Math.min(...scores);
            const minScoreIndex = scores.indexOf(minScore);
            let bestMove = moves[minScoreIndex];
            return [minScore, bestMove];
        }
    }

    function getNewState(currentState, move, playerLetter) {

        // create a new state where the given index is filled with the current letter
        let newState = currentState.slice();
        newState[move] = playerLetter;

        return newState;
    }

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

    // . . .   X's turn. miniMax should pick index 8 for the best move if working correctly.
    // . o o
    // x x .
    //console.log(miniMax([null, null, null, null, 'O', 'O', 'X', 'X', null], 'X', 'O', 0));
})();

