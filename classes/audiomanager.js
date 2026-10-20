class AudioManager {
  constructor() {
    this.mic = null;
    this.calibrado = false;
    this.tempoCalibracao = 3000; // 3 segundos de calibração
    this.inicioCalibracao = 0;
    this.ruidoBase = 0.05;
    
    // Limiares de Histerese
    this.limiarMin = 0.15;
    this.limiarMax = 0.35;
    
    // Estado do sopro e Estamina
    this.ondaVerdeAtiva = false;
    this.stamina = 100;
    this.maxStamina = 100;
  }

  inicializar() {
    this.mic = new p5.AudioIn();
    this.mic.start();
    this.inicioCalibracao = millis();
  }

  calibrar() {
    if (!this.mic) return;
    
    let volAtual = this.mic.getLevel();
    let tempoDecorrido = millis() - this.inicioCalibracao;

    if (tempoDecorrido < this.tempoCalibracao) {
      // Atualiza o ruído base acumulado
      this.ruidoBase = max(this.ruidoBase, volAtual);
      // Recalcula os limiares com base no ruído da sala
      this.limiarMin = this.ruidoBase + 0.10;
      this.limiarMax = this.ruidoBase + 0.25;
    } else {
      this.calibrado = true;
    }
  }

  atualizar() {
    if (!this.calibrado || !this.mic) return;

    let volume = this.mic.getLevel();

    // Lógica de Histerese com Estamina
    if (volume > this.limiarMax && this.stamina > 0) {
      this.ondaVerdeAtiva = true;
    } else if (volume < this.limiarMin || this.stamina <= 0) {
      this.ondaVerdeAtiva = false;
    }

    // Gestão da Estamina
    if (this.ondaVerdeAtiva) {
      this.stamina -= 0.6; // Gasta estamina a soprar
      if (this.stamina < 0) this.stamina = 0;
    } else if (this.stamina < this.maxStamina) {
      this.stamina += 0.3; // Recarrega energia lentamente
      if (this.stamina > this.maxStamina) this.stamina = this.maxStamina;
    }
  }

  desenharBarras() {
    push();
    rectMode(CORNER);
    
    let vol = this.mic ? this.mic.getLevel() : 0;
    
    // 1. Barra de Volume do Microfone
    fill(30);
    rect(20, 40, 150, 15, 4);
    fill(this.ondaVerdeAtiva ? color(46, 204, 113) : color(52, 152, 219));
    rect(20, 40, map(vol, 0, 1, 0, 150), 15, 4);
    
    // Linhas de Limiar da Histerese
    stroke(231, 76, 60);
    strokeWeight(2);
    let xMin = 20 + map(this.limiarMin, 0, 1, 0, 150);
    let xMax = 20 + map(this.limiarMax, 0, 1, 0, 150);
    line(xMin, 38, xMin, 57);
    line(xMax, 38, xMax, 57);
    noStroke();

    fill(255);
    textSize(11);
    textAlign(LEFT, BOTTOM);
    text("MIC: " + (this.ondaVerdeAtiva ? "ONDA VERDE!" : "Normal"), 20, 36);

    // 2. Barra de Estamina
    fill(30);
    rect(20, 75, 150, 15, 4);
    fill(241, 196, 15);
    rect(20, 75, map(this.stamina, 0, this.maxStamina, 0, 150), 15, 4);

    fill(255);
    textSize(11);
    text("STAMINA", 20, 71);
    pop();
  }
}