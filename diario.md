# DIÁRIO DE DESENVOLVIMENTO — ECO-TRAFFIC CONTROL
Aluno: Eduardo Oliveira (33137) | Curso: ECGM | Unidade Curricular: Sistemas Multimédia

---

### Sessão 1 — Configuração Inicial e Máquina de Estados
- Criada a estrutura do repositório Git e a arquitetura modular de ficheiros (index.html, sketch.js e pasta classes/).
- Implementada a estrutura da Máquina de Estados (Estado 0: Início, Estado 1: Jogo, Estado 2: Game Over).
- Construída a interface do ecrã e o desenho vetorial das estradas em cruzamento no p5.js, incluindo o rodapé fixo com dados do aluno.

### Sessão 2 — Orientação a Objetos e Sinalização Semafórica
- Desenvolvida a classe `Semaforo.js` com controlo interativo por clique do rato (mudança do estado Vermelho/Verde).
- Refinamento e alinhamento preciso das coordenadas dos semáforos no cruzamento para garantir simetria visual perfeita nos passeios.

### Sessão 3 — Dinâmica de Veículos e Regras de Trânsito
- Criada a classe `Veiculo.js` com suporte a diferentes modais de transporte (Carros a combustão, Autocarros Elétricos e Bicicletas).
- Implementada a lógica de travagem perante o semáforo em sinal vermelho.
- Adicionada a verificação de filas de espera encadeadas, garantindo que os veículos param a uma distância de segurança sem se sobreporem.

### Sessão 4 — Integração Reativa por Áudio (Histerese e Estamina)
- Criada a classe `AudioManager.js` utilizando a biblioteca p5.sound para capturar a entrada do microfone.
- Implementado o sistema de calibração dinâmica nos primeiros 3 segundos de execução para ler o ruído ambiente.
- Programado o algoritmo de histerese (com limiares min/max) e barra de estamina para ativar a mecânica "Onda Verde" ao soprar.

### Sessão 5 — Métricas Ecológicas e Colisões
- Implementada a métrica de CO₂ Evitado acumulado para incentivar o trânsito de transportes sustentáveis (Bicicletas e Autocarros).
- Programada a barra de Poluição Urbana, que acumula danos à cidade quando carros a combustão ficam parados ao ralenti no vermelho.
- Adicionado o algoritmo de deteção de colisões físicas no cruzamento, acionando o Game Over por acidente de trânsito.

### Sessão 6 — Polimento, Sensibilidade e Dificuldade Progressiva
- Calibração fina da sensibilidade do microfone para responder prontamente a sopros suaves.
- Introduzida a dificuldade progressiva (Traffic Flow Dynamic): a taxa de surgimento de veículos acelera à medida que a pontuação ecológica aumenta.
- Testes finais de usabilidade, limpeza de erros de consola e sincronização completa do código no repositório GitHub.

### Sessão 7 — Refatoração de Hitboxes, Sincronização e Tráfego Fluido
- Implementação do algoritmo de colisão por Caixas Alinhadas aos Eixos (AABB), utilizando as dimensões reais das imagens escaladas em conjunto com o comprimento ocupado na fila (this.tamanho).
- Recalibração precisa dos pontos de retenção (linhaParagem) nas quatro vias do mapa para alinhar a frente dos veículos com as linhas brancas do cruzamento.
- Reestruturação da lógica do método atualizar() na classe Veiculo.js com prioridade ao estado VERDE dos semáforos, garantindo arranque imediato e eliminação de bloqueios perpétuos.
- Eliminação de erros de sintaxe e consolidação total da comunicação entre sketch.js, Veiculo.js e Semaforo.js para suporte contínuo à Onda Verde e cálculo do CO₂ evitado.

### Sessão 8 — Ajustes Visuais e Controlo Individual de Dimensões
Otimização do ecrã de relatório final (desenhaFim), removendo a classificação do condutor e reorganizando o layout para maior clareza visual.

- Implementação de um controlo individual de dimensões no método getDimensoes() da classe Veiculo.js, permitindo ajustar especificamente a hitbox e área do ECO-BUS.

- Criação de uma ferramenta temporária de debug visual no método desenhar() para renderizar as hitboxes dos veículos a vermelho e facilitar a calibração do tamanho.

### Sessão 9 — Cálculo Preciso de Espaçamento e Para-choques
- Resolução de problemas de sobreposição entre veículos através do cálculo dinamizado de distância entre os para-choques realísticos (frente e traseira).

- Eliminação do problema em que carros pequenos penetravam na traseira de veículos maiores (autocarros) durante as paragens em fila.

- Introdução e parametrização do indicador de folga no passo 4 do método atualizar(), garantindo uma distância visual limpa e personalizável entre veículos parados.

### Sessão 10 — Efeitos Sonoros e Imersão Auditiva
- Seleção, download e integração de ativos de áudio na pasta assets/audios/ para reforço do feedback de UI/UX.

- Integração de efeitos sonoros (SFX) para a interatividade dos semáforos (clique_semaforo.mp3) e ativação da mecânica de microfone (onda_verde.mp3).

- Implementação de faixa de música de fundo em loop (musica_fundo.mp3) e ruído ambiente urbano (ambiente_transito.mp3), com ajuste de volumes e paragem automática ao ocorrer colisão ou paragem da simulação.