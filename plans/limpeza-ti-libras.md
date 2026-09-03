# Plano de Limpeza — T.I. Libras

Refatorar o projeto para remover a "cara de IA" do código e do visual, mantendo o
site funcionando como está hoje. Execução será feita no modo Code.

## Diagnóstico principal

Existem **duas gerações** de código convivendo no projeto:

1. **Geração ativa** (renderizada de verdade):
   - `index.html` (landing + modal de login) → `css/style.css`, `css/inicio.css`, `css/auth.css`, `js/components.js`, `js/dados.js`, `js/auth.js`, `js/firebase-config.js`, `js/auth-guard.js`, VLibras.
   - `sinalario.html` → leva quase todo o CSS e o JS **inline** dentro de `<style>`/`<script>` (a fonte real do layout de 3 colunas), mais `js/components.js`, `js/dados.js` (`bancoSinalario`) e a API do YouTube.
   - `praticar.html` → HTML **quebrado** (tag `</head>` e `<body>` soltas no meio do arquivo), quase todo CSS/JS inline com muitos `!important`, e linka `css/sinalario.css` em vez de `css/praticar.css`.
   - `quiz.html` → `css/quiz.css` + `js/quizes.js` + `js/dados.js` (dados.js é redundante aqui).
   - `login.html` / `register.html` → `css/auth.css` + `js/auth.js`.

2. **Geração morta / órfã** (não é carregada por página nenhuma):
   - `css/landing.css` (classes `.l-hero`, `.l-feature`... que não existem no HTML).
   - `js/script.js` (carregava header/footer por fetch de `components/*.html`).
   - `components/header.html` e `components/footer.html` (só usados pelo script morto).
   - Trechos do `css/sinalario.css` atual (layout antigo com `.search-card`, `.pill`, `.info-card`, e overrides de `.header`/`.nav-links`) que são sobrescritos pelo `<style>` inline real de `sinalario.html`.
   - Overrides mortos dentro do `<style>` de `praticar.html` (`.header-fix`, `.header-grid`, `.nav-pill`, `.action-btn`, `.brand-icon`, `.brand-text`) que miram um header antigo que **não** é mais gerado pelo web component.
   - `bancoDadosTI` + `categoriasTI` dentro de `js/dados.js` (usados só por arquivos mortos).
   - `js/inicio.js`, `js/praticar.js`, `js/sinalario.js` atuais: apontam para IDs de DOM que não existem e **não** são carregados. Serão **reaproveitados** para receber o código inline extraído.

## Decisões (aprovadas/assumidas)

- Apagar os órfãos: `css/landing.css`, `js/script.js`, `components/header.html`, `components/footer.html`.
- `css/sinalario.css`, `css/praticar.css`, `js/sinalario.js`, `js/praticar.js` serão **sobrescritos** com o CSS/JS inline limpo e extraído de cada página (reaproveitando os nomes existentes).
- `js/inicio.js` será **reaproveitado** para hospedar a lógica do modal de autenticação da homepage (consistente com `css/inicio.css`), já que o conteúdo antigo é morto.
- `js/dados.js` ficará só com `bancoSinalario` (usado por `sinalario.html`); remover `bancoDadosTI`/`categoriasTI`. Remover o `<script src="js/dados.js">` de `index.html` e de `quiz.html` (desnecessários).
- Inline de JS que não é de comportamento (o glue do VLibras, presente em `index`, `sinalario`, `praticar`) vai para um arquivo compartilhado novo `js/vlibras.js` para separar estritamente as linguagens.
- O canto do projeto vira um layout **full-width**: containers ocupando ~toda a largura, com `max-width: 1400px` + `padding lateral 16–24px`, sem margens laterais grandes.
- Manter a identidade visual (roxo/índigo) mas com cara "humana": fundo neutro `#f8fafc`, cards brancos com borda fina `1px #e2e8f0`, botões sólidos (sem gradiente pesado e sem sombra marcada), cantos `4–6px`.
- Manter **intactos** (contratos entre arquivos — mexer quebraria o funcionamento):
  - `class` e `id` dos elementos HTML (mantidos em inglês padrão).
  - Chaves de `localStorage`: `termosFavoritos`, `sinaisVistos`, `completedQuizzes`, `quizzesConcluidos`, `totalQuizzes`, `totalQuestoes`, `statsQuestoes`, `totalQuestoesFeitas`, `sinaisAprendidos`.
  - API pública `window.Auth.*` e o hook obrigatório da API do YouTube `onYouTubeIframeAPIReady` (nome exigido pelo player).
  - Nomes das propriedades dos dados (`term`, `cat`, `def`, `exPt`, `exGlosa`, `source`, `link`, `youtubeId`, `id`, `nome`, `corCategoria`...) — tratados como "esquema de dados" (idioma universal).
- **Traduzir para português** funções e variáveis lógicas do JS (regra do usuário), de forma coordenada em todos os arquivos e nos `onclick` do HTML. Ex.: `openModal → abrirModal`, `userData → dadosUsuario`.

## Diretório de tradução de nomes (usar de forma consistente)

