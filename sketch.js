let estado = 0; // 0 = Início, 1 = Jogo, 2 = Fim
let semaforos = [];
let veiculos = [];
let audioManager;
let tempoUltimoVeiculo = 0;

// Imagens do jogo
let imgCarro, imgAutocarro, imgBicicleta;
let imgSemaforoVermelho, imgSemaforoVerde, imgEstrada;

// Variáveis Ecológicas e Dificuldade
let pontosCO2 = 0;
let nivelPoluicao = 0;
let maxPoluicao = 100;
let motivoGameOver = "";

function preload() {
  imgCarro = loadImage('assets/imagens/carro.png');
  imgAutocarro = loadImage('assets/imagens/autocarro.png');
  imgBicicleta = loadImage('assets/imagens/bicicleta.png');
  imgSemaforoVermelho = loadImage('assets/imagens/semaforo_vermelho.png');
  imgSemaforoVerde = loadImage('assets/imagens/semaforo_verde.png');
  imgEstrada = loadImage('assets/imagens/estrada.png');
}

function setup() {
  createCanvas(800, 600);
  audioManager = new AudioManager();

  // Semáforos nos cantos dos passeios
  // [0] = Norte, [1] = Sul, [2] = Este, [3] = Oeste
  semaforos.push(new Semaforo(310, 150, 'V')); 
  semaforos.push(new Semaforo(490, 450, 'V')); 
  semaforos.push(new Semaforo(550, 210, 'H')); 
  semaforos.push(new Semaforo(250, 390, 'H')); 
}

