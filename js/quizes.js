document.addEventListener('DOMContentLoaded', () => {
  const optionsGrid = document.getElementById('optionsGrid');
  const btnNext = document.getElementById('btnNext');
  const quizBreadcrumb = document.getElementById('quizBreadcrumb');
  const quizPercent = document.getElementById('quizPercent');
  const qNum = document.getElementById('qNum');
  const quizCard = document.querySelector('.quiz-card');

  // Identifica a categoria vinda da URL
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('categoria') || 'hardware';

  // Banco de Questões por Categoria
  const bancoQuestoes = {
    hardware: [
      {
        pergunta: "Qual termo de Hardware está sendo sinalizado?",
        correta: "Mouse",
        opcoes: [
          { nome: "Mouse", icone: "🖱️" },
          { nome: "Teclado", icone: "⌨️" },
          { nome: "Monitor", icone: "🖥️" },
          { nome: "Processador", icone: "💾" }
        ]
      },
      {
        pergunta: "Qual termo representa a unidade de entrada do computador?",
        correta: "Teclado",
        opcoes: [
          { nome: "Processador", icone: "💾" },
          { nome: "Teclado", icone: "⌨️" },
          { nome: "Mouse", icone: "🖱️" },
          { nome: "Monitor", icone: "🖥️" }
        ]
      },
      {
        pergunta: "Qual periférico exibe as informações visuais na tela?",
        correta: "Monitor",
        opcoes: [
          { nome: "Teclado", icone: "⌨️" },
          { nome: "Mouse", icone: "🖱️" },
          { nome: "Monitor", icone: "🖥️" },
          { nome: "Processador", icone: "💾" }
        ]
      }
    ],
    software: [
      {
        pergunta: "Qual item é considerado um Sistema Operacional?",
        correta: "Linux",
        opcoes: [
          { nome: "Linux", icone: "🐧" },
          { nome: "HDMI", icone: "🔌" },
          { nome: "RAM", icone: "🎰" },
          { nome: "Fonte", icone: "⚡" }
        ]
      },
      {
        pergunta: "Qual software é utilizado para navegar na Web?",
        correta: "Navegador Web",
        opcoes: [
          { nome: "Navegador Web", icone: "🌐" },
          { nome: "Placa Mãe", icone: "🎛️" },
          { nome: "Cabo de Rede", icone: "🧶" },
          { nome: "HD Externo", icone: "💽" }
        ]
      }
    ],
    redes: [
      {
        pergunta: "Qual dispositivo conecta computadores em uma rede local?",
        correta: "Roteador",
        opcoes: [
          { nome: "Roteador", icone: "📡" },
          { nome: "Monitor", icone: "🖥️" },
          { nome: "Teclado", icone: "⌨️" },
          { nome: "Pendrive", icone: "💾" }
        ]
      }
    ]
  };

  const perguntasQuiz = bancoQuestoes[catParam] || bancoQuestoes['hardware'];
  let questaoAtualIndex = 0;
  let pontuacao = 0;

  // Funções de Persistência via LocalStorage
  function registrarQuestaoFeita(categoria) {
    let stats = JSON.parse(localStorage.getItem('statsQuestoes') || '{}');
    stats[categoria] = (stats[categoria] || 0) + 1;
    localStorage.setItem('statsQuestoes', JSON.stringify(stats));

    // Incrementa contador geral de questões
    let total = parseInt(localStorage.getItem('totalQuestoesFeitas') || '0', 10);
    localStorage.setItem('totalQuestoesFeitas', (total + 1).toString());
  }

  function registrarQuizConcluido(categoria) {
    let concluidos = JSON.parse(localStorage.getItem('quizzesConcluidos') || '[]');
    if (!concluidos.includes(categoria)) {
      concluidos.push(categoria);
      localStorage.setItem('quizzesConcluidos', JSON.stringify(concluidos));
    }
  }

  function carregarQuestao() {
    btnNext.style.display = 'none';
    optionsGrid.innerHTML = '';

    const questao = perguntasQuiz[questaoAtualIndex];
    const total = perguntasQuiz.length;
    const progresso = Math.round((questaoAtualIndex / total) * 100);

    const nomeCat = catParam.charAt(0).toUpperCase() + catParam.slice(1);
    quizBreadcrumb.innerText = `${nomeCat} · Questão ${questaoAtualIndex + 1} de ${total}`;
    quizPercent.innerText = `${progresso}% concluído`;
    qNum.innerText = questaoAtualIndex + 1;

    document.querySelector('.quiz-header h2').innerText = questao.pergunta;

    questao.opcoes.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="opt-icon">${opt.icone}</span>
        <div>
          <div>${opt.nome}</div>
          <span class="status-badge"></span>
        </div>
      `;

      btn.addEventListener('click', () => selecionarResposta(btn, opt.nome, questao.correta));
      optionsGrid.appendChild(btn);
    });
  }

  function selecionarResposta(btnSelecionado, opcaoEscolhida, opcaoCorreta) {
    const todosBotoes = optionsGrid.querySelectorAll('.option-btn');
    todosBotoes.forEach(b => b.style.pointerEvents = 'none');

    if (opcaoEscolhida === opcaoCorreta) {
      btnSelecionado.classList.add('correct');
      btnSelecionado.querySelector('.status-badge').innerText = '✓ Correto!';
      pontuacao++;

      // Contabiliza a questão respondida com sucesso
      registrarQuestaoFeita(catParam);

      if (questaoAtualIndex < perguntasQuiz.length - 1) {
        btnNext.innerText = 'Próxima Questão →';
      } else {
        btnNext.innerText = 'Finalizar Quiz 🏆';
      }
      btnNext.style.display = 'block';

    } else {
      btnSelecionado.classList.add('incorrect');
      btnSelecionado.querySelector('.status-badge').innerText = 'X Errou! Reiniciando...';

      todosBotoes.forEach(b => {
        if (b.innerText.includes(opcaoCorreta)) {
          b.classList.add('correct');
        }
      });

      setTimeout(() => {
        alert('Você errou uma questão! O quiz será reiniciado do começo.');
        questaoAtualIndex = 0;
        pontuacao = 0;
        carregarQuestao();
      }, 1800);
    }
  }

  btnNext.addEventListener('click', () => {
    if (questaoAtualIndex < perguntasQuiz.length - 1) {
      questaoAtualIndex++;
      carregarQuestao();
    } else {
      registrarQuizConcluido(catParam);
      exibirResultadoFinal();
    }
  });

  function exibirResultadoFinal() {
    quizCard.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem;">
        <span style="font-size: 3.5rem;">🎉</span>
        <h2 style="margin: 10px 0; color: var(--primary);">Parabéns! Quiz Concluído!</h2>
        <p style="color: var(--text-muted); margin-bottom: 20px;">Você acertou todas as ${perguntasQuiz.length} questões da categoria ${catParam}!</p>
        <a href="praticar.html" class="btn btn-white" style="background: var(--primary-gradient); color: white; display: inline-block;">Voltar para Praticar</a>
      </div>
    `;
    optionsGrid.innerHTML = '';
    btnNext.style.display = 'none';
    quizPercent.innerText = '100% concluído';
  }

  carregarQuestao();
});