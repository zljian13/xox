var prevBtn;
var nextBtn;
var resetBtn;
var cells = [];

const initialGameState = {
    turn: 'X',
    winner: '',
    board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]
}

let gameState;
let gameHistory = [];
let gameForwardHistory = [];

window.onload = () => {
    prevBtn = document.getElementById('prev');
    nextBtn = document.getElementById('next');
    resetBtn = document.getElementById('reset');

    prevBtn.onclick = () => {
        if (gameHistory.length <= 1) {
            return;
        }

        gameForwardHistory.push(gameHistory.pop());
        gameState = structuredClone(gameHistory[gameHistory.length - 1]);
        persistState();
        renderGameState(gameState);
    }

    nextBtn.onclick = () => {
        if (gameForwardHistory.length <= 0) {
            return;
        }
        gameHistory.push(gameForwardHistory.pop());
        gameState = structuredClone(gameHistory[gameHistory.length - 1]);
        persistState();
        renderGameState(gameState);
    }

    resetBtn.onclick = () => {
        gameHistory = [];
        gameForwardHistory = [];
        gameState = structuredClone(initialGameState);
        turn();
    }

    Array.from(document.getElementById('board').getElementsByClassName('row')).forEach((row, rowIndex) => {
        let col = Array.from(row.getElementsByClassName('col'));
        col.forEach((cell, colIndex) => {
            cell.onclick = () => {
                if (gameState.board[rowIndex][colIndex] !== '') return;
                gameState.board[rowIndex][colIndex] = gameState.turn;
                gameState.turn = gameState.turn === 'X' ? 'O' : 'X';
                turn();
            }
        });
        cells.push(col);
    });

    loadFromPersistentStorage();

    if (gameHistory.length === 0) {
        gameState = structuredClone(initialGameState);
        turn();
    }
}

function turn() {
    if (gameState.winner != '') {
        return;
    }

    checkConditions();

    manageHistory();

    persistState();

    renderGameState(gameState);
}

function manageHistory() {
    gameForwardHistory = [];
    gameHistory.push(structuredClone(gameState));
}

function persistState() {
    localStorage.setItem('state', JSON.stringify({
        gameState: gameState,
        gameHistory: gameHistory,
        gameForwardHistory: gameForwardHistory
    }));
}

function loadFromPersistentStorage() {
    let state = localStorage.getItem('state');
    if (state === null) {
        return;
    }

    try {
        state = JSON.parse(state);
    } catch (_) {return}
    
    gameState = state.gameState;
    gameHistory = state.gameHistory;
    gameForwardHistory = state.gameForwardHistory;
    renderGameState(gameState);
}

function checkConditions() {

    if (((gameState.board[0][0] === gameState.board[1][1] && gameState.board[1][1] === gameState.board[2][2]) ||
        (gameState.board[0][1] === gameState.board[1][1] && gameState.board[1][1] === gameState.board[2][1]) ||
        (gameState.board[0][2] === gameState.board[1][1] && gameState.board[1][1] === gameState.board[2][0]) ||
        (gameState.board[1][2] === gameState.board[1][1] && gameState.board[1][1] === gameState.board[1][0])) &&
        gameState.board[1][1] !== '') {
        gameState.winner = gameState.board[1][1];
        return;
    }

    if (((gameState.board[0][0] === gameState.board[0][1] && gameState.board[0][1] === gameState.board[0][2]) ||
        (gameState.board[0][0] === gameState.board[1][0] && gameState.board[1][0] === gameState.board[2][0])) &&
        gameState.board[0][0] !== '') {
        gameState.winner = gameState.board[0][0];
        return;
    }

    if (((gameState.board[2][2] === gameState.board[1][2] && gameState.board[1][2] === gameState.board[0][2]) ||
        (gameState.board[2][2] === gameState.board[2][1] && gameState.board[2][1] === gameState.board[2][0])) &&
        gameState.board[2][2] !== '') {
        gameState.winner = gameState.board[2][2];
        return;
    }

    let state = '';
    gameState.board.forEach(row => {
        row.forEach(cell => {
            state += cell;
        });
    })
    if (state.length === 9) {
        gameState.winner = 'draw';
    }
}

function renderGameState(gameState) {
    gameState.board.forEach((row, rowIndex) => {
        row.forEach((cellState, colIndex) => {
            let cell = cells[rowIndex][colIndex];
            cell.innerText = cellState
            if (cellState === '') {
                cell.classList.remove('active');
            } else {
                cell.classList.add('active');
            }
        });
    });

    if (gameState.winner !== '') {
        if (gameState.winner === 'draw') {
            alert('draw!!')
        } else {
            alert(`${gameState.winner} won!`)
        }
    }
}