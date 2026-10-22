class Semaforo {
  constructor(x, y, orientacao) {
    this.x = x;
    this.y = y;
    this.orientacao = orientacao; // 'V' ou 'H'
    this.estado = 'VERMELHO';     // 'VERMELHO' ou 'VERDE'
    this.tamanho = 30;
  }

  mudar() {
    if (this.estado === 'VERMELHO') {
      this.estado = 'VERDE';
    } else {
      this.estado = 'VERMELHO';
    }
  }

  foiClicado(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    return d < this.tamanho / 2;
  }

  desenhar() {
    push();
    imageMode(CENTER);
    
    // Altera este valor para ajustar o tamanho sem desformatar a imagem
    let escala = 0.15; 
    
    if (this.estado === 'VERMELHO') {
      image(imgSemaforoVermelho, this.x, this.y, imgSemaforoVermelho.width * escala, imgSemaforoVermelho.height * escala);
    } else {
      image(imgSemaforoVerde, this.x, this.y, imgSemaforoVerde.width * escala, imgSemaforoVerde.height * escala);
    }
    
    pop();
  }
}   