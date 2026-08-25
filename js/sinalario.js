document.addEventListener('DOMContentLoaded', () => {
  const termsList = document.getElementById('termsList');
  const detailPanel = document.getElementById('detailPanel');
  const searchInput = document.getElementById('searchInput');
  const filterPills = document.getElementById('filterPills');
  const termsCounter = document.getElementById('termsCounter');

  let termoAtualIndex = 0;
  let dadosFiltrados = [...bancoDadosTI];
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('categoria');

  if (catParam && categoriasTI[catParam]) {
    dadosFiltrados = bancoDadosTI.filter(item => item.categoriaId === catParam);
    document.querySelectorAll('.pill').forEach(p => {
      p.classList.toggle('active', p.dataset.cat === catParam);
    });
  }
  function registrarSinalVisto(idTermo) {
    let aprendidos = JSON.parse(localStorage.getItem('sinaisAprendidos') || '[]');
    if (!aprendidos.includes(idTermo)) {
      aprendidos.push(idTermo);
      localStorage.setItem('sinaisAprendidos', JSON.stringify(aprendidos));
    }
  }

  function renderList() {
    termsList.innerHTML = '';
    termsCounter.innerText = `${dadosFiltrados.length} TERMOS`;

    dadosFiltrados.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = `term-item ${idx === termoAtualIndex ? 'active' : ''}`;
      el.innerHTML = `
        <div class="dot" style="background:${item.corCategoria}"></div>
        <div>
          <h4>${item.nome}</h4>
          <span>${item.categoria}</span>
        </div>
      `;

      el.addEventListener('click', () => {
        termoAtualIndex = idx;
        renderList();
        renderDetail();
      });

      termsList.appendChild(el);
    });
  }

  function renderDetail() {
    const termo = dadosFiltrados[termoAtualIndex];
    if (!termo) {
      detailPanel.innerHTML = '<div class="card"><p>Nenhum termo encontrado para este filtro.</p></div>';
      return;
    }
    registrarSinalVisto(termo.id || termo.nome);

    detailPanel.innerHTML = `
      <div class="detail-header">
        <span style="font-size:0.8rem; text-transform:uppercase; letter-spacing:1px;">${termo.categoria}</span>
        <h1 style="font-size:1.8rem; margin-top:3px;">${termo.nome}</h1>
      </div>

      <div class="detail-body">
        <div class="detail-grid">
          <div>
            <span style="font-size:0.85rem; font-weight:700; display:block; margin-bottom:8px;">▶ Vídeo do Sinal</span>
            <div class="video-detail-box">
              <span style="font-size:2rem;">💻</span>
              <p style="margin-top:8px; font-size:0.85rem;">Sinal de: ${termo.nome}</p>
            </div>
          </div>

          <div>
            <div class="info-box">
              <h5>📖 Definição</h5>
              <p>${termo.definicao}</p>
            </div>

            <div class="info-box">
              <h5>🇧🇷 Exemplo em Português</h5>
              <p><em>"${termo.exemploPt}"</em></p>
            </div>

            <div class="info-box glosa">
              <h5>🤟 Exemplo em Libras</h5>
              <p><strong>${termo.exemploGlosa}</strong></p>
            </div>
          </div>
        </div>

        <div class="detail-footer-btns">
          <button class="btn-nav-sinal" id="btnPrev">← Anterior</button>
          <a href="quiz.html?categoria=${termo.categoriaId}" class="btn-praticar-quiz">🎯 Praticar Quiz de ${termo.categoria}</a>
          <button class="btn-nav-sinal" id="btnNextSinal">Próximo →</button>
        </div>
      </div>
    `;

    document.getElementById('btnPrev').addEventListener('click', () => {
      if (termoAtualIndex > 0) {
        termoAtualIndex--;
        renderList();
        renderDetail();
      }
    });

    document.getElementById('btnNextSinal').addEventListener('click', () => {
      if (termoAtualIndex < dadosFiltrados.length - 1) {
        termoAtualIndex++;
        renderList();
        renderDetail();
      }
    });
  }

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    dadosFiltrados = bancoDadosTI.filter(item => item.nome.toLowerCase().includes(val));
    termoAtualIndex = 0;
    renderList();
    renderDetail();
  });

  filterPills.addEventListener('click', (e) => {
    if (e.target.classList.contains('pill')) {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');

      const cat = e.target.dataset.cat;
      dadosFiltrados = cat === 'todos' ? [...bancoDadosTI] : bancoDadosTI.filter(item => item.categoriaId === cat);
      termoAtualIndex = 0;
      renderList();
      renderDetail();
    }
  });

  renderList();
  renderDetail();
});