const cols = ['B', 'I', 'N', 'G', 'O'];

const ranges = {
  B: [1, 15],
  I: [16, 30],
  N: [31, 45],
  G: [46, 60],
  O: [61, 75],
};

const colors = {
  B: '#185FA5',
  I: '#B85500',
  N: '#1D9E75',
  G: '#993556',
  O: '#533AB7',
};

let balls = [];
let drawnBalls = new Set();

// Retorna a letra (B/I/N/G/O) correspondente ao número
function getLetterForNum(n) {
  for (const [letter, [min, max]] of Object.entries(ranges)) {
    if (n >= min && n <= max) return letter;
  }
}

// Monta a grade de bolinhas na tela
function buildGrid() {
  const grid = document.getElementById('columnsGrid');
  grid.innerHTML = '';

  cols.forEach(letter => {
    const [min, max] = ranges[letter];

    let html = `
      <div class="col-wrap">
        <div class="col-header col-${letter}-h">${letter}</div>
        <div class="col-balls" id="col-${letter}">
    `;

    for (let n = min; n <= max; n++) {
      html += `<div class="mini-ball" id="ball-${n}">${n}</div>`;
    }

    html += '</div></div>';
    grid.innerHTML += html;
  });
}

// Embaralha e inicializa as 75 bolas
function initBalls() {
  balls = Array.from({ length: 75 }, (_, i) => i + 1);

  // Fisher-Yates shuffle
  for (let i = balls.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [balls[i], balls[j]] = [balls[j], balls[i]];
  }

  drawnBalls.clear();
}

// Sorteia uma bola
function drawBall() {
  if (drawnBalls.size >= 75 || balls.length === 0) return;

  const n = balls.pop();
  drawnBalls.add(n);
  const letter = getLetterForNum(n);

  // Atualiza bolinha grande com animação
  const bigBall = document.getElementById('bigBall');
  bigBall.className = 'big-ball';
  void bigBall.offsetWidth; // força reflow para reiniciar a animação
  bigBall.classList.add('animate');
  bigBall.style.background = colors[letter];
  bigBall.style.boxShadow = `inset 0 -5px 0 rgba(0,0,0,0.2), 0 4px 16px ${colors[letter]}55`;

  document.getElementById('bigLetter').textContent = letter;
  document.getElementById('bigNumber').textContent = n;
  document.getElementById('ballLabel').textContent = `${letter}${n} sorteado!`;

  // Remove destaque da bolinha anterior
  document.querySelectorAll('.mini-ball.latest').forEach(b => b.classList.remove('latest'));

  // Destaca a bolinha na grade
  const miniEl = document.getElementById(`ball-${n}`);
  if (miniEl) {
    miniEl.classList.add(`drawn-${letter}`, 'latest');
  }

  // Atualiza contador e barra de progresso
  const drawn = drawnBalls.size;
  document.getElementById('drawnCount').textContent = drawn;

  const progressBar = document.getElementById('progressBar');
  progressBar.style.width = (drawn / 75 * 100) + '%';
  progressBar.style.background = colors[letter];

  // Fim de jogo
  if (drawn >= 75) {
    document.getElementById('btnDraw').disabled = true;
    document.getElementById('ballLabel').textContent = 'Todas as 75 bolas foram sorteadas!';
  }
}

// Reinicia o jogo
function resetGame() {
  initBalls();
  buildGrid();

  const bigBall = document.getElementById('bigBall');
  bigBall.style.background = '#185FA5';
  bigBall.style.boxShadow = 'inset 0 -5px 0 rgba(0,0,0,0.2), 0 4px 16px rgba(24,95,165,0.25)';

  document.getElementById('bigLetter').textContent = '';
  document.getElementById('bigNumber').textContent = '—';
  document.getElementById('ballLabel').textContent = 'Clique em "Sortear" para começar';
  document.getElementById('drawnCount').textContent = '0';
  document.getElementById('progressBar').style.width = '0%';
  document.getElementById('btnDraw').disabled = false;
}

// Inicializa ao carregar a página
buildGrid();
initBalls();
