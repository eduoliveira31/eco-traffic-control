class AudioManager {
  constructor() {
    this.mic = null;
    this.calibrado = false;
    this.tempoCalibracao = 2000;
    this.inicioCalibracao = 0;
    
    // Subido de 0.25 para 0.40 para reduzir ligeiramente a sensibilidade
    this.limiarMax = 0.40; 
    
    // Onda Verde com Temporizador de 4 segundos
    this.ondaVerdeAtiva = false;
    this.duracaoOndaVerde = 4000; 
    this.tempoAtivacao = 0;
    
    this.emCooldown = false;
    this.tempoCooldown = 1500; // 1.5s de pausa
  }

  inicializar() {
    this.mic = new p5.AudioIn();
    this.mic.start();
    this.inicioCalibracao = millis();
  }

  calibrar() {
    let tempoDecorrido = millis() - this.inicioCalibracao;
    if (tempoDecorrido >= this.tempoCalibracao) {
      this.calibrado = true;
    }
  }

  atualizar() {
    if (!this.calibrado || !this.mic) return;

    let volumeBruto = this.mic.getLevel();
    let volume = volumeBruto * 5.0; 
    let agora = millis();

    // 1. Controlo de tempo da Onda Verde (4s)
    if (this.ondaVerdeAtiva) {
      if (agora - this.tempoAtivacao >= this.duracaoOndaVerde) {
        this.ondaVerdeAtiva = false;
        this.emCooldown = true;
      }
    } 
    // 2. Cooldown (1.5s)
    else if (this.emCooldown) {
      if (agora - (this.tempoAtivacao + this.duracaoOndaVerde) >= this.tempoCooldown) {
        this.emCooldown = false;
      }
    } 
    // 3. Ativar apenas quando ultrapassar o novo limiar
    else if (volume > this.limiarMax) {
      this.ondaVerdeAtiva = true;
      this.tempoAtivacao = agora;
    }
  }

  desenharBarras() {
    push();
    rectMode(CORNER);
    
    let volBruto = this.mic ? this.mic.getLevel() : 0;
    let volAmplificado = volBruto * 5.0;
    let agora = millis();
    
    // 1. Barra de Volume do Microfone
    fill(30);
    rect(20, 40, 150, 15, 4);
    
    fill(this.ondaVerdeAtiva ? color(46, 204, 113) : color(52, 152, 219));
    rect(20, 40, map(volAmplificado, 0, 0.8, 0, 150, true), 15, 4);
    
    // Linha Vermelha de Disparo
    stroke(231, 76, 60);
    strokeWeight(2);
    let xMax = 20 + map(this.limiarMax, 0, 0.8, 0, 150, true);
    line(xMax, 38, xMax, 57);
    noStroke();

    fill(255);
    textSize(11);
    textAlign(LEFT, BOTTOM);
    text("MIC: " + (this.ondaVerdeAtiva ? "ONDA VERDE ATIVA!" : (this.emCooldown ? "RECARREGANDO..." : "Pronto")), 20, 36);

    // 2. Barra de Tempo Restante
    fill(30);
    rect(20, 75, 150, 15, 4);
    
    if (this.ondaVerdeAtiva) {
      let tempoRestante = max(0, this.duracaoOndaVerde - (agora - this.tempoAtivacao));
      fill(46, 204, 113);
      rect(20, 75, map(tempoRestante, 0, this.duracaoOndaVerde, 0, 150), 15, 4);
      fill(255);
      textSize(11);
      text("ONDA VERDE (4s)", 20, 71);
    } else if (this.emCooldown) {
      let tempoPassado = agora - (this.tempoAtivacao + this.duracaoOndaVerde);
      fill(241, 196, 15);
      rect(20, 75, map(tempoPassado, 0, this.tempoCooldown, 0, 150), 15, 4);
      fill(255);
      textSize(11);
      text("RECARGA", 20, 71);
    } else {
      fill(52, 152, 219);
      rect(20, 75, 150, 15, 4);
      fill(255);
      textSize(11);
      text("BOOST PRONTO", 20, 71);
    }
    
    pop();
  }
}