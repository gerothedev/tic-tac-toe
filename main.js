function gameBoard() {
    let board = [["", "", ""],
                    ["", "", ""], 
                    ["", "", ""]];

    const getBoard = () => board;
    const markBoard = (x, y, symbol) => board[x][y] = symbol;
    const resetBoard = () => {
        board = board.map(element => element.map(value => value = ""));
    } 

    return { getBoard, markBoard, resetBoard };
}

function game() {
    let xCoord, yCoord, playerX, playerO, startingPlayer, currentPlayer, turnCount;
    const board = gameBoard();

    function namePlayer(name, xOrO) {
        if (xOrO === "X") {
            playerX = player(name, xOrO);
        } else if (xOrO === "O") {
            playerO = player(name, xOrO);
        }
    }

    turnCount = 0;
    startingPlayer = "X";
    currentPlayer = "X";

    function setCoordinate(x, y) {
        xCoord = x;
        yCoord = y;
    }

    function getCurrentPlayer() {
        if (currentPlayer === "X") {
            return playerX;
        } else if (currentPlayer === "O") {
            return playerO;
        }
    }

    function getTurnCount() {
        return turnCount;
    }

    function switchPlayer() {
        if (startingPlayer === "X") {
            turnCount % 2 === 0 ? currentPlayer = "X" : currentPlayer = "O";
        } else if (startingPlayer === "O") {
            turnCount % 2 === 0 ? currentPlayer = "O" : currentPlayer = "X";
        }
    }

    function playTurn() {
        if (board.getBoard()[xCoord][yCoord] != "") {
            return;
        } else {
            currentPlayer === "X" ? board.markBoard(xCoord, yCoord, playerX.getSymbol()) :board.markBoard(xCoord, yCoord, playerO.getSymbol());
            turnCount++;
            console.table(board.getBoard());
        }
    }

    function resetGame(winningSymbol) {
        if (winningSymbol !== undefined) {
            startingPlayer = winningSymbol;
            currentPlayer = winningSymbol;
        }
        playerX = player("", "X");
        playerO = player("", "O");
        turnCount = 0;
        board.resetBoard();
    }

    function checkWinner(fullBoard) {
        let winningSymbol;
        for (let i = 0; i < board.getBoard().length; i++) {
            if (board.getBoard()[i][0] !== "" && board.getBoard()[i][0] === board.getBoard()[i][1] && board.getBoard()[i][1] === board.getBoard()[i][2]) {
                winningSymbol = board.getBoard()[i][0];
            }
        }
        for (let i = 0; i < board.getBoard().length; i++) {
            if (board.getBoard()[0][i] !== "" && board.getBoard()[0][i] === board.getBoard()[1][i] && board.getBoard()[1][i] === board.getBoard()[2][i]) {
                winningSymbol = board.getBoard()[0][i];
            }
        }
        if ((board.getBoard()[0][0] !== "" && board.getBoard()[0][0] === board.getBoard()[1][1] && board.getBoard()[1][1] === board.getBoard()[2][2]) ||
            (board.getBoard()[2][0] !== "" && board.getBoard()[2][0] === board.getBoard()[1][1] && board.getBoard()[1][1] === board.getBoard()[0][2])) {
            winningSymbol = board.getBoard()[0][0];
        }
        switch(winningSymbol) {
            case "X": 
                console.log(`${playerX.getName()} wins the game!`);
                resetGame(winningSymbol);
                return "win";
            case "O": 
                console.log(`${playerO.getName()} wins the game!`);
                resetGame(winningSymbol);
                return "win";
            default: 
                if (fullBoard === 9) {
                    console.log("The game is a tie!");
                    resetGame();
                    return "tie";
                } 
        }
    }

    return { namePlayer, getCurrentPlayer, switchPlayer, setCoordinate, playTurn, getTurnCount, checkWinner };
}

function player(name, xOrO) {
    const playerName = name;
    const playerSymbol = xOrO;
    
    const getName = () => (playerName === "" ? `Player ${xOrO}` : playerName);
    const getSymbol = () => playerSymbol;

    return { getName, getSymbol };
}

const displayBoard = (function() {
    const activeGame = game();
    const boardContainer = document.querySelector(".board-container");
    const boardSpace = document.querySelectorAll(".board div");
    const gameSetup = document.querySelector(".game-setup");
    const startGameButton = document.querySelector("#start-game");
    const warning = document.querySelector(".warning");
    const gameMessageContainer = document.querySelector(".game-message");
    const gameMessage = document.querySelector(".game-message > p");
    const playerXInput = document.querySelector("#player-x");
    const playerOInput = document.querySelector("#player-o");
    const dialog = document.querySelector("dialog");
    const label = document.querySelector("label");
    const resetButton = document.querySelector("#reset-button");
    let currentPlayer;
    let winOrTie;

    startGameButton.addEventListener("click", () => {
        if (playerXInput.value.length > 8 || playerOInput.value.length > 8) {
            warning.classList.remove("hide");
            return
        } else if (!warning.classList.contains("hide")) {
            warning.classList.add("hide");
        }
        activeGame.namePlayer(playerXInput.value, "X");
        activeGame.namePlayer(playerOInput.value, "O");
        currentPlayer = activeGame.getCurrentPlayer();
        gameMessage.textContent = `It's your turn ${currentPlayer.getName()}!`;
        gameSetup.classList.add("hide");
        gameMessageContainer.classList.remove("hide");
        boardContainer.classList.remove("hide");
    })
    
    boardSpace.forEach(square => {
        square.addEventListener("click", () => {
            if (square.textContent !== "") {
                gameMessage.textContent = `You cannot play in the spot ${currentPlayer.getName()}!`;
                return;
            }
            activeGame.setCoordinate(square.dataset.x, square.dataset.y);
            square.textContent = currentPlayer.getSymbol();
            activeGame.playTurn();
            winOrTie = activeGame.checkWinner(activeGame.getTurnCount())
            if (winOrTie === "win") {
                gameMessage.textContent = `${currentPlayer.getName()} WINS!!!`;
                label.textContent = `${currentPlayer.getName()} WINS!!!`;
                dialog.showModal();
                return;
            } else if (winOrTie === "tie"){
                gameMessage.textContent = "The game is a tie!";
                label.textContent = "The game is a tie!";
                dialog.showModal();
                return;
            }
            activeGame.switchPlayer();
            currentPlayer = activeGame.getCurrentPlayer();
            gameMessage.textContent = `It's your turn ${currentPlayer.getName()}!`;
        })
    })

    resetButton.addEventListener("click", () => {
        playerXInput.value = "";
        playerOInput.value = "";
        gameSetup.classList.remove("hide");
        gameMessageContainer.classList.add("hide");
        boardContainer.classList.add("hide");
        boardSpace.forEach(square => square.textContent = "");
        dialog.close();
    })
})()