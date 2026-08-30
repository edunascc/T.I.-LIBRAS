document.addEventListener('DOMContentLoaded', () => {
  const metaTotalQuestoes = 63;
  const metaTotalQuizzes = 6;
  const metaQuestoesPorCategoria = 10;

  // Publica os totais para o card SEU PROGRESSO da página inicial
  localStorage.setItem('totalQuizzes', metaTotalQuizzes.toString());
  localStorage.setItem('totalQuestoes', metaTotalQuestoes.toString());

  const totalQuestoesFeitas = parseInt(localStorage.getItem('totalQuestoesFeitas') || '0', 10);
  const quizzesConcluidos = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
  const statsQuestoes = JSON.parse(localStorage.getItem('statsQuestoes') || '{}');

  const lblTotalQuestoes = document.getElementById('lblTotalQuestoes');
  const lblTotalQuizzes = document.getElementById('lblTotalQuizzes');
  const barProgressoGeral = document.getElementById('barProgressoGeral');

  if (lblTotalQuestoes) lblTotalQuestoes.innerText = `${totalQuestoesFeitas}/${metaTotalQuestoes}`;
  if (lblTotalQuizzes) lblTotalQuizzes.innerText = `${quizzesConcluidos.length}/${metaTotalQuizzes}`;

  const pctGeral = Math.min(Math.round((totalQuestoesFeitas / metaTotalQuestoes) * 100), 100);
  if (barProgressoGeral) barProgressoGeral.style.width = `${pctGeral}%`;

  const categorias = ['hardware', 'software', 'redes'];

  categorias.forEach(cat => {
    const elCount = document.getElementById(`count-${cat}`);
    if (elCount) {
      const qtdFeita = statsQuestoes[cat] || 0;
      elCount.innerText = `${qtdFeita}/${metaQuestoesPorCategoria} questões feitas`;
    }
  });
});