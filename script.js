// script.js

const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");

let cells = Array(9).fill(""); // Game state
let currentPlayer = "X";       // Player's turn
let gameActive = true;         // Game state flag

// Initialize the game
function initGame() {
    cells = Array(9).fill("");
    currentPlayer = "X";
    gameActive = true;
    board.innerHTML = ""; // Clear the board
    statusText.textContent = "Your turn! (Player X)";
    
    // Create 3x3 grid
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handlePlayerMove);
        board.appendChild(cell);
    }
}

// Handle player move
function handlePlayerMove(event) {
    const cellIndex = event.target.dataset.index;

    if (!cells[cellIndex] && gameActive) {
        cells[cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;

        if (checkWin("X")) {
            statusText.textContent = "You win!";
            gameActive = false;
        } else if (cells.every(cell => cell)) {
            statusText.textContent = "It's a draw!";
            gameActive = false;
        } else {
            currentPlayer = "O"; // Switch to AI
            statusText.textContent = "AI's turn...";
            setTimeout(aiMove, 500); // Simulate AI delay
        }
    }
}

// AI Move
function aiMove() {
    const bestMove = findBestMove();
    cells[bestMove] = "O";

    const cellDiv = board.querySelector(`[data-index='${bestMove}']`);
    cellDiv.textContent = "O";

    if (checkWin("O")) {
        statusText.textContent = "AI wins!";
        gameActive = false;
    } else if (cells.every(cell => cell)) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = "X";
        statusText.textContent = "Your turn! (Player X)";
    }
}

// Check for a win
function checkWin(player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winningCombinations.some(combination =>
        combination.every(index => cells[index] === player)
    );
}

// Minimax algorithm to determine the best move
function minimax(boardState, depth, isMaximizing) {
    if (checkWin("O")) return 10 - depth;
    if (checkWin("X")) return depth - 10;
    if (boardState.every(cell => cell)) return 0;

    const availableMoves = boardState.map((cell, index) => (cell ? null : index)).filter(index => index !== null);

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let move of availableMoves) {
            boardState[move] = "O";
            const score = minimax(boardState, depth + 1, false);
            boardState[move] = "";
            bestScore = Math.max(bestScore, score);
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let move of availableMoves) {
            boardState[move] = "X";
            const score = minimax(boardState, depth + 1, true);
            boardState[move] = "";
            bestScore = Math.min(bestScore, score);
        }
        return bestScore;
    }
}

// Find the best move for the AI
function findBestMove() {
    let bestScore = -Infinity;
    let move = -1;

    cells.forEach((cell, index) => {
        if (!cell) {
            cells[index] = "O";
            const score = minimax(cells, 0, false);
            cells[index] = "";
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });

    return move;
}

// Reset the game
resetButton.addEventListener("click", initGame);

// Start the game on page load
initGame();
