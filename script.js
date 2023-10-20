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

    let ai = false;
    return {name, letter, positions, ai};
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
        
        const player1Name = document.getElementById('player1').value;
        const player2Name = document.getElementById('player2').value;

        if (player1Name !== '' && player2Name !== '') {
            
            // updates the 'ai' property of each player
            if (checkbox1.checked) {
                console.log('1 checked');
                Player1.ai = true;
            }
            else Player1.ai = false;

            if (checkbox2.checked) {
                console.log('2 checked');
                Player2.ai = true;
            }
            else Player2.ai = false;
            //

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

            aiMove();
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
        aiMove();
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

    // assigns the checkbox elements to variables
    const checkbox1 = document.getElementById('ai-1');
    const checkbox2 = document.getElementById('ai-2');

    function aiMove() {
        /*
        If the current player is an ai, randomly selects an open square and clicks it
        */
        if (currentPlayer.ai == true) {
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

    function score() {
        if (checkWin(currentPlayer) && currentPlayer === Player1) {
            return 10;
        }
        else if (checkWin(currentPlayer) && currentPlayer === Player2) {
            return -10;
        }
        else return 0;
    }
    
    const emptyBoard = [null,null,null,
                        null,null,null,
                        null,null,null];

    function miniMax(gameState) {
        // base case
        if (checkWin(currentPlayer)) return score();

        let scores = [];
        let moves = [];

        for (let state of getAvailableStates(gameState)) {
            scores.push(miniMax(state));
        }
    }

    function getAvailableStates(currentState) {
        let availableStates = [];
        //const currentLetter = currentPlayer.letter;
        const currentLetter = 'x';
        for (let i = 0; i < currentState.length; i++) {
            if (currentState[i] === null) {
                const availableState = currentState.slice();
                availableState[i] = currentLetter;
                availableStates.push(availableState);
            }
        }
        return availableStates;
    }
    console.log(getAvailableStates([null, null, null, null, null, null, null, null, null]));
})();

