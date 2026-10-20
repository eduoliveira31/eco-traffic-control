class Semaforo {
  constructor(x, y, direcao) {
    this.x = x;
    this.y = y;
    this.direcao = direcao; // 'H' para Horizontal, 'V' para Vertical
    this.estado = 'VERMELHO'; // Estado inicial: VERMELHO ou VERDE
    this.raio = 18;
  }

  // Desenha o semáforo na canvas
  desenhar() {
    push();
    rectMode(CENTER);
    
    // Caixa do semáforo
    fill(30);
    stroke(100);
    strokeWeight(2);
    rect(this.x, this.y, 36, 36, 6);

    // Luz do semáforo (Verde ou Vermelha)
    noStroke();
    if (this.estado === 'VERDE') {
      fill(46, 204, 113); // Verde
    } else {
      fill(231, 76, 60);  // Vermelho
    }
    circle(this.x, this.y, this.raio * 2);
    pop();
  }

  // Alterna a cor do semáforo quando clicado
  mudar() {
    if (this.estado === 'VERMELHO') {
      this.estado = 'VERDE';
    } else {
      this.estado = 'VERMELHO';
    }
  }

  // Verifica se o clique do rato foi em cima deste semáforo
  foiClicado(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.raio;
  }
}