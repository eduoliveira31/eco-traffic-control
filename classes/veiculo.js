class Veiculo {
  constructor(origem) {
    this.origem = origem; // 'NORTE', 'SUL', 'ESTE', 'OESTE'
    this.tipo = random(['CAR', 'ECO-BUS', 'BIKE']);
    
    this.velocidadeBase = this.tipo === 'BIKE' ? 1.5 : (this.tipo === 'ECO-BUS' ? 2.0 : 2.5);
    this.velocidade = this.velocidadeBase;
    this.parado = false;
    this.removido = false;

    // Coordenadas e linhas de paragem alinhadas com as faixas do mapa
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

  getDimensoes() {
    let img = imgCarro;
    let escala = 0.12;
    
    if (this.tipo === 'ECO-BUS') {
      img = imgAutocarro;
      escala = 0.12;
    } else if (this.tipo === 'BIKE') {
      img = imgBicicleta;
      escala = 0.08;
    }

    // CONTROLOS INDEPENDENTES
    let margemLargura = 0.5;      // Largura da caixa (evita bater nas faixas do lado)
    let margemComprimento = 1.05;  // Comprimento da caixa (distância entre carros na mesma fila)
    
    let largImg = (img && img.width > 0) ? (img.width * escala) * margemLargura : 20;
    let altImg = (img && img.height > 0) ? (img.height * escala) * margemComprimento : 40;

    if (this.origem === 'NORTE' || this.origem === 'SUL') {
      return { w: largImg, h: altImg };
    } else {
      return { w: altImg, h: largImg };
    }
  }

  atualizar(semaforos, veiculos, ondaVerdeAtiva) {
    let dim = this.getDimensoes();

    // 1. IDENTIFICAR O SEMÁFORO DA VIA
    let idxSemaforo = 0;
    if (this.origem === 'NORTE') idxSemaforo = 0;
    else if (this.origem === 'SUL') idxSemaforo = 1;
    else if (this.origem === 'ESTE') idxSemaforo = 2;
    else if (this.origem === 'OESTE') idxSemaforo = 3;

    let semaforo = (semaforos && semaforos[idxSemaforo]) ? semaforos[idxSemaforo] : null;
    
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
      let frente = (this.origem === 'NORTE' || this.origem === 'SUL') ? dim.h / 2 : dim.w / 2;
      if (this.origem === 'NORTE' && (this.y + frente) >= (this.linhaParagem - 10) && this.y < this.linhaParagem) pararNoSemaforo = true;
      if (this.origem === 'SUL' && (this.y - frente) <= (this.linhaParagem + 10) && this.y > this.linhaParagem) pararNoSemaforo = true;
      if (this.origem === 'OESTE' && (this.x + frente) >= (this.linhaParagem - 10) && this.x < this.linhaParagem) pararNoSemaforo = true;
      if (this.origem === 'ESTE' && (this.x - frente) <= (this.linhaParagem + 10) && this.x > this.linhaParagem) pararNoSemaforo = true;
    }

    // 3. PARAGEM EM FILA ATRÁS DE OUTRO VEÍCULO (NA MESMA VIA)
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
      image(imgCarro, 0, 0, imgCarro.width * 0.17, imgCarro.height * 0.17);
    } else if (this.tipo === 'ECO-BUS') {
      image(imgAutocarro, 0, 0, imgAutocarro.width * 0.16, imgAutocarro.height * 0.16);
    } else if (this.tipo === 'BIKE') {
      image(imgBicicleta, 0, 0, imgBicicleta.width * 0.08, imgBicicleta.height * 0.08);
    }

    pop();
  }

  colideCom(outro) {
    let dim1 = this.getDimensoes();
    let dim2 = outro.getDimensoes();

    let esq1 = this.x - dim1.w / 2;
    let dir1 = this.x + dim1.w / 2;
    let topo1 = this.y - dim1.h / 2;
    let base1 = this.y + dim1.h / 2;

    let esq2 = outro.x - dim2.w / 2;
    let dir2 = outro.x + dim2.w / 2;
    let topo2 = outro.y - dim2.h / 2;
    let base2 = outro.y + dim2.h / 2;

    return (esq1 < dir2 && dir1 > esq2 && topo1 < base2 && base1 > topo2);
  }
}