// js/auth-guard.js
// This script disables or overlays UI elements that require authentication when user is not logged in.
(function(){
  function lockElement(el){
    el.classList.add('locked');
    el.setAttribute('aria-disabled','true');
    // add lock icon overlay if not present
    if(!el.querySelector('.lock-badge')){
      const badge = document.createElement('span');
      badge.className = 'lock-badge';
      badge.innerHTML = '🔒';
      badge.style.marginLeft = '8px';
      el.appendChild(badge);
    }
  }

  function unlockElement(el){
    el.classList.remove('locked');
    el.removeAttribute('aria-disabled');
    const badge = el.querySelector('.lock-badge'); if(badge) badge.remove();
  }

  function ensureGuard(){
    const checkAuthAndApply = ()=>{
      const logged = window.Auth && window.Auth.isLoggedIn && window.Auth.isLoggedIn();
      // disable favorite buttons
      document.querySelectorAll('.favorite-btn, .btn-fav').forEach(btn=>{
        if(!logged){
          btn.classList.add('needs-auth');
          lockElement(btn);
          btn.addEventListener('click', redirectToLogin);
        } else {
          unlockElement(btn);
          btn.removeEventListener('click', redirectToLogin);
        }
      });
      // disable favorites link
      document.querySelectorAll('a.favorites-link, a[href*="favorites"], a[data-needs-auth="true"]').forEach(a=>{
        if(!logged){
          a.classList.add('needs-auth');
          a.addEventListener('click', redirectToLogin);
        } else {
          a.classList.remove('needs-auth');
          a.removeEventListener('click', redirectToLogin);
        }
      });
      // disable quizzes
      document.querySelectorAll('.quiz-button, .btn-quiz, [data-need-quiz]').forEach(el=>{
        if(!logged){ lockElement(el); el.addEventListener('click', redirectToLogin); }
        else { unlockElement(el); el.removeEventListener('click', redirectToLogin); }
      });
    };

    function redirectToLogin(e){
      e.preventDefault();
      // preserve intended path
      const dest = window.location.pathname + window.location.search;
      window.location.href = 'login.html?next=' + encodeURIComponent(dest);
    }

    // initial run
    checkAuthAndApply();
    // re-run when auth status changes
    window.addEventListener('auth-changed', ()=> setTimeout(checkAuthAndApply, 50));
    // also run on DOM changes (in case dynamic content loaded)
    const obs = new MutationObserver(()=> setTimeout(checkAuthAndApply, 200));
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureGuard);
  else ensureGuard();
})();