| Sinalário (inline → `js/sinalario.js`) | tradução |
| --- | --- |
| `extractVideoId` | `extrairIdDoVideo` |
| `resetWatch` | `reiniciarVisto` |
| `tryMarkSeen` | `marcarComoVisto` |
| `loadVideo` | `carregarVideo` |
| `getFavoritos` | `obterFavoritos` |
| `filterData` | `filtrarDados` |
| `renderList` | `renderizarLista` |
| `renderCurrentTerm` | `exibirTermoAtual` |
| `selectedCategory` | `categoriaSelecionada` |
| `searchQuery` | `busca` |
| `currentTerm` | `termoAtual` |
| `dotMap` | `mapaDePontos` |
| `catColors` | `coresDasAreas` |
| `watch`, `watchTimer`, `ytPlayer`, `ytReady`, `pendingVideoId` | `visto`, `timerDeVisto`, `playerYt`, `ytPronto`, `videoIdPendente` |
| `onYouTubeIframeAPIReady` | **manter** (nome exigido pela API) |

| Praticar (inline → `js/praticar.js`) | tradução |
| --- | --- |
| `scrollCarousel` | `rolarCarrossel` |
| `updateCarouselState` | `atualizarEstadoDoCarrossel` |
| `startQuiz` | `iniciarQuiz` |
| `backToSelection` | `voltarParaSelecao` |
| `loadQuestion` | `carregarPergunta` |
| `checkAnswer` | `verificarResposta` |
| `startTimer` / `updateTimerDisplay` | `iniciarCronometro` / `atualizarCronometro` |
| `handleError` | `lidarComErro` |
| `getFallbackImage` | `obterImagemPadrao` |
| `updateProgressDisplay` | `atualizarProgresso` |
| `allQuestions` | `todasAsPerguntas` |
| `currentCategory` / `activeQuestions` / `currentQ` / `timeLeft` | `categoriaAtual` / `perguntasAtivas` / `perguntaAtual` / `tempoRestante` |
| + `onclick` no HTML | atualizar referências |

| Componentes / Auth / Guard | tradução |
| --- | --- |
| `AppHeader`/`AppFooter` (classes JS de web component) | manter (tag `app-header`/`app-footer` e `connectedCallback` são contratos de Web Component) |
| `auth.js`: `createUserDocIfMissing`, `mergeProgressToLocal`, `saveProgressFromLocalToFirestore` | `criarDocSeFaltar`, `mesclarProgressoLocal`, `salvarProgressoNoFirestore` |
| `window.Auth.*`, `$()` | `window.Auth.*` manter; `$()` → `porId()` |
| `auth-guard.js`: `lockElement`, `unlockElement`, `ensureGuard`, `redirectToLogin`, `checkAuthAndApply` | `travarElemento`, `destravarElemento`, `aplicarGuarda`, `redirecionarParaLogin`, `verificarEAplicar` |
| `components.js`: variáveis internas | traduzir (ex.: `applyAuth → aplicarEstadoDeLogin`, `logged → estaLogado`) |

## Design tokens finais (aplicar em todos os `.css`)

- Fonte: **Plus Jakarta Sans** (`400;500;600;700;800`) — importar 1x no topo de `css/style.css`.
- `--cor-primaria: #7c3aed`, `--cor-primaria-2: #4f46e5`, `--cor-fundo: #f8fafc`,
  `--cor-texto: #0f172a`, `--cor-texto-suave: #64748b`.
- `--raio: 6px`, `--raio-pequeno: 4px` (botões, inputs, cards, chips ≤ 6px).
- `--borda: 1px solid #e2e8f0`.
- `--sombra-suave: 0 2px 4px rgba(0,0,0,0.05)` (opcional; preferir borda fina).
- `--transicao: all 0.2s ease`.
- **Proibido** `!important`, sombras pretas/borradas `rgba(0,0,0,0.4+)`, `border-radius` em "pílula" (999px) em botões/inputs/cards, `transform`/`box-shadow` em hover, animações flutuantes/`@keyframes` de entrada, `backdrop-filter: blur`.
- Full-width: `.container`/seções → `width:100%`, `max-width:1400px`, `margin:0 auto`, `padding: 0 clamp(16px,3vw,24px)`.

## Ordem de execução (visão)

1. Backup/confirmação de baseline (git) antes de editar.
2. `css/style.css` (base: fonte, tokens, header/footer dos web components, botões, container, reset).
3. Homepage: `index.html` + `css/inicio.css` + `css/auth.css` (parte de modal) + novo `js/inicio.js`.
4. Páginas de autenticação: `login.html`/`register.html` + limpeza de `css/auth.css` e remoção de `style=` inline.
5. Sinalário: extrair inline → `css/sinalario.css` + `js/sinalario.js`; limpar/atualizar `sinalario.html`.
6. Praticar: corrigir HTML quebrado, linkar `css/praticar.css` e `js/praticar.js`, extrair inline limpo.
7. Quiz: limpar `quiz.html` + `css/quiz.css` + `js/quizes.js`.
8. Criar `js/vlibras.js` e remover os blocos inline de VLibras das 3 páginas.
9. Apagar órfãos (`css/landing.css`, `js/script.js`, `components/header.html`, `components/footer.html`) e limpar `js/dados.js`.
10. Passada global de verificação (sem `!important`, sem referências a arquivos deletados, HTML bem formado, páginas abrem sem erro no console).

> Observação: `quiz.html` não aparece no menu/navegação atual (nenhum link leva a ele) e
> parece ser uma página de quiz mais antiga/demonstração. Será mantida e limpa; se o
> dono preferir, pode ser removida também — decisão registrada para revisão.
