let board = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = false;
let mode = ''; // 'pvp' or 'cpu'

const statusDiv = document.getElementById('status');
const boardDiv = document.getElementById('board');

function setMode(selectedMode) {
  mode = selectedMode;
  resetGame();
  gameActive = true;
  statusDiv.textContent = `${currentPlayer}'s Turn (${mode.toUpperCase()})`;
}

// Create board cells
for (let i = 0; i < 9; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('data-index', i);
  cell.addEventListener('click', handleCellClick);
  boardDiv.appendChild(cell);
}

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (!gameActive || board[index]) return;

  makeMove(index, currentPlayer);

  if (checkWinner(currentPlayer)) {
    statusDiv.innerHTML = `${getWinningMessage(currentPlayer)}`;
    confettiEffect();
    gameActive = false;
    return;
  }

  if (board.every(cell => cell)) {
    statusDiv.textContent = "It's a Draw! 🤝";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDiv.textContent = `${currentPlayer}'s Turn`;

  if (mode === 'cpu' && currentPlayer === 'O') {
    setTimeout(() => {
      const bestMove = getBestMove();
      makeMove(bestMove, 'O');
      if (checkWinner('O')) {
        statusDiv.innerHTML = `${getWinningMessage('O', true)}`;
        confettiEffect();
        gameActive = false;
      } else if (board.every(cell => cell)) {
        statusDiv.textContent = "It's a Draw! 🤝";
        gameActive = false;
      } else {
        currentPlayer = 'X';
        statusDiv.textContent = "X's Turn";
      }
    }, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  document.querySelector(`.cell[data-index="${index}"]`).textContent = player;
}

function checkWinner(player) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(i => board[i] === player)
  );
}

function getBestMove() {
  const emptyIndexes = board.map((val, i) => val === '' ? i : null).filter(i => i !== null);
  return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
}

function resetGame() {
  board = Array(9).fill('');
  document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
  currentPlayer = 'X';
  gameActive = mode !== '';
  statusDiv.textContent = mode ? `${currentPlayer}'s Turn (${mode.toUpperCase()})` : 'Choose Mode to Start';
}

function getWinningMessage(player, isCPU = false) {
  const winnerName = isCPU ? 'Computer 🤖' : player;
  const emojis = "🎉🎊🥳🏆✨";
  return `<span style="font-weight:bold; font-size:1.5rem;">${winnerName} Wins! ${emojis}</span>`;
}

function confettiEffect() {
  const confettiCount = 30;
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.textContent = ['🎉', '🎊', '✨', '🥳', '🏆'][Math.floor(Math.random() * 5)];
    
    confetti.style.position = 'fixed';
    confetti.style.fontSize = `${Math.random() * 24 + 16}px`;
    confetti.style.left = `${Math.random() * window.innerWidth}px`;
    confetti.style.top = `-${Math.random() * 50 + 20}px`;
    confetti.style.opacity = '1';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    confetti.style.transition = 'transform 3s ease-out, opacity 3s ease-out';

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.style.transform = `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`;
      confetti.style.opacity = '0';
    }, 50);

    setTimeout(() => {
      confetti.remove();
    }, 3500);
  }
}

