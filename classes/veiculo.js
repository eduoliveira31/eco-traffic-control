class Veiculo {
  constructor(origem) {
    this.origem = origem; // 'NORTE', 'SUL', 'ESTE', 'OESTE'
    this.tipo = random(['CAR', 'ECO-BUS', 'BIKE']);
    this.tamanho = this.tipo === 'ECO-BUS' ? 35 : (this.tipo === 'BIKE' ? 15 : 25);
    this.velocidadeBase = this.tipo === 'BIKE' ? 1.5 : (this.tipo === 'ECO-BUS' ? 2.0 : 2.5);
    this.velocidade = this.velocidadeBase;
    this.parado = false;
    this.removido = false;

    // Configuração inicial de posições e faixas de rodagem
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

  atualizar(semaforos, todosVeiculos, ondaVerdeAtiva) {
    // Impulso da Onda Verde
    if (ondaVerdeAtiva && (this.tipo === 'ECO-BUS' || this.tipo === 'BIKE')) {
      this.velocidade = this.velocidadeBase * 2.5;
    } else {
      this.velocidade = this.velocidadeBase;
    }

    // Identificar semáforo da rota
    let semaforoCorrespondente;
    if (this.origem === 'NORTE') semaforoCorrespondente = semaforos[0];
    if (this.origem === 'SUL') semaforoCorrespondente = semaforos[1];
    if (this.origem === 'ESTE') semaforoCorrespondente = semaforos[2];
    if (this.origem === 'OESTE') semaforoCorrespondente = semaforos[3];

    // 1. Verificação do Semáforo Vermelho
    let pertoDaLinha = false;
    if (this.origem === 'NORTE' && this.y < this.linhaParagem && this.y + this.velocidade >= this.linhaParagem) pertoDaLinha = true;
    if (this.origem === 'SUL' && this.y > this.linhaParagem && this.y - this.velocidade <= this.linhaParagem) pertoDaLinha = true;
    if (this.origem === 'OESTE' && this.x < this.linhaParagem && this.x + this.velocidade >= this.linhaParagem) pertoDaLinha = true;
    if (this.origem === 'ESTE' && this.x > this.linhaParagem && this.x - this.velocidade <= this.linhaParagem) pertoDaLinha = true;

    let deveParar = false;

    if (pertoDaLinha && semaforoCorrespondente.estado === 'VERMELHO') {
      deveParar = true;
    }

    // 2. Verificação de Fila de Espera (Não sobrepor ao veículo da frente)
    for (let outro of todosVeiculos) {
      if (outro !== this && outro.origem === this.origem) {
        let d = dist(this.x, this.y, outro.x, outro.y);
        let distMinima = (this.tamanho / 2) + (outro.tamanho / 2) + 12; // Margem de segurança

        // Se o outro veículo estiver à frente na mesma direção
        if (d < distMinima) {
          if (this.origem === 'NORTE' && outro.y > this.y) deveParar = true;
          if (this.origem === 'SUL' && outro.y < this.y) deveParar = true;
          if (this.origem === 'OESTE' && outro.x > this.x) deveParar = true;
          if (this.origem === 'ESTE' && outro.x < this.x) deveParar = true;
        }
      }
    }

    // Se o semáforo passar a VERDE e não houver carros à frente, avança
    if (semaforoCorrespondente.estado === 'VERDE' && !this.haVeiculoAFrente(todosVeiculos)) {
      deveParar = false;
    }

    this.parado = deveParar;

    // Movimentação
    if (!this.parado) {
      this.x += this.dirX * this.velocidade;
      this.y += this.dirY * this.velocidade;
    }

    // Marcar remoção fora do ecrã
    if (this.x < -60 || this.x > width + 60 || this.y < -60 || this.y > height + 60) {
      this.removido = true;
    }
  }

  // Função auxiliar para saber se tem veículo colado à frente
  haVeiculoAFrente(todosVeiculos) {
    for (let outro of todosVeiculos) {
      if (outro !== this && outro.origem === this.origem) {
        let d = dist(this.x, this.y, outro.x, outro.y);
        let distMinima = (this.tamanho / 2) + (outro.tamanho / 2) + 12;
        if (d < distMinima) {
          if (this.origem === 'NORTE' && outro.y > this.y) return true;
          if (this.origem === 'SUL' && outro.y < this.y) return true;
          if (this.origem === 'OESTE' && outro.x > this.x) return true;
          if (this.origem === 'ESTE' && outro.x < this.x) return true;
        }
      }
    }
    return false;
  }

  // Deteta colisão física com veículos de cruzamento
  colideCom(outro) {
    let d = dist(this.x, this.y, outro.x, outro.y);
    return d < (this.tamanho / 2 + outro.tamanho / 2);
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