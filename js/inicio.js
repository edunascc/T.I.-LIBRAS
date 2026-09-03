// Lógica da página inicial: abrir e fechar o modal de login/cadastro.
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('authModal');
  const visaoLogin = document.getElementById('viewLogin');
  const visaoCadastro = document.getElementById('viewRegister');

  function abrirModal(visao) {
    if (!modal) return;
    visaoLogin.hidden = visao !== 'login';
    visaoCadastro.hidden = visao !== 'register';
    modal.hidden = false;
  }

  function fecharModal() {
    if (modal) modal.hidden = true;
  }

  // Botões da faixa principal e trocas dentro do modal
  document.getElementById('openLogin')?.addEventListener('click', () => abrirModal('login'));
  document.getElementById('openRegister')?.addEventListener('click', () => abrirModal('register'));
  document.getElementById('switchToRegister')?.addEventListener('click', () => abrirModal('register'));
  document.getElementById('switchToLogin')?.addEventListener('click', () => abrirModal('login'));

  // Botões do cabeçalho (gerados por js/components.js)
  document.getElementById('headerLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    abrirModal('login');
  });
  document.getElementById('headerRegister')?.addEventListener('click', (e) => {
    e.preventDefault();
    abrirModal('register');
  });

  document.getElementById('authClose')?.addEventListener('click', fecharModal);
  document.getElementById('authBackdrop')?.addEventListener('click', fecharModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModal();
  });

  // Abre a aba correta quando a URL pede (?auth=login|register ou ?next=...)
  const parametros = new URLSearchParams(window.location.search);
  if (parametros.get('auth') === 'register') abrirModal('register');
  else if (parametros.get('auth') === 'login' || parametros.get('next')) abrirModal('login');
});
