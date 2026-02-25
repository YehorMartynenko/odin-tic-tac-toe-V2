const Gameboard = (function() {
    const board = [];

    function createCell() {
        let mark = "";

        const addPlayerMark = (playerMark) => {
            mark = playerMark;
        }

        const getValue = () => mark;

        return { addPlayerMark, getValue }
    }

    function createBoard() {
        for(let row = 0; row<3; row++){
            board[row] = [];
            for(let col = 0; col<3; col++){
                board[row][col] = createCell();
            }
        }
    }

    createBoard();

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.table(boardWithCellValues);
    };

    const placeMark = (row, col, playerMark) => {
        const isValidRow = (row >= 0 && row <= 3);
        const isValidCol = (col >= 0 && col <= 3);

        if(!(isValidRow && isValidCol)){
            return false;
        } else if(board[row][col].getValue() === ""){
            board[row][col].addPlayerMark(playerMark)
            return true;
        } else {
            return false;
        }

        
    }

    return { printBoard, placeMark };
})();

const GameController = (function(playerOneName = "Player One", playerTwoName = "Player Two") {
    const players = [
    {
        name: playerOneName,
        mark: "X"    
    },
    {
        name: playerTwoName,
        mark: "O"
    }];

    let activePlayer = players[0];

    const changeActivePlayer = () => {
        return activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => {
        return activePlayer;
    }

    const playRound = (row, col) => {
        console.log(`${activePlayer.name}'s turn`);
        let isSucces = true;
        isSucces = Gameboard.placeMark(row, col, activePlayer.mark);
        if(!isSucces){
            console.log(`Please make sure your coordinates are in [0,3] range and selected cell is empty`);
            return;
        }
        Gameboard.printBoard();
        activePlayer = changeActivePlayer();
    }

    return { playRound, getActivePlayer }
})();