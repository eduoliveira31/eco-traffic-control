class Veiculo {
  constructor(origem) {
    this.origem = origem; // 'NORTE', 'SUL', 'ESTE', 'OESTE'
    this.tipo = random(['CAR', 'ECO-BUS', 'BIKE']); // Tipos de veículos
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
      this.linhaParagem = 200; // Ponto antes do semáforo Norte
    } else if (this.origem === 'SUL') {
      this.x = 435;
      this.y = height + 20;
      this.dirX = 0;
      this.dirY = -1;
      this.linhaParagem = 400; // Ponto antes do semáforo Sul
    } else if (this.origem === 'OESTE') {
      this.x = -20;
      this.y = 335;
      this.dirX = 1;
      this.dirY = 0;
      this.linhaParagem = 300; // Ponto antes do semáforo Oeste
    } else if (this.origem === 'ESTE') {
      this.x = width + 20;
      this.y = 265;
      this.dirX = -1;
      this.dirY = 0;
      this.linhaParagem = 500; // Ponto antes do semáforo Este
    }
  }

  atualizar(semaforos) {
    // Identificar o semáforo correspondente à rota
    let semaforoCorrespondente;
    if (this.origem === 'NORTE') semaforoCorrespondente = semaforos[0];
    if (this.origem === 'SUL') semaforoCorrespondente = semaforos[1];
    if (this.origem === 'ESTE') semaforoCorrespondente = semaforos[2];
    if (this.origem === 'OESTE') semaforoCorrespondente = semaforos[3];

    // Verificar se precisa de parar no semáforo vermelho
    let pertoDaLinha = false;
    if (this.origem === 'NORTE' && this.y < this.linhaParagem && this.y + this.velocidade >= this.linhaParagem) pertoDaLinha = true;
    if (this.origem === 'SUL' && this.y > this.linhaParagem && this.y - this.velocidade <= this.linhaParagem) pertoDaLinha = true;
    if (this.origem === 'OESTE' && this.x < this.linhaParagem && this.x + this.velocidade >= this.linhaParagem) pertoDaLinha = true;
    if (this.origem === 'ESTE' && this.x > this.linhaParagem && this.x - this.velocidade <= this.linhaParagem) pertoDaLinha = true;

    if (pertoDaLinha && semaforoCorrespondente.estado === 'VERMELHO') {
      this.parado = true;
    } else if (semaforoCorrespondente.estado === 'VERDE') {
      this.parado = false;
    }

    // Se não estiver parado, move-se
    if (!this.parado) {
      this.x += this.dirX * this.velocidade;
      this.y += this.dirY * this.velocidade;
    }

    // Marcar para remoção se sair do ecrã
    if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
      this.removido = true;
    }
  }

  desenhar() {
    push();
    rectMode(CENTER);
    noStroke();

    // Cor dependente da sustentabilidade do veículo
    if (this.tipo === 'ECO-BUS') fill(46, 204, 113);      // Verde (Autocarro Elétrico)
    else if (this.tipo === 'BIKE') fill(241, 196, 15);    // Amarelo (Bicicleta)
    else fill(231, 76, 60);                               // Vermelho (Carro a Combustão)

    rect(this.x, this.y, this.tamanho, this.tamanho, 4);
    pop();
  }
}