function draw() {
  background(25);

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

// ==========================================
// ECRÃ INICIAL — REGRAS E CALIBRAÇÃO
// ==========================================
function desenhaInicio() {
  if (imgEstrada) image(imgEstrada, 0, 0, width, height);

  push();
  // Card Central Translúcido
  rectMode(CENTER);
  fill(15, 23, 42, 220);
  stroke(51, 65, 85);
  strokeWeight(2);
  rect(width / 2, height / 2 - 15, 680, 470, 16);

  // Título
  textAlign(CENTER, CENTER);
  noStroke();
  fill(46, 204, 113);
  textSize(34);
  textStyle(BOLD);
  text("ECO-TRAFFIC CONTROL", width / 2, 90);

  fill(148, 163, 184);
  textSize(13);
  textStyle(NORMAL);
  text("Gestão Inteligente de Tráfego Urbano Sustentável", width / 2, 120);

  // Painel de Regras e Controlos
  fill(30, 41, 59, 180);
  stroke(71, 85, 105);
  rect(width / 2, 230, 620, 160, 10);

  noStroke();
  fill(226, 232, 240);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("COMO JOGAR & REGRAS:", width / 2 - 290, 165);

  textSize(12);
  textStyle(NORMAL);
  fill(203, 213, 225);
  text("• Clique nos semáforos para alterar entre VERMELHO e VERDE.", width / 2 - 290, 190);
  text("• Evite acidentes: veículos em vias cruzadas entram em colisão física.", width / 2 - 290, 210);
  text("• Controle a poluição: carros parados ao ralenti no vermelho geram emissões nocivas.", width / 2 - 290, 230);
  text("• Sopre no Microfone para ativar a ONDA VERDE (Acelera tráfego e duplica CO₂ Evitado).", width / 2 - 290, 250);
  text("• Priorize Transportes Eco (Autocarros Elétricos e Bicicletas) para máxima pontuação.", width / 2 - 290, 270);

  // Status do Microfone e Botão de Início
  textAlign(CENTER, CENTER);
  if (audioManager.mic && !audioManager.calibrado) {
    audioManager.calibrar();
    fill(241, 196, 15);
    textSize(15);
    text("A calibrar ruído ambiente... Por favor faça silêncio", width / 2, 350);
  } else if (audioManager.calibrado) {
    fill(46, 204, 113);
    textSize(15);
    textStyle(BOLD);
    text("Microfone Calibrado e Pronto!", width / 2, 340);

    // Botão de Start
    fill(46, 204, 113);
    rect(width / 2, 395, 340, 45, 8);
    fill(15, 23, 42);
    textSize(15);
    text("PRESSIONE ENTER PARA COMEÇAR", width / 2, 395);
  } else {
    fill(239, 68, 68);
    textSize(14);
    text("Microfone Desativado", width / 2, 340);

    fill(59, 130, 246);
    rect(width / 2, 395, 360, 45, 8);
    fill(255);
    textSize(14);
    textStyle(BOLD);
    text("CLIQUE NO ECRÃ PARA ATIVAR ÁUDIO", width / 2, 395);
  }
  pop();
}

// ==========================================
// ECRÃ DE JOGO — PAINEL E METRICAS
// ==========================================
function desenhaJogo() {
  audioManager.atualizar();

  if (imgEstrada) image(imgEstrada, 0, 0, width, height);

  // DIFICULDADE PROGRESSIVA
  let intervaloGeracao = max(600, 2000 - floor(pontosCO2 / 100) * 150);

  // Gerar novos veículos
  if (millis() - tempoUltimoVeiculo > intervaloGeracao) {
    let origens = ['NORTE', 'SUL', 'ESTE', 'OESTE'];
    veiculos.push(new Veiculo(random(origens)));
    tempoUltimoVeiculo = millis();
  }

  // Atualizar e desenhar veículos
  for (let i = veiculos.length - 1; i >= 0; i--) {
    let v = veiculos[i];
    v.atualizar(semaforos, veiculos, audioManager.ondaVerdeAtiva);
    v.desenhar();

    // Apenas carros a combustão parados aumentam a poluição
    if (v.parado && v.tipo === 'CAR') {
      nivelPoluicao += 0.035;
    }

    // Detetar Colisões entre veículos de rotas cruzadas
    for (let j = i - 1; j >= 0; j--) {
      let outro = veiculos[j];
      if (v.origem !== outro.origem && v.colideCom(outro)) {
        motivoGameOver = "COLISÃO GRAVE NO CRUZAMENTO!";
        estado = 2;
      }
    }

    // Pontuação atribuída ao sair do ecrã
    if (v.removido) {
      let multiplicador = audioManager.ondaVerdeAtiva ? 2 : 1; 
      
      if (v.tipo === 'ECO-BUS') pontosCO2 += 50 * multiplicador; 
      else if (v.tipo === 'BIKE') pontosCO2 += 20 * multiplicador;    
      else if (v.tipo === 'CAR') pontosCO2 += 10 * multiplicador; 
      
      veiculos.splice(i, 1);
    }
  }

  // Desenhar Semáforos
  for (let s of semaforos) {
    s.desenhar();
  }

  // Interface do Jogo
  audioManager.desenharBarras();
  desenhaPainelEcologico();

  // Fim de jogo por poluição excessiva
  if (nivelPoluicao >= maxPoluicao) {
    motivoGameOver = "A CIDADE ATINGIU NÍVEIS CRÍTICOS DE POLUIÇÃO!";
    estado = 2;
  }
}

// ==========================================
// HUD DE JOGO (ECO-METRICAS & ONDA VERDE)
// ==========================================
function desenhaPainelEcologico() {
  push();
  rectMode(CORNER);
  
  // Card CO2 Evitado
  fill(15, 23, 42, 210);
  stroke(51, 65, 85);
  strokeWeight(1.5);
  rect(width - 230, 15, 215, 50, 8);

  noStroke();
  fill(46, 204, 113);
  textSize(11);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("PONTUAÇÃO ECOLÓGICA", width - 218, 22);

  fill(255);
  textSize(16);
  text(pontosCO2 + " g", width - 218, 38);

  fill(148, 163, 184);
  textSize(10);
  textStyle(NORMAL);
  text("CO₂ Evitado", width - 130, 42);

  // Card Barra de Poluição
  fill(15, 23, 42, 210);
  stroke(51, 65, 85);
  strokeWeight(1.5);
  rect(width - 230, 72, 215, 42, 8);

  noStroke();
  fill(226, 232, 240);
  textSize(10);
  textStyle(BOLD);
  text("POLUIÇÃO URBANA", width - 218, 78);

  // Fundo da barra
  fill(30, 41, 59);
  rect(width - 218, 93, 190, 10, 4);

  // Preenchimento com transição de cor (Verde -> Amarelo -> Vermelho)
  let percentual = constrain(nivelPoluicao / maxPoluicao, 0, 1);
  if (percentual < 0.5) {
    fill(46, 204, 113);
  } else if (percentual < 0.8) {
    fill(241, 196, 15);
  } else {
    fill(231, 76, 60);
  }
  rect(width - 218, 93, 190 * percentual, 10, 4);

  // Banner Alerta Onda Verde Ativa
  if (audioManager.ondaVerdeAtiva) {
    rectMode(CENTER);
    fill(46, 204, 113, 230);
    stroke(255);
    strokeWeight(2);
    rect(width / 2, 35, 320, 35, 20);

    noStroke();
    fill(15, 23, 42);
    textSize(14);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("ONDA VERDE ATIVA (2X BÓNUS)", width / 2, 35);
  }
  pop();
}

// ==========================================
// ECRÃ DE GAME OVER / SCORE FINAL
// ==========================================
function desenhaFim() {
  if (imgEstrada) image(imgEstrada, 0, 0, width, height);

  push();
  rectMode(CENTER);
  fill(15, 23, 42, 230);
  stroke(239, 68, 68);
  strokeWeight(2);
  rect(width / 2, height / 2, 580, 380, 16);

  // Título Game Over
  textAlign(CENTER, CENTER);
  noStroke();
  fill(239, 68, 68);
  textSize(32);
  textStyle(BOLD);
  text("SIMULAÇÃO TERMINADA", width / 2, 140);

  // Motivo da paragem
  fill(226, 232, 240);
  textSize(14);
  textStyle(NORMAL);
  text(motivoGameOver, width / 2, 180);

  // Painel de Resultados
  fill(30, 41, 59, 200);
  stroke(51, 65, 85);
  rect(width / 2, 260, 480, 90, 10);

  noStroke();
  fill(148, 163, 184);
  textSize(12);
  text("TOTAL DE CO₂ EVITADO", width / 2, 235);

  fill(46, 204, 113);
  textSize(36);
  textStyle(BOLD);
  text(pontosCO2 + " g", width / 2, 275);

  // Botão Reiniciar
  fill(46, 204, 113);
  rect(width / 2, 350, 320, 42, 8);
  fill(15, 23, 42);
  textSize(14);
  textStyle(BOLD);
  text("REINICIAR (PRESSIONE ENTER)", width / 2, 350);
  pop();
}

// ==========================================
// RODAPÉ FIXO
// ==========================================
function desenhaRodape() {
  push();
  fill(15, 23, 42);
  rectMode(CORNER);
  noStroke();
  rect(0, height - 28, width, 28);

  fill(148, 163, 184);
  textSize(11);
  textAlign(LEFT, CENTER);
  text("ECO-TRAFFIC CONTROL | Mobilidade Urbana Sustentável", 15, height - 14);

  textAlign(RIGHT, CENTER);
  text("Eduardo Oliveira (33137) | ECGM", width - 15, height - 14);
  pop();
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
    motivoGameOver = "SIMULAÇÃO ENCERRADA PELO UTILIZADOR";
    estado = 2;
  } else if (estado === 2 && keyCode === ENTER) {
    estado = 0;
  }
}