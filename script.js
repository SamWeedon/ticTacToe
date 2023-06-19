const gameBoard = (() => {
    let moves = ['x','o','x',
                 'o','x','o',
                 'o','x','o'];
    const boxes = document.querySelectorAll('.box');
    let index = 0;
    const displayMoves = () => {
        boxes.forEach(function(box) {
            box.textContent = moves[index];
            index++;
        })
    }
    return {displayMoves, moves};
})();

const displayController = (() => {

})();

const Player = () => {

};

//driver script
gameBoard.displayMoves();