document.addEventListener('DOMContentLoaded', () => {
  const totalSinais = 60;
  const totalQuizzes = 40;

  const sinaisAprendidos = JSON.parse(localStorage.getItem('sinaisAprendidos') || '[]');
  const quizzesFeitos = JSON.parse(localStorage.getItem('quizzesConcluidos') || '[]');

  const qtdSinais = sinaisAprendidos.length;
  const qtdQuizzes = quizzesFeitos.length;

  const pctSinais = Math.min(Math.round((qtdSinais / totalSinais) * 100), 100);
  const pctQuizzes = Math.min(Math.round((qtdQuizzes / totalQuizzes) * 100), 100);

  document.getElementById('lblSinais').innerText = `${qtdSinais}/${totalSinais}`;
  document.getElementById('barSinais').style.width = `${pctSinais}%`;

  document.getElementById('lblQuizzes').innerText = `${qtdQuizzes}/${totalQuizzes}`;
  document.getElementById('barQuizzes').style.width = `${pctQuizzes}%`;
});
