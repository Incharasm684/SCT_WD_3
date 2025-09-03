let currentPlayer = "X";
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];
let scoreX = 0;
let scoreO = 0;
let mode = localStorage.getItem("mode") || "pvp"; 
let difficulty = localStorage.getItem("difficulty") || "easy";

const boardElement = document.getElementById("board");
const messageElement = document.getElementById("message");
const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");

// ✅ Create Board
function createBoard() {
  boardElement.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    boardElement.appendChild(cell);
  }
}
createBoard();

// ✅ Handle click
function handleCellClick(event) {
  const index = event.target.dataset.index;
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;

  if (checkWinner()) {
    messageElement.textContent = `🎉 Player ${currentPlayer} Wins!`;
    updateScore(currentPlayer);
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    messageElement.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  messageElement.textContent = `Player ${currentPlayer}'s Turn`;

  // ✅ Computer’s move
  if (mode === "pvc" && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

// ✅ Computer Move based on difficulty
function computerMove() {
  let move;

  if (difficulty === "easy") {
    move = randomMove();
  } else if (difficulty === "medium") {
    move = winningMove("O") || randomMove();
  } else if (difficulty === "hard") {
    move = minimax(board, "O").index;
  }

  board[move] = "O";
  const cell = document.querySelector(`.cell[data-index='${move}']`);
  cell.textContent = "O";

  if (checkWinner()) {
    messageElement.textContent = `🤖 Computer Wins!`;
    updateScore("O");
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    messageElement.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  messageElement.textContent = `Player ${currentPlayer}'s Turn`;
}

// ✅ Random Move
function randomMove() {
  let emptyCells = board.map((val, idx) => (val === "" ? idx : null)).filter((v) => v !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// ✅ Check for winning move
function winningMove(player) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (board[a] === player && board[b] === player && board[c] === "") return c;
    if (board[a] === player && board[c] === player && board[b] === "") return b;
    if (board[b] === player && board[c] === player && board[a] === "") return a;
  }
  return null;
}

// ✅ Minimax Algorithm (Hard Mode)
function minimax(newBoard, player) {
  const availSpots = newBoard.map((val, idx) => (val === "" ? idx : null)).filter((v) => v !== null);

  if (checkWinFor(newBoard, "X")) return { score: -10 };
  if (checkWinFor(newBoard, "O")) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === "O") {
      let result = minimax(newBoard, "X");
      move.score = result.score;
    } else {
      let result = minimax(newBoard, "O");
      move.score = result.score;
    }

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function checkWinFor(boardState, player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern => {
    const [a,b,c] = pattern;
    return boardState[a] === player && boardState[b] === player && boardState[c] === player;
  });
}

// ✅ Check Winner
function checkWinner() {
  return checkWinFor(board, currentPlayer);
}

// ✅ Update Score
function updateScore(player) {
  if (player === "X") {
    scoreX++;
    scoreXElement.textContent = scoreX;
  } else {
    scoreO++;
    scoreOElement.textContent = scoreO;
  }
}

// ✅ Reset Board
function resetBoard() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  messageElement.textContent = "Player X's Turn";
  createBoard();
}

// ✅ Back to welcome
function goBack() {
  window.location.href = "welcome.html";
}
