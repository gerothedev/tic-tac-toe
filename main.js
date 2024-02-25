const gameBoard = (function() {
    let board = [["", "", ""],
                    ["", "", ""], 
                    ["", "", ""]];

    const getBoard = () => board;
    const markBoard = (x, y, symbol) => board[x][y] = symbol;
    const resetBoard = () => {
        board = board.map(element => element.map(value => value = ""));
    } 

    return { getBoard, markBoard, resetBoard };
})()

function game() {
    let xCoord, yCoord, playerX, playerO, currentPlayer, turnCount;

    function namePlayer(name, xOrO) {
        if (xOrO === "X") {
            playerX = player(name, xOrO);
        } else if (xOrO === "O") {
            playerO = player(name, xOrO);
        }
    }

    turnCount = 0;
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
        turnCount % 2 === 0 ? currentPlayer = "X" : currentPlayer = "O";
    }

    function playTurn() {
        if (gameBoard.getBoard()[xCoord][yCoord] != "") {
            return;
        } else {
            currentPlayer === "X" ? gameBoard.markBoard(xCoord, yCoord, playerX.getSymbol()) :gameBoard.markBoard(xCoord, yCoord, playerO.getSymbol());
            turnCount++;
            console.table(gameBoard.getBoard());
        }
    }

    function resetGame() {
        playerX = player("", "X");
        playerO = player("", "O");
        turnCount = 0;
        currentPlayer = "X";
        gameBoard.resetBoard();
    }

    function checkWinner(fullBoard) {
        let winningSymbol;
        for (let i = 0; i < gameBoard.getBoard().length; i++) {
            if (gameBoard.getBoard()[i][0] !== "" && gameBoard.getBoard()[i][0] === gameBoard.getBoard()[i][1] && gameBoard.getBoard()[i][1] === gameBoard.getBoard()[i][2]) {
                winningSymbol = gameBoard.getBoard()[i][0];
            }
        }
        for (let i = 0; i < gameBoard.getBoard().length; i++) {
            if (gameBoard.getBoard()[0][i] !== "" && gameBoard.getBoard()[0][i] === gameBoard.getBoard()[1][i] && gameBoard.getBoard()[1][i] === gameBoard.getBoard()[2][i]) {
                winningSymbol = gameBoard.getBoard()[0][i];
            }
        }
        if ((gameBoard.getBoard()[0][0] !== "" && gameBoard.getBoard()[0][0] === gameBoard.getBoard()[1][1] && gameBoard.getBoard()[1][1] === gameBoard.getBoard()[2][2]) ||
            (gameBoard.getBoard()[2][0] !== "" && gameBoard.getBoard()[2][0] === gameBoard.getBoard()[1][1] && gameBoard.getBoard()[1][1] === gameBoard.getBoard()[0][2])) {
            winningSymbol = gameBoard.getBoard()[0][0];
        }
        switch(winningSymbol) {
            case "X": 
                console.log(`${playerX.getName()} wins the game!`);
                resetGame();
                return true;
            case "O": 
                console.log(`${playerO.getName()} wins the game!`);
                resetGame();
                return true;
            default: 
                if (fullBoard === 9) {
                    console.log("The game is a tie!");
                    resetGame();
                    return true;
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
            if (activeGame.checkWinner(activeGame.getTurnCount())) {
                gameMessage.textContent = `${currentPlayer.getName()} WINS!!!`;
                label.textContent = `${currentPlayer.getName()} WINS!!!`;
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