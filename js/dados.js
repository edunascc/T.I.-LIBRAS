const bancoDadosTI = [
  {
    id: 'computador',
    nome: 'Computador',
    categoria: 'Hardware',
    categoriaId: 'hardware',
    corCategoria: '#7c3aed',
    definicao: 'Máquina eletrônica capaz de processar dados e executar programas por meio de instruções.',
    exemploPt: 'O computador é essencial para o trabalho moderno.',
    exemploGlosa: 'COMPUTADOR TRABALHO ESSENCIAL',
    fonte: 'Grupo de Pesquisa em Libras e TI - UFSC, 2023.',
    videoUrl: 'assets/img/videos/computador.png' // Substituir pelo caminho real do vídeo/imagem dps
  },
  {
    id: 'mouse',
    nome: 'Mouse',
    categoria: 'Hardware',
    categoriaId: 'hardware',
    corCategoria: '#7c3aed',
    definicao: 'Dispositivo apontador que permite interagir com elementos visuais da interface.',
    exemploPt: 'Use o mouse para clicar no botão.',
    exemploGlosa: 'MOUSE CLICAR BOTAO USAR',
    fonte: 'Dicionário LIBRAS Digital v3.0.',
    videoUrl: 'assets/img/videos/mouse.png'
  },
  {
    id: 'teclado',
    nome: 'Teclado',
    categoria: 'Hardware',
    categoriaId: 'hardware',
    corCategoria: '#7c3aed',
    definicao: 'Periférico de entrada de dados contendo teclas para digitação de textos e comandos.',
    exemploPt: 'Digite seu nome usando o teclado.',
    exemploGlosa: 'TECLADO SEU NOME DIGITAR',
    fonte: 'Dicionário LIBRAS Digital v3.0.',
    videoUrl: 'assets/img/videos/teclado.png'
  },
  {
    id: 'internet',
    nome: 'Internet',
    categoria: 'Redes',
    categoriaId: 'redes',
    corCategoria: '#10b981',
    definicao: 'Rede global de computadores interconectados que utilizam o protocolo IP/TCP.',
    exemploPt: 'A internet está rápida hoje.',
    exemploGlosa: 'INTERNET HOJE RAPIDO',
    fonte: 'UFSC 2023.',
    videoUrl: 'assets/img/videos/internet.png'
  },
  {
    id: 'software',
    nome: 'Software',
    categoria: 'Software',
    categoriaId: 'software',
    corCategoria: '#0284c7',
    definicao: 'Conjunto de instruções e dados que dizem ao computador como funcionar.',
    exemploPt: 'Instalei um novo software de edição.',
    exemploGlosa: 'SOFTWARE NOVO EDITAR INSTALAR',
    fonte: 'LIBRAS Digital v3.0.',
    videoUrl: 'assets/img/videos/software.png'
  },
  {
    id: 'loop',
    nome: 'Loop',
    categoria: 'Lógica',
    categoriaId: 'logica',
    corCategoria: '#f59e0b',
    definicao: 'Estrutura de repetição em um programa de computador.',
    exemploPt: 'O loop executa 10 vezes.',
    exemploGlosa: 'LOOP DEZ VEZES REPETIR',
    fonte: 'UFSC 2023.',
    videoUrl: 'assets/img/videos/loop.png'
  }
];

const categoriasTI = {
  hardware: { nome: 'Hardware', total: 10, progresso: 3, cor: '#7c3aed', bg: '#f3e8ff' },
  software: { nome: 'Software', total: 10, progresso: 7, cor: '#0284c7', bg: '#e0f2fe' },
  redes: { nome: 'Redes', total: 10, progresso: 1, cor: '#10b981', bg: '#d1fae5' },
  logica: { nome: 'Lógica de Programação', total: 10, progresso: 5, cor: '#d97706', bg: '#fef3c7' }
};