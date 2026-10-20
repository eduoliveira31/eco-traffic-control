let estado = 0; // 0 = Início, 1 = Jogo, 2 = Fim
let semaforos = [];
let veiculos = [];
let tempoUltimoVeiculo = 0;

function setup() {
  createCanvas(800, 600);

  // Criar os 4 Semáforos
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

function desenhaInicio() {
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(32);
  text("ECO-TRAFFIC CONTROL", width / 2, 150);
  
  textSize(16);
  fill(180);
  text("Pressiona ENTER para começar", width / 2, 300);
}

function desenhaJogo() {
  // Estradas
  rectMode(CENTER);
  fill(60);
  noStroke();
  rect(width / 2, height / 2, width, 120);  // Horizontal
  rect(width / 2, height / 2, 120, height); // Vertical

  // Linhas de trânsito
  stroke(255, 200, 0);
  strokeWeight(2);
  line(0, height / 2, width, height / 2);
  line(width / 2, 0, width / 2, height);
  noStroke();

  // Gerar um novo veículo a cada 2 segundos (2000 ms)
  if (millis() - tempoUltimoVeiculo > 2000) {
    let origens = ['NORTE', 'SUL', 'ESTE', 'OESTE'];
    veiculos.push(new Veiculo(random(origens)));
    tempoUltimoVeiculo = millis();
  }

  // Atualizar e desenhar veículos
  for (let i = veiculos.length - 1; i >= 0; i--) {
    let v = veiculos[i];
    v.atualizar(semaforos);
    v.desenhar();

    // Remover veículos que já saíram do ecrã
    if (v.removido) {
      veiculos.splice(i, 1);
    }
  }

  // Desenhar os 4 semáforos por cima dos veículos
  for (let s of semaforos) {
    s.desenhar();
  }

  textAlign(CENTER, CENTER);
  fill(255);
  textSize(14);
  text("Clica nos semáforos para abrir/fechar a passagem! | Pressiona 'F' para Fim", width / 2, 40);
}

function desenhaFim() {
  textAlign(CENTER, CENTER);
  fill(230, 80, 80);
  textSize(36);
  text("GAME OVER", width / 2, 200);

  textSize(16);
  fill(255);
  text("Pressiona ENTER para Reiniciar", width / 2, 320);
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
  if (estado === 1) {
    for (let s of semaforos) {
      if (s.foiClicado(mouseX, mouseY)) {
        s.mudar();
      }
    }
  }
}

function keyPressed() {
  if (estado === 0 && keyCode === ENTER) {
    estado = 1;
    veiculos = []; // Limpa veículos ao iniciar
  } else if (estado === 1 && (key === 'f' || key === 'F')) {
    estado = 2;
  } else if (estado === 2 && keyCode === ENTER) {
    estado = 0;
  }
}