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

    const getBoardSnapshot = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.table(boardWithCellValues);
        return boardWithCellValues;
    }

    function markManager() {
        const placeMark = (row, col, playerMark) => {
            const isValidRow = (row >= 0 && row <= 2);
            const isValidCol = (col >= 0 && col <= 2);

            if(!(isValidRow && isValidCol)){
                return false;
            } else if(board[row][col].getValue() === ""){
                board[row][col].addPlayerMark(playerMark)
                return true;
            } else {
                return false;
            }
        }

        const getMark = (row, col) => {
            return board[row][col].getValue();
        }

        return {placeMark, getMark};
    }

    const manager = markManager();

    return { getBoardSnapshot, placeMark: manager.placeMark, getMark: manager.getMark, createBoard };
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


    const playRound = (row, col) => {
        console.log(`${activePlayer.name}'s turn`);
        let isSucces = true;
        isSucces = Gameboard.placeMark(row, col, activePlayer.mark);
        if(!isSucces){
            console.log(`Please make sure your coordinates are in [0,2] range and selected cell is empty`);
            return;
        }
        Gameboard.getBoardSnapshot();
        if(GameRules.checkWin(Gameboard.getBoardSnapshot())){
            console.log(`${activePlayer.name} won!`);
            activePlayer = players[0];
            Gameboard.createBoard();
            return;
        }
        activePlayer = changeActivePlayer();
    }

    return { playRound }
})();

const GameRules = (function() {
    const winConditionCoords = [];

    const addRowsCoords = () => {
        for(let row = 0; row<3; row++){
            const coords = [];
            for(let col = 0; col<3; col++){
                coords.push([row, col]);
            }
            winConditionCoords.push(coords);
       }
    }

    const addColsCoords = () => {
        for(let row = 0; row<3; row++){
            const coords = [];
            for(let col = 0; col<3; col++){
                coords.push([col, row]);
            }
            winConditionCoords.push(coords);
       }
    }

    const addDiagCoords = () => {
        const coords = [];
        const coords2 = [];
        for(let index = 0; index<3; index++){
            coords.push([index, index]);
        }
        winConditionCoords.push(coords);
        for(let index = 0; index<3; index++){
            coords2.push([index, 2 - index]);
        }
        winConditionCoords.push(coords2);
        
    }

    addRowsCoords();
    addColsCoords();
    addDiagCoords();

    const checkWin = (board) => {
        const lines = winConditionCoords.map((item) => item.map((el) => board[el[0]][el[1]]));
        const isWin = lines.map((line) => line.every((mark, index, arr) => mark === arr[0] && mark !== "")).filter((el) => el === true);
        return isWin.length === 0 ? false : true;
    }
    return {checkWin}
})();