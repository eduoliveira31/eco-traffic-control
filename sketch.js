let estado = 0; // 0 = Início, 1 = Jogo, 2 = Fim
let semaforos = [];
let veiculos = [];
let audioManager;
let tempoUltimoVeiculo = 0;

// Variáveis de Jogo / Métricas Ecológicas
let pontosCO2 = 0;        // CO2 Evitado acumulado (g)
let nivelPoluicao = 0;    // Poluição da Cidade (%)
let maxPoluicao = 100;

function setup() {
  createCanvas(800, 600);

  audioManager = new AudioManager();

  // Semáforos nos 4 cantos
  semaforos.push(new Semaforo(325, 225, 'V')); // Norte
  semaforos.push(new Semaforo(475, 375, 'V')); // Sul
  semaforos.push(new Semaforo(475, 225, 'H')); // Este
  semaforos.push(new Semaforo(325, 375, 'H')); // Oeste
}

function draw() {
  background(40);

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

  desenhaRodape();
}

// --- ECRÃ 1: INÍCIO ---
function desenhaInicio() {
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(32);
  text("ECO-TRAFFIC CONTROL", width / 2, 150);
  
  if (audioManager.mic && !audioManager.calibrado) {
    audioManager.calibrar();
    fill(241, 196, 15);
    textSize(16);
    text("A calibrar ruído ambiente... Por favor faça silêncio", width / 2, 280);
  } else if (audioManager.calibrado) {
    fill(46, 204, 113);
    textSize(16);
    text("Microfone Calibrado!", width / 2, 260);
    fill(180);
    text("Pressiona ENTER para começar", width / 2, 310);
  } else {
    textSize(16);
    fill(180);
    text("Clica no ecrã para ativar o Microfone", width / 2, 300);
  }
}

// --- ECRÃ 2: JOGO ---
function desenhaJogo() {
  audioManager.atualizar();

  // Estradas
  rectMode(CENTER);
  fill(60);
  noStroke();
  rect(width / 2, height / 2, width, 120);  
  rect(width / 2, height / 2, 120, height); 

  // Linhas de trânsito
  stroke(255, 200, 0);
  strokeWeight(2);
  line(0, height / 2, width, height / 2);
  line(width / 2, 0, width / 2, height);
  noStroke();

  // Gerar veículos a cada 1.8s
  if (millis() - tempoUltimoVeiculo > 1800) {
    let origens = ['NORTE', 'SUL', 'ESTE', 'OESTE'];
    veiculos.push(new Veiculo(random(origens)));
    tempoUltimoVeiculo = millis();
  }

  // Atualizar e desenhar veículos
  for (let i = veiculos.length - 1; i >= 0; i--) {
    let v = veiculos[i];
    v.atualizar(semaforos, audioManager.ondaVerdeAtiva);
    v.desenhar();

    // Se um carro a combustão está parado no vermelho, aumenta a poluição
    if (v.parado && v.tipo === 'CAR') {
      nivelPoluicao += 0.03;
    }

    // Quando um veículo conclui a travessia e sai do ecrã
    if (v.removido) {
      if (v.tipo === 'ECO-BUS') pontosCO2 += 50; // Autocarro evita 50g de CO2
      if (v.tipo === 'BIKE') pontosCO2 += 20;    // Bicicleta evita 20g de CO2
      veiculos.splice(i, 1);
    }
  }

  // Desenhar semáforos
  for (let s of semaforos) {
    s.desenhar();
  }

  // Desenhar barras de Áudio e Estamina
  audioManager.desenharBarras();

  // Desenhar Painel de CO2 e Poluição
  desenhaPainelEcologico();

  // Condição de Game Over por excesso de poluição
  if (nivelPoluicao >= maxPoluicao) {
    estado = 2;
  }
}

// --- PAINEL DE CO2 E POLUIÇÃO ---
function desenhaPainelEcologico() {
  push();
  rectMode(CORNER);
  
  // Painel de CO2 Evitado (Canto Superior Direito)
  fill(30, 200);
  rect(width - 220, 20, 200, 45, 6);
  fill(46, 204, 113);
  textSize(14);
  textAlign(LEFT, CENTER);
  text("CO₂ Evitado: " + pontosCO2 + " g", width - 205, 42);

  // Barra de Poluição
  fill(30);
  rect(width - 220, 75, 200, 15, 4);
  fill(231, 76, 60);
  rect(width - 220, 75, map(nivelPoluicao, 0, maxPoluicao, 0, 200), 15, 4);
  
  fill(255);
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text("POLUIÇÃO DA CIDADE", width - 220, 71);
  pop();
}

// --- ECRÃ 3: FIM DE JOGO ---
function desenhaFim() {
  textAlign(CENTER, CENTER);
  fill(230, 80, 80);
  textSize(36);
  text("GAME OVER", width / 2, 180);

  fill(255);
  textSize(18);
  text("A cidade ficou demasiado poluída!", width / 2, 230);
  
  fill(46, 204, 113);
  textSize(22);
  text("Total de CO₂ Evitado: " + pontosCO2 + " g", width / 2, 280);

  fill(180);
  textSize(16);
  text("Pressiona ENTER para Reiniciar", width / 2, 350);
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

function mousePressed() {
  if (!audioManager.mic) {
    userStartAudio();
    audioManager.inicializar();
  }

  if (estado === 1) {
    for (let s of semaforos) {
      if (s.foiClicado(mouseX, mouseY)) {
        s.mudar();
      }
    }
  }
}

function keyPressed() {
  if (estado === 0 && keyCode === ENTER && audioManager.calibrado) {
    estado = 1;
    veiculos = [];
    pontosCO2 = 0;
    nivelPoluicao = 0;
  } else if (estado === 1 && (key === 'f' || key === 'F')) {
    estado = 2;
  } else if (estado === 2 && keyCode === ENTER) {
    estado = 0;
  }
}