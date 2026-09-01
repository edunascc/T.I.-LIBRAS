class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="header">
        <a href="index.html" class="logo">
          <img src="img/logo.jpg" alt="T.I. Libras Logo" class="brand-logo">
          <span class="logo-text">T.I Libras</span>
        </a>
        <nav class="nav-links">
          <a href="praticar.html" id="nav-praticar">Praticar</a>
          <a href="sinalario.html" id="nav-sinalario">Sinalário</a>
        </nav>
        <div class="header-actions">
          <a href="index.html?auth=login" class="auth-btn auth-login" id="headerLogin">Entrar</a>
          <a href="index.html?auth=register" class="auth-btn auth-register" id="headerRegister">Cadastrar</a>
          <button class="icon-btn" title="Configurações"><i class="fa-solid fa-gear"></i></button>
        </div>
      </header>
    `;

    const path = window.location.pathname;
    if (path.includes('praticar.html')) {
      this.querySelector('#nav-praticar')?.classList.add('active');
    } else if (path.includes('sinalario.html')) {
      this.querySelector('#nav-sinalario')?.classList.add('active');
    }

    const applyAuth = () => {
      const logged = !!(window.currentUser && window.currentUser.uid);
      const praticar = this.querySelector('#nav-praticar');
      const sinalario = this.querySelector('#nav-sinalario');
      const login = this.querySelector('#headerLogin');
      const register = this.querySelector('#headerRegister');
      const nav = this.querySelector('.nav-links');
      if (praticar) praticar.style.display = logged ? '' : 'none';
      if (sinalario) sinalario.style.display = logged ? '' : 'none';
      if (nav) nav.style.display = logged ? '' : 'none';
      if (login) login.style.display = logged ? 'none' : '';
      if (register) register.style.display = logged ? 'none' : '';
    };

    applyAuth();
    window.addEventListener('auth-changed', applyAuth);
  }
}

class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <div class="footer-top">
          <div class="footer-brand">
            <img src="img/logo.jpg" alt="T.I. Libras" class="brand-logo">
            <div class="footer-brand-text">
              <strong>T.I Libras</strong>
              <span>Tecnologia acessível em Libras</span>
            </div>
          </div>
          <div class="footer-social">
            <a href="https://github.com/edunascc/T.I.-LIBRAS" target="_blank" rel="noopener noreferrer" class="social-round github" aria-label="GitHub" title="GitHub">
              <i class="fa-brands fa-github"></i>
            </a>
            <a href="https://www.youtube.com/@t.i.libras" target="_blank" rel="noopener noreferrer" class="social-round youtube" aria-label="YouTube" title="YouTube">
              <i class="fa-brands fa-youtube"></i>
            </a>
          </div>
        </div>
        <div class="footer-links">
          <div class="footer-links-group">
            <a href="ficha-tecnica.html">Ficha Técnica</a>
            <a href="termos.html">Termos e Condições de Uso</a>
            <a href="mailto:ttilibras@gmail.com"><i class="fa-solid fa-envelope"></i> ttilibras@gmail.com</a>
          </div>
          <span class="footer-copy">© 2024 T.I. Libras. Todos os direitos reservados.</span>
        </div>
      </footer>
    `;
  }
}

customElements.define('app-header', AppHeader);
customElements.define('app-footer', AppFooter);