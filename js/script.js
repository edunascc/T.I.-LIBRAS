async function loadComponents() {
  const headerEl = document.getElementById('header-container');
  const footerEl = document.getElementById('footer-container');

  // Função auxiliar para carregar componente via fetch ou fallback de requisição
  async function fetchComponent(url) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.text();
    } catch (e) {
      // Se falhar pelo protocolo file:// (abrir direto no navegador), usa XMLHttpRequest local
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => resolve('');
        xhr.open('GET', url, true);
        xhr.send();
      });
    }
    return '';
  }

  // Carrega o Header
  if (headerEl) {
    const headerHtml = await fetchComponent('components/header.html');
    if (headerHtml) {
      headerEl.innerHTML = headerHtml;

      // Ativa o botão da página atual
      const path = window.location.pathname;
      if (path.includes('praticar.html')) {
        document.getElementById('nav-praticar')?.classList.add('active');
      } else if (path.includes('sinalario.html')) {
        document.getElementById('nav-sinalario')?.classList.add('active');
      } else {
        document.getElementById('nav-inicio')?.classList.add('active');
      }
    }
  }

  // Carrega o Footer
  if (footerEl) {
    const footerHtml = await fetchComponent('components/footer.html');
    if (footerHtml) {
      footerEl.innerHTML = footerHtml;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadComponents);
} else {
  loadComponents();
}