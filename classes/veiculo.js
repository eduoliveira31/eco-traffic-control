class Veiculo {
  constructor(origem) {
    this.origem = origem; // 'NORTE', 'SUL', 'ESTE', 'OESTE'
    this.tipo = random(['CAR', 'ECO-BUS', 'BIKE']);
    
    // Espaço ocupado na fila de trânsito (comprimento)
    if (this.tipo === 'ECO-BUS') {
      this.tamanho = 220; 
    } else if (this.tipo === 'CAR') {
      this.tamanho = 100; 
    } else if (this.tipo === 'BIKE') {
      this.tamanho = 60;  
    }
    
    this.velocidadeBase = this.tipo === 'BIKE' ? 1.5 : (this.tipo === 'ECO-BUS' ? 2.0 : 2.5);
    this.velocidade = this.velocidadeBase;
    this.parado = false;
    this.removido = false;

    // Coordenadas e linhas de paragem ajustadas às linhas brancas reais do mapa
    if (this.origem === 'NORTE') {
      this.x = 365; this.y = -50; this.dirX = 0; this.dirY = 1; 
      this.linhaParagem = 150; 
      this.rotacao = PI;      
    } else if (this.origem === 'SUL') {
      this.x = 435; this.y = height + 50; this.dirX = 0; this.dirY = -1; 
      this.linhaParagem = 440; 
      this.rotacao = 0;       
    } else if (this.origem === 'OESTE') {
      this.x = -50; this.y = 335; this.dirX = 1; this.dirY = 0; 
      this.linhaParagem = 260; 
      this.rotacao = HALF_PI; 
    } else if (this.origem === 'ESTE') {
      this.x = width + 50; this.y = 265; this.dirX = -1; this.dirY = 0; 
      this.linhaParagem = 540; 
      this.rotacao = -HALF_PI; 
    }
  }

  atualizar(semaforos, veiculos, ondaVerdeAtiva) {
    // 1. IDENTIFICAR O SEMÁFORO DA VIA
    let idxSemaforo = 0;
    if (this.origem === 'NORTE') idxSemaforo = 0;
    else if (this.origem === 'SUL') idxSemaforo = 1;
    else if (this.origem === 'ESTE') idxSemaforo = 2;
    else if (this.origem === 'OESTE') idxSemaforo = 3;

    let semaforo = (semaforos && semaforos[idxSemaforo]) ? semaforos[idxSemaforo] : null;
    
    // Prioriza a verificação de VERDE para libertar o veículo imediatamente
    let estaVermelho = false;
    if (semaforo) {
      if (semaforo.estado === 'VERDE' || semaforo.cor === 'VERDE') {
        estaVermelho = false;
      } else if (semaforo.estado === 'VERMELHO' || semaforo.cor === 'VERMELHO' || semaforo.vermelho === true) {
        estaVermelho = true;
      }
    }

    if (ondaVerdeAtiva) {
      estaVermelho = false;
    }

    // 2. PARAGEM NO SEMÁFORO VERMELHO
    let pararNoSemaforo = false;
    if (estaVermelho) {
      let frente = this.tamanho / 2;
      if (this.origem === 'NORTE' && (this.y + frente) >= (this.linhaParagem - 15) && this.y < this.linhaParagem) pararNoSemaforo = true;
      if (this.origem === 'SUL' && (this.y - frente) <= (this.linhaParagem + 15) && this.y > this.linhaParagem) pararNoSemaforo = true;
      if (this.origem === 'OESTE' && (this.x + frente) >= (this.linhaParagem - 15) && this.x < this.linhaParagem) pararNoSemaforo = true;
      if (this.origem === 'ESTE' && (this.x - frente) <= (this.linhaParagem + 15) && this.x > this.linhaParagem) pararNoSemaforo = true;
    }

    // 3. PARAGEM EM FILA ATRÁS DE OUTRO VEÍCULO
    let pararPorOutro = false;
    if (veiculos) {
      for (let outro of veiculos) {
        if (outro !== this && outro.origem === this.origem) {
          if (this.colideCom(outro)) {
            let estaAFrente = false;
            if (this.origem === 'NORTE' && outro.y > this.y) estaAFrente = true;
            if (this.origem === 'SUL' && outro.y < this.y) estaAFrente = true;
            if (this.origem === 'OESTE' && outro.x > this.x) estaAFrente = true;
            if (this.origem === 'ESTE' && outro.x < this.x) estaAFrente = true;

            if (estaAFrente) {
              pararPorOutro = true;
              break;
            }
          }
        }
      }
    }

    this.parado = pararNoSemaforo || pararPorOutro;

    if (!this.parado) {
      this.x += this.dirX * this.velocidade;
      this.y += this.dirY * this.velocidade;
    }

    if (this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) {
      this.removido = true;
    }
  }

  desenhar() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.rotacao);

    if (this.tipo === 'CAR') {
      image(imgCarro, 0, 0, imgCarro.width * 0.15, imgCarro.height * 0.15);
    } else if (this.tipo === 'ECO-BUS') {
      image(imgAutocarro, 0, 0, imgAutocarro.width * 0.15, imgAutocarro.height * 0.15);
    } else if (this.tipo === 'BIKE') {
      image(imgBicicleta, 0, 0, imgBicicleta.width * 0.10, imgBicicleta.height * 0.10);
    }

    pop();
  }

  colideCom(outro) {
    let getLargura = (v) => {
      if (v.tipo === 'CAR') return imgCarro ? imgCarro.width * 0.15 : 60;
      if (v.tipo === 'ECO-BUS') return imgAutocarro ? imgAutocarro.width * 0.15 : 80;
      if (v.tipo === 'BIKE') return imgBicicleta ? imgBicicleta.width * 0.10 : 36;
      return 60;
    };

    let largEste = getLargura(this);
    let largOutro = getLargura(outro);

    let w1 = (this.origem === 'NORTE' || this.origem === 'SUL') ? largEste : this.tamanho;
    let h1 = (this.origem === 'NORTE' || this.origem === 'SUL') ? this.tamanho : largEste;
    
    let w2 = (outro.origem === 'NORTE' || outro.origem === 'SUL') ? largOutro : outro.tamanho;
    let h2 = (outro.origem === 'NORTE' || outro.origem === 'SUL') ? outro.tamanho : largOutro;

    let esq1 = this.x - w1 / 2, dir1 = this.x + w1 / 2, topo1 = this.y - h1 / 2, base1 = this.y + h1 / 2;
    let esq2 = outro.x - w2 / 2, dir2 = outro.x + w2 / 2, topo2 = outro.y - h2 / 2, base2 = outro.y + h2 / 2;

    return (esq1 < dir2 && dir1 > esq2 && topo1 < base2 && base1 > topo2);
  }
}