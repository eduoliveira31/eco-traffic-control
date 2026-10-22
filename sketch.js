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

function desenhaJogo() {
  audioManager.atualizar();

  image(imgEstrada, 0, 0, width, height);

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
        motivoGameOver = "ACIDENTE NO CRUZAMENTO!";
        estado = 2;
      }
    }

    // Pontuação atribuída ao sair do ecrã com sucesso
    if (v.removido) {
      let multiplicador = audioManager.ondaVerdeAtiva ? 2 : 1; 
      
      if (v.tipo === 'ECO-BUS') pontosCO2 += 50 * multiplicador; 
      else if (v.tipo === 'BIKE') pontosCO2 += 20 * multiplicador;    
      else if (v.tipo === 'CAR') pontosCO2 += 10 * multiplicador; 
      
      veiculos.splice(i, 1);
    }
  }

  // Semáforos
  for (let s of semaforos) {
    s.desenhar();
  }

  // Interface de utilizador
  audioManager.desenharBarras();
  desenhaPainelEcologico();

  // Fim de jogo por poluição excessiva
  if (nivelPoluicao >= maxPoluicao) {
    motivoGameOver = "A CIDADE FICOU DEMASIADO POLUÍDA!";
    estado = 2;
  }
}

function desenhaPainelEcologico() {
  push();
  rectMode(CORNER);
  
  fill(30, 200);
  rect(width - 220, 20, 200, 45, 6);
  fill(46, 204, 113);
  textSize(14);
  textAlign(LEFT, CENTER);
  text("CO₂ Evitado: " + pontosCO2 + " g", width - 205, 42);

  fill(30);
  rect(width - 220, 75, 200, 15, 4);
  fill(231, 76, 60);
  rect(width - 220, 75, map(nivelPoluicao, 0, maxPoluicao, 0, 200, true), 15, 4);
  
  fill(255);
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text("POLUIÇÃO DA CIDADE", width - 220, 71);
  pop();
}

function desenhaFim() {
  textAlign(CENTER, CENTER);
  fill(230, 80, 80);
  textSize(36);
  text("GAME OVER", width / 2, 180);

  fill(255);
  textSize(18);
  text(motivoGameOver, width / 2, 230);
  
  fill(46, 204, 113);
  textSize(22);
  text("Total de CO₂ Evitado: " + pontosCO2 + " g", width / 2, 280);

  fill(180);
  textSize(16);
  text("Pressiona ENTER para Reiniciar", width / 2, 350);
}

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
    motivoGameOver = "SIMULAÇÃO ENCERRADA";
    estado = 2;
  } else if (estado === 2 && keyCode === ENTER) {
    estado = 0;
  }
}