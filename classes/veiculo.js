class Veiculo {
  constructor(origem) {
    this.origem = origem; // 'NORTE', 'SUL', 'ESTE', 'OESTE'
    this.tipo = random(['CAR', 'ECO-BUS', 'BIKE']);
    this.tamanho = this.tipo === 'ECO-BUS' ? 35 : (this.tipo === 'BIKE' ? 15 : 25);
    this.velocidadeBase = this.tipo === 'BIKE' ? 1.5 : (this.tipo === 'ECO-BUS' ? 2.0 : 2.5);
    this.velocidade = this.velocidadeBase;
    this.parado = false;
    this.removido = false;

    // Configurar posição inicial e direção de movimento
    if (this.origem === 'NORTE') {
      this.x = 365;
      this.y = -20;
      this.dirX = 0;
      this.dirY = 1;
      this.linhaParagem = 200;
    } else if (this.origem === 'SUL') {
      this.x = 435;
      this.y = height + 20;
      this.dirX = 0;
      this.dirY = -1;
      this.linhaParagem = 400;
    } else if (this.origem === 'OESTE') {
      this.x = -20;
      this.y = 335;
      this.dirX = 1;
      this.dirY = 0;
      this.linhaParagem = 300;
    } else if (this.origem === 'ESTE') {
      this.x = width + 20;
      this.y = 265;
      this.dirX = -1;
      this.dirY = 0;
      this.linhaParagem = 500;
    }
  }

  atualizar(semaforos, ondaVerdeAtiva) {
    // Aumento de velocidade com Onda Verde
    if (ondaVerdeAtiva && (this.tipo === 'ECO-BUS' || this.tipo === 'BIKE')) {
      this.velocidade = this.velocidadeBase * 2.5;
    } else {
      this.velocidade = this.velocidadeBase;
    }

    // Identificar semáforo correspondente
    let semaforoCorrespondente;
    if (this.origem === 'NORTE') semaforoCorrespondente = semaforos[0];
    if (this.origem === 'SUL') semaforoCorrespondente = semaforos[1];
    if (this.origem === 'ESTE') semaforoCorrespondente = semaforos[2];
    if (this.origem === 'OESTE') semaforoCorrespondente = semaforos[3];

    // Verificar se está na linha de paragem
    let pertoDaLinha = false;
    if (this.origem === 'NORTE' && this.y < this.linhaParagem && this.y + this.velocidade >= this.linhaParagem) {
      pertoDaLinha = true;
    }
    if (this.origem === 'SUL' && this.y > this.linhaParagem && this.y - this.velocidade <= this.linhaParagem) {
      pertoDaLinha = true;
    }
    if (this.origem === 'OESTE' && this.x < this.linhaParagem && this.x + this.velocidade >= this.linhaParagem) {
      pertoDaLinha = true;
    }
    if (this.origem === 'ESTE' && this.x > this.linhaParagem && this.x - this.velocidade <= this.linhaParagem) {
      pertoDaLinha = true;
    }

    // Parar no vermelho ou avançar no verde
    if (pertoDaLinha && semaforoCorrespondente.estado === 'VERMELHO') {
      this.parado = true;
    } else if (semaforoCorrespondente.estado === 'VERDE') {
      this.parado = false;
    }

    // Movimentação
    if (!this.parado) {
      this.x += this.dirX * this.velocidade;
      this.y += this.dirY * this.velocidade;
    }

    // Marcar para remoção fora do ecrã
    if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
      this.removido = true;
    }
  }

  desenhar() {
    push();
    rectMode(CENTER);
    noStroke();

    if (this.tipo === 'ECO-BUS') fill(46, 204, 113);      // Verde
    else if (this.tipo === 'BIKE') fill(241, 196, 15);    // Amarelo
    else fill(231, 76, 60);                               // Vermelho

    rect(this.x, this.y, this.tamanho, this.tamanho, 4);
    pop();
  }
}