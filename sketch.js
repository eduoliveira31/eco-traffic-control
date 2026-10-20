// Estado do Jogo: 0 = Início, 1 = Jogo, 2 = Fim
let estado = 0;

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(40);

  // Máquina de Estados
  switch (estado) {
    case 0:
      desenhaInicio();
      break;
    case 1:
      desenhaJogo();
      break;
    case 2:
      desenhaFim();
      break;
  }

  // Identificação Obrigatória nos Cantos Inferiores (Requisito)
  desenhaRodape();
}

// --- ECRÃ 1: INÍCIO ---
function desenhaInicio() {
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(32);
  text("ECO-TRAFFIC CONTROL", width / 2, 150);
  
  textSize(16);
  fill(180);
  text("Pressiona ENTER para começar", width / 2, 300);
}

// --- ECRÃ 2: JOGO (CENÁRIO) ---
function desenhaJogo() {
  // Estradas do Cruzamento
  rectMode(CENTER);
  fill(60);
  noStroke();
  rect(width / 2, height / 2, width, 120);  // Estrada Horizontal
  rect(width / 2, height / 2, 120, height); // Estrada Vertical

  // Linhas do Cruzamento
  stroke(255, 200, 0);
  strokeWeight(2);
  line(0, height / 2, width, height / 2);
  line(width / 2, 0, width / 2, height);
  noStroke();

  // Texto temporário
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(16);
  text("Ecrã do Jogo - Pressiona 'F' para Simular Fim de Jogo", width / 2, 50);
}

// --- ECRÃ 3: FIM DE JOGO ---
function desenhaFim() {
  textAlign(CENTER, CENTER);
  fill(230, 80, 80);
  textSize(36);
  text("GAME OVER", width / 2, 200);

  textSize(16);
  fill(255);
  text("Pressiona ENTER para Reiniciar", width / 2, 320);
}

// --- RODAPÉ FIXO ---
function desenhaRodape() {
  fill(20);
  rectMode(CORNER);
  rect(0, height - 30, width, 30);

  fill(255);
  textSize(12);
  textAlign(LEFT, CENTER);
  text("Sustainable Urban Mobility", 15, height - 15);

  textAlign(RIGHT, CENTER);
  text("Eduardo Oliveira, 33137, ECGM", width - 15, height - 15);
}

// --- CONTROLO DE TECLAS ---
function keyPressed() {
  if (estado === 0 && keyCode === ENTER) {
    estado = 1;
  } else if (estado === 1 && (key === 'f' || key === 'F')) {
    estado = 2;
  } else if (estado === 2 && keyCode === ENTER) {
    estado = 0;
  }
}