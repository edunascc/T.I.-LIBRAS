document.addEventListener('DOMContentLoaded', () => {
  const metaTotalQuestoes = 40;
  const metaTotalQuizzes = 10;
  const metaQuestoesPorCategoria = 10;

  const totalQuestoesFeitas = parseInt(localStorage.getItem('totalQuestoesFeitas') || '0', 10);
  const quizzesConcluidos = JSON.parse(localStorage.getItem('quizzesConcluidos') || '[]');
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