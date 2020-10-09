// Construção dinâmica  do canvas 
const { body } = document;
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
const width = 500;
const height = 700;
const screenWidth = window.screen.width;
const canvasPosition = screenWidth / 2 - width / 2;
const isMobile = window.matchMedia('(max-width: 600px)');
const gameOverEl = document.createElement('div');

//  Construção das Paddles (raquetas) 
const paddleHeight = 10;
const paddleWidth = 50;
const paddleDiff = 25;
let paddleBottomX = 225;
let paddleTopX = 225;
let playerMoved = false;
let paddleContact = false;

//  Construção da Bola
let ballX = 250;
let ballY = 350;
const ballRadius = 5;

// Velocidade da bola
let speedY;
let speedX;
let trajectoryX;
let computerSpeed;

// Mudança  da velocidade especialmente para Mobile 
if (isMobile.matches) {
  speedY = -2;
  speedX = speedY;
  computerSpeed = 4;
} else {
  speedY = -1;
  speedX = speedY;
  computerSpeed = 3;
}

// Define a pontuação dos jogadores no iníco e do vençedor da partida
let playerScore = 0;
let computerScore = 0;
const winningScore = 10;
let isGameOver = true;
let isNewGame = true;

// Faz o Render de tudo no Canvas
function renderCanvas() {
  // Background do Canvas 
  context.fillStyle = '#006266';
  context.fillRect(0, 0, width, height);

  // Cor dos Paddles (raquetas) 
  context.fillStyle = '#fff';

  // Paddle  do player  (parte de baixo )
  context.fillRect(paddleBottomX, height - 20, paddleWidth, paddleHeight);

  // Paddle do Computador (topo)
  context.fillRect(paddleTopX, 10, paddleWidth, paddleHeight);


  // Linha localizada no meio do canvas
  context.beginPath();
  context.setLineDash([4]);
  context.moveTo(0, 350);
  context.lineTo(500, 350);
  context.strokeStyle = '#ffff';
  context.stroke();

  // Construção da bola
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
  context.fillStyle = '#ffd32a';
  context.fill();

  // Pontuação
  context.font = '40px Courier New fontWeight bold';
  context.fillText(playerScore, 20, canvas.height / 2 + 50);
  context.fillText(computerScore, 20, canvas.height / 2 - 30);
}

// Cria elemento no Canvas
function createCanvas() {
  canvas.width = width;
  canvas.height = height;
  body.appendChild(canvas);
  renderCanvas();
}

// Reseta a bola  para o centro do canvas
function ballReset() {
  ballX = width / 2;
  ballY = height / 2;
  speedY = -3;
  paddleContact = false;
}

// Ajusta o movimento da bola
function ballMove() {
  // Velocidade vertical 
  ballY += -speedY;
  //  Velocida horizontal 
  if (playerMoved && paddleContact) {
    ballX += speedX;
  }
}


// Determina quando a bola quica, reseta a pontuação e marca o ponto
function ballBoundaries() {
  // Quica a bola para a  parede esquerda
  if (ballX < 0 && speedX < 0) {
    speedX = -speedX;
  }
 // Quica a bola para a  parede  direita
  if (ballX > width && speedX > 0) {
    speedX = -speedX;
  }

  // Quica a paddle    do jogador  de baixo
  if (ballY > height - paddleDiff) {
    if (ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
      paddleContact = true;
      //  Acelera a velocidade  da bola ao atingir a paddle 
      if (playerMoved) {
        speedY -= 1;
        // Velocida de máxima da paddle
        if (speedY < -5) {
          speedY = -5;
          computerSpeed = 6;
        }
      }
      speedY = -speedY;
      trajectoryX = ballX - (paddleBottomX + paddleDiff);
      speedX = trajectoryX * 0.3;
    } else if (ballY > height) {
      // Reseta a bola e  adiciona ponto para a máquina(A.I)
      ballReset();
      computerScore++;
    }
  }

  // Quica  a paddle  da  máquina(A.I)
  if (ballY < paddleDiff) {
    if (ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
      // Adiciona velocidade à bola ao ser atingida
      if (playerMoved) {
        speedY += 1;
        // Velocidade máxima da bola 
        if (speedY > 5) {
          speedY = 5;
        }
      }
      speedY = -speedY;
    } else if (ballY < 0) {
      // Reseta a bola e pontua para o player
      ballReset();
      playerScore++;
    }
  }
}

// Movemento do payer máquina(A.I)
function computerAI() {
  if (playerMoved) {
    if (paddleTopX + paddleDiff < ballX) {
      paddleTopX += computerSpeed;
    } else {
      paddleTopX -= computerSpeed;
    }
  }
}


//  Tansiciona do canvas para a tela de "Game Over"
function showGameOverEl(winner) {
  //  Esconde o canvas
  canvas.hidden = true
  //  Container do "Game Over"
  gameOverEl.textContent = '';
  gameOverEl.classList.add('game-over-container');
  // Título
  const title = document.createElement('h1');
  title.textContent = `${winner} Venceu!`;
  // Botão
  const playAgainBtn = document.createElement('button');
  playAgainBtn.setAttribute('onclick', 'startGame()');
  playAgainBtn.textContent = 'Jogar Novamente';
  // Adiciona a tela de "Game Over" e o botão para recomeçar a partida
gameOverEl.append(title, playAgainBtn)
body.appendChild(gameOverEl)  
}

//  Checa se algum player ganhou ponto na partida, se sim,  finaliza a rodada
function gameOver() {
  if (playerScore === winningScore || computerScore === winningScore) {
    isGameOver = true ;
    //  Mostra o vencedor da partida
    const winner = playerScore ===winningScore ? 'Você' : 'A.I';
    showGameOverEl(winner);
  }
}

//  Ajusta e anima os frames do jogo na tela do canvas 
function animate() {
  renderCanvas();
  ballMove();
  ballBoundaries();
  computerAI();
  gameOver()
 if(!isGameOver){
  window.requestAnimationFrame(animate)
 }
}

// Reinicia o jogo e reseta tudo
function startGame() {
  if (isGameOver && !isNewGame) {
body.removeChild(gameOverEl)
canvas.hidden = false

  }
  isGameOver = false;
  isNewGame = false ;
  playerScore = 0;
  computerScore = 0;
  ballReset();
  createCanvas();
  animate();

  canvas.addEventListener('mousemove', (e) => {
    playerMoved = true;
    // Compensa a posição do canvas na tela
    paddleBottomX = e.clientX - canvasPosition - paddleDiff;
    if (paddleBottomX < paddleDiff) {
      paddleBottomX = 0;
    }
    if (paddleBottomX > width - paddleWidth) {
      paddleBottomX = width - paddleWidth;
    }
    //  Esconde o cursor ao entrar no canvas
    canvas.style.cursor = 'none';
  });
}

// Ao carregar a tela o jogo inicia 
startGame();


//               THAT'S IT, I HOPE Y'ALL ENJOY IT  !!!                //