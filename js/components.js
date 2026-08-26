// COMPONENTE DO HEADER (CABEÇALHO)
class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="header">
        <a href="index.html" class="logo">
          <img src="img/logo.jpg" alt="T.I. Libras Logo" class="brand-logo">
          T.I Libras
        </a>
        <nav class="nav-links">
          <a href="index.html" id="nav-inicio">Início</a>
          <a href="praticar.html" id="nav-praticar">Praticar</a>
          <a href="sinalario.html" id="nav-sinalario">Sinalário</a>
        </nav>
        <div class="header-actions">
          <button class="icon-btn" title="Acessibilidade"><i class="fa-solid fa-universal-access"></i></button>
          <button class="icon-btn" title="Perfil"><i class="fa-solid fa-user"></i></button>
        </div>
      </header>
    `;

    // Destaca o menu da página atual
    const path = window.location.pathname;
    if (path.includes('praticar.html')) {
      this.querySelector('#nav-praticar')?.classList.add('active');
    } else if (path.includes('sinalario.html')) {
      this.querySelector('#nav-sinalario')?.classList.add('active');
    } else {
      this.querySelector('#nav-inicio')?.classList.add('active');
    }
  }
}

// COMPONENTE DO FOOTER (RODAPÉ)
class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <div class="container footer-wrapper">
          <!-- Lado Esquerdo -->
          <div class="footer-links-left">
            <a href="ficha-tecnica.html" class="pill-link">Ficha Técnica</a>
            <a href="termos.html" class="pill-link">Termos e Condições de Uso</a>
          </div>

          <!-- Lado Direito -->
          <div class="footer-social-right">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="social-btn github-btn">
              <i class="fa-brands fa-github"></i> GitHub
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="social-btn youtube-btn">
              <i class="fa-brands fa-youtube"></i> YouTube
            </a>
          </div>
        </div>
      </footer>
    `;
  }
}

// Registra as novas tags HTML customizadas
customElements.define('app-header', AppHeader);
customElements.define('app-footer', AppFooter);