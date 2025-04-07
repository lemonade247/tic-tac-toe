const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const turnIndicator = document.getElementById('turnIndicator');
const restartButton = document.getElementById('restartButton');
const winningBanner = document.getElementById('winningBanner');
const overlay = document.getElementById('overlay');
const winnerMessage = document.getElementById('winnerMessage');
const playAgainButton = document.getElementById('playAgainButton');
const playerSetup = document.getElementById('playerSetup');
const gameInfo = document.getElementById('gameInfo');
const startGameButton = document.getElementById('startGame');
const player1NameInput = document.getElementById('player1Name');
const player2NameInput = document.getElementById('player2Name');
const player1Display = document.getElementById('player1Display');
const player2Display = document.getElementById('player2Display');
const winSound = document.getElementById('winSound');

let isXTurn = true;
let gameActive = true;
let player1Name = 'Player 1';
let player2Name = 'Player 2';

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function startGame() {
    player1Name = player1NameInput.value.trim() || 'Player 1';
    player2Name = player2NameInput.value.trim() || 'Player 2';
    
    player1Display.textContent = player1Name;
    player2Display.textContent = player2Name;
    
    playerSetup.style.display = 'none';
    gameInfo.style.display = 'flex';
    board.style.display = 'grid';
    restartButton.style.display = 'block';
    
    updateTurnIndicator();
}

function handleCellClick(e) {
    const cell = e.target;
    const currentClass = isXTurn ? 'x' : 'o';

    if (!gameActive || cell.textContent !== '') return;

    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        updateTurnIndicator();
    }
}

function placeMark(cell, currentClass) {
    cell.textContent = currentClass.toUpperCase();
    cell.classList.add(currentClass);
}

function swapTurns() {
    isXTurn = !isXTurn;
}

function updateTurnIndicator() {
    const currentPlayer = isXTurn ? player1Name : player2Name;
    turnIndicator.textContent = `${currentPlayer}'s Turn`;
}

function checkWin(currentClass) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.textContent !== '';
    });
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        winnerMessage.textContent = "It's a Draw!";
    } else {
        const winner = isXTurn ? player1Name : player2Name;
        winnerMessage.textContent = `🎉 ${winner} Wins! 🎉`;
        winSound.play();
    }
    showWinningBanner();
}

function showWinningBanner() {
    winningBanner.style.display = 'block';
    overlay.style.display = 'block';
}

function hideWinningBanner() {
    winningBanner.style.display = 'none';
    overlay.style.display = 'none';
}

function restartGame() {
    isXTurn = true;
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    updateTurnIndicator();
    hideWinningBanner();
}

function resetToSetup() {
    playerSetup.style.display = 'block';
    gameInfo.style.display = 'none';
    board.style.display = 'none';
    restartButton.style.display = 'none';
    hideWinningBanner();
    restartGame();
}

// Event Listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', restartGame);
playAgainButton.addEventListener('click', resetToSetup);
startGameButton.addEventListener('click', startGame);

// Allow starting game with Enter key
player2NameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startGame();
    }
}); 