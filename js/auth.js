// js/auth.js
// Module to handle authentication and simple progress sync with Firestore
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const provider = new GoogleAuthProvider();

function $ (id){ return document.getElementById(id); }

async function createUserDocIfMissing(user, displayName){
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if(!snap.exists()){
    await setDoc(ref, {
      name: displayName || user.displayName || '',
      email: user.email || '',
      progress: { favorites: [], seen: [] },
      createdAt: new Date().toISOString()
    });
  }
}

async function mergeProgressToLocal(user){
  try{
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if(!snap.exists()) return;
    const data = snap.data();
    const progress = data.progress || { favorites: [], seen: [] };
    // merge favorites
    const localFavs = JSON.parse(localStorage.getItem('termosFavoritos') || '[]');
    const mergedFavs = Array.from(new Set([...(localFavs || []), ...(progress.favorites || [])]));
    localStorage.setItem('termosFavoritos', JSON.stringify(mergedFavs));
    // merge seen
    const localSeen = JSON.parse(localStorage.getItem('sinaisVistos') || '[]');
    const mergedSeen = Array.from(new Set([...(localSeen || []), ...(progress.seen || [])]));
    localStorage.setItem('sinaisVistos', JSON.stringify(mergedSeen));
  }catch(err){ console.error('mergeProgressToLocal', err); }
}

async function saveProgressFromLocalToFirestore(user){
  try{
    const favs = JSON.parse(localStorage.getItem('termosFavoritos') || '[]');
    const seen = JSON.parse(localStorage.getItem('sinaisVistos') || '[]');
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, { progress: { favorites: favs, seen: seen } }, { merge: true });
  }catch(err){ console.error('saveProgressFromLocalToFirestore', err); }
}

// Auth state management
let authReady = false;
let currentUser = null;

onAuthStateChanged(auth, async (user) =>{
  authReady = true;
  if(user){
    currentUser = { uid: user.uid, email: user.email, name: user.displayName };
    // ensure user doc exists and merge progress
    await createUserDocIfMissing(user);
    await mergeProgressToLocal(user);
  } else {
    currentUser = null;
  }
  // dispatch global event so other scripts (guard) can react
  window.currentUser = currentUser;
  window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user: currentUser } }));
});

// Expose some functions to global scope for use in login/register pages
window.Auth = {
  isLoggedIn: () => !!currentUser,
  getUser: () => currentUser,
  registerWithEmail: async (name,email,pass) =>{
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    try { await updateProfile(cred.user, { displayName: name }); }catch(e){}
    await createUserDocIfMissing(cred.user, name);
    await mergeProgressToLocal(cred.user);
    return { uid: cred.user.uid, email: cred.user.email, name };
  },
  loginWithEmail: async (email,pass) =>{
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await mergeProgressToLocal(cred.user);
    return { uid: cred.user.uid, email: cred.user.email, name: cred.user.displayName };
  },
  loginWithGoogle: async () =>{
    const cred = await signInWithPopup(auth, provider);
    await createUserDocIfMissing(cred.user);
    await mergeProgressToLocal(cred.user);
    return { uid: cred.user.uid, email: cred.user.email, name: cred.user.displayName };
  },
  saveProgress: async ()=>{
    const user = auth.currentUser;
    if(user) await saveProgressFromLocalToFirestore(user);
  }
};

// attach to forms if present
document.addEventListener('DOMContentLoaded', ()=>{
  const regForm = $('registerForm');
  if(regForm){
    regForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = $('regName').value.trim();
      const email = $('regEmail').value.trim();
      const pass = $('regPass').value;
      const fb = $('registerFeedback'); if(fb) fb.textContent='';
      try{
        await window.Auth.registerWithEmail(name,email,pass);
        if(fb) { fb.style.color = '#059669'; fb.textContent = 'Conta criada com sucesso. Redirecionando...'; }
        setTimeout(()=> location.href = 'index.html', 900);
      }catch(err){ if(fb){ fb.style.color='#ef4444'; fb.textContent = err.message || 'Erro'; } }
    });
  }

  const loginForm = $('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const email = $('loginEmail').value.trim();
      const pass = $('loginPass').value;
      const fb = $('loginFeedback'); if(fb) fb.textContent='';
      try{
        await window.Auth.loginWithEmail(email,pass);
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next');
        location.href = next ? decodeURIComponent(next) : 'index.html';
      }catch(err){ if(fb){ fb.style.color='#ef4444'; fb.textContent = err.message || 'Erro'; } }
    });

    const btnGoogle = $('btnGoogle');
    if(btnGoogle){
      btnGoogle.addEventListener('click', async ()=>{
        const fb = $('loginFeedback'); if(fb) fb.textContent='';
        try{ await window.Auth.loginWithGoogle(); location.href = 'index.html'; }
        catch(err){ if(fb){ fb.style.color='#ef4444'; fb.textContent = err.message || 'Erro no login'; } }
      });
    }

    const btnGoogleReg = $('btnGoogleReg');
    if(btnGoogleReg){
      btnGoogleReg.addEventListener('click', async ()=>{
        const fb = $('registerFeedback'); if(fb) fb.textContent='';
        try{ await window.Auth.loginWithGoogle(); location.href = 'index.html'; }
        catch(err){ if(fb){ fb.style.color='#ef4444'; fb.textContent = err.message || 'Erro no login'; } }
      });
    }
  }

  // periodic auto-save of progress when user is logged
  setInterval(async ()=>{
    if(auth.currentUser){
      try{ await window.Auth.saveProgress(); }catch(e){}
    }
  }, 10000); // a cada 10s
});
