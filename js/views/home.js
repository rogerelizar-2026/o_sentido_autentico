/* AutenticSense — View: Início
   Reorientada conforme o mapa mental "O Sentido Autêntico":
   línguas → rota → ferramentas → estante → guia exegético. */

import { icon } from '../icons.js';

const MODULES = [
  {
    href: '#/rota', cls: 'module--portal', icone: '5×',
    title: 'Rota de Crescimento',
    text: 'Do alefato à fluência em 5 níveis: 60 minutos por dia, repetição espaçada (Anki) e aceleração com inteligência artificial — custo R$ 0.',
    link: 'Começar a jornada',
    icon: 'compass'
  },
  {
    href: '#/hebraico', cls: 'module--hebrew', icone: 'א',
    title: 'Hebraico Bíblico',
    text: 'A língua da maior parte do Antigo Testamento: o Aleph-Bet, as vogais (niqud) e leitura guiada de Gênesis 1.1.',
    link: 'Começar pelo Aleph-Bet'
  },
  {
    href: '#/aramaico', cls: 'module--aramaic', icone: 'מ',
    title: 'Aramaico Bíblico',
    text: 'A língua de Daniel e Esdras — e das palavras originais de Jesus. Entenda onde o aramaico aparece e por que ele importa.',
    link: 'Explorar o aramaico'
  },
  {
    href: '#/grego', cls: 'module--greek', icone: 'Α',
    title: 'Grego Koiné',
    text: 'A língua do Novo Testamento e da Septuaginta: alfabeto, sinais, casos e a análise palavra a palavra de João 1.1.',
    link: 'Aprender o alfabeto grego'
  },
  {
    href: '#/ferramentas', cls: 'module--portal', icone: '⚒',
    title: 'Ferramentas Interativas',
    text: 'Analisador interlinear e transliteradores de hebraico e grego — o parsing diário da sua rota, 100% offline.',
    link: 'Abrir as ferramentas',
    icon: 'tools'
  },
  {
    href: '#/biblioteca', cls: 'module--portal', icone: '§',
    title: 'Livros de Referência',
    text: 'A estante curada: Ross (Hebraico), Rega & Bergmann, Mounce e Wallace (Grego), Pinto, Carson e Zuck (Exegese).',
    link: 'Ver a estante',
    icon: 'book'
  },
  {
    href: '#/exegese', cls: 'module--portal', icone: '✦',
    title: 'Guia de Exegese',
    text: 'O método integrado em sete passos — da observação do texto original à aplicação — para interpretar com profundidade.',
    link: 'Conhecer o método',
    icon: 'sparkle'
  }
];

const WHY = [
  { icon: 'book', title: 'A tradução é uma ponte', text: 'Toda tradução é também uma interpretação. Conhecer os originais encurta a distância entre você e o texto sagrado — e revela os detalhes que as versões precisam escolher.' },
  { icon: 'compass', title: 'Consistência vence intensidade', text: 'A regra dos 30–60 minutos diários com repetição espaçada constrói vocabulário permanente. A Rota de Crescimento organiza tudo em 5 níveis claros.' },
  { icon: 'sparkle', title: 'Profundidade com método', text: 'Morfologia, sintaxe e teologia caminham juntas: o ciclo traduzir → parsing → consultar sintaxe transforma leitura em exegese madura.' }
];

const FAQ = [
  {
    q: 'Preciso conhecer línguas antigas para usar o portal?',
    a: 'Não. O conteúdo é progressivo: comece pela Rota de Crescimento (Nível 1 — Fundação), passe para os alfabetos e avance até a análise interlinear. Cada termo técnico é explicado em português claro no primeiro uso.'
  },
  {
    q: 'O Sentido Autêntico funciona sem internet?',
    a: 'Sim. É um PWA (aplicativo web progressivo) offline-first: após a primeira visita, todas as páginas, fontes tipográficas e ferramentas ficam armazenadas no seu dispositivo, e você pode instalá-lo como aplicativo.'
  },
  {
    q: 'Quais livros devo usar junto com o portal?',
    a: 'A trilha oficial recomenda Ross para o Hebraico; Rega & Bergmann e Mounce para a morfologia do Grego; Wallace para a sintaxe exegética; e Pinto, Carson e Zuck para exegese e hermenêutica. Veja a seção Livros de Referência com foco e nível de cada obra.'
  },
  {
    q: 'Quais textos originais servem de base aos exemplos?',
    a: 'Para o Antigo Testamento, a tradição massorética (edições BHS (Biblia Hebraica Stuttgartensia)/BHQ (Biblia Hebraica Quinta)); para o Novo Testamento, o texto crítico grego (NA28 (Nestle-Aland, 28.ª edição)/UBS5 (United Bible Societies, 5.ª edição)). As glosas e notas pedagógicas são produzidas em português pelo projeto.'
  }
];

export default {
  title: 'Início',
  desc: 'Portal educacional offline de línguas bíblicas — Hebraico, Aramaico e Grego Koiné — com rota de crescimento, ferramentas interlineares, livros de referência e exegese integrada.',

  render() {
    const modules = MODULES.map((m) => `
      <a class="card ${m.cls}" href="${m.href}">
        <span class="card-icon" aria-hidden="true">${m.icon ? icon(m.icon) : m.icone}</span>
        <h3>${m.title}</h3>
        <p>${m.text}</p>
        <span class="card-link">${m.link}</span>
      </a>`).join('');

    const why = WHY.map((w) => `
      <div class="card">
        <span class="card-icon" aria-hidden="true">${icon(w.icon)}</span>
        <h3>${w.title}</h3>
        <p>${w.text}</p>
      </div>`).join('');

    const faq = FAQ.map((f) => `
      <details>
        <summary>${f.q}</summary>
        <p>${f.a}</p>
      </details>`).join('');

    return `
    <div class="container">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-inner">
          <p class="eyebrow">Portal educacional · Línguas bíblicas · 100% offline</p>
          <h1 id="hero-title">Redescubra o <span class="accent">sentido autêntico</span> do texto bíblico</h1>
          <p class="lede">
            Um roteiro definido — do primeiro contato com o alefato à exegese — para
            estudar as Escrituras nas línguas originais: <strong>Hebraico</strong>,
            <strong>Aramaico</strong> e <strong>Grego Koiné</strong>. Com metodologia,
            ferramentas e a estante certa, gratuito e direto no navegador.
          </p>
          <p class="hero-convite">
            Iniciar o estudo das línguas bíblicas originais é dar um passo decisivo em
            direção ao conhecimento de Deus nas Escrituras. Essa caminhada repleta de
            descobertas e de desafios práticos transformará não apenas sua compreensão do
            texto sagrado, mas também a forma como você enxerga a vida e como viver melhor
            através dela.
          </p>
          <div class="hero-actions">
            <a class="btn btn-gold" href="#/rota">${icon('compass')} Iniciar a Rota de Crescimento</a>
            <a class="btn btn-outline" href="#/ferramentas">${icon('tools')} Experimentar as ferramentas</a>
          </div>
          <div class="hero-script" aria-label="Amostras das escritas originais">
            <span><span class="hebrew" lang="he" dir="rtl">בְּרֵאשִׁית</span> hebraico</span>
            <span><span class="aramaic" lang="arc" dir="rtl">מְנֵא</span> aramaico</span>
            <span><span class="greek" lang="grc">λόγος</span> grego koiné</span>
          </div>
        </div>
        <div class="stat-strip" role="list" aria-label="Números do portal">
          <div class="stat" role="listitem"><b>3</b><span>línguas originais</span></div>
          <div class="stat" role="listitem"><b>5</b><span>níveis até a fluência</span></div>
          <div class="stat" role="listitem"><b>8</b><span>obras de referência mapeadas</span></div>
          <div class="stat" role="listitem"><b>100%</b><span>offline e privado</span></div>
        </div>
      </section>

      <section class="section" aria-labelledby="antes-comecar">
        <div class="callout callout--alerta">
          <span class="callout-title" id="antes-comecar">Antes de começar: o lugar das línguas originais</span>
          <p>Dentro do processo de estudo de um texto antigo, a análise léxico-sintática
          (estudo das línguas originais) é um dos passos de grande valor. Entretanto este
          valor perde sua validade se não for acompanhado dos demais passos do processo
          para a compreensão exata da mensagem transmitida. Há o sério risco de
          interpretações erradas se desconsiderar a importância do contexto
          histórico-cultural da época do escrito, do contexto do livro, das figuras de
          linguagem, aspectos semânticos e outros passos regidos pela disciplina chamada
          Hermenêutica.</p>
          <p>A boa prática do estudante honesto, que deseja ver a verdade do texto, deve
          ser a de considerar e anotar sua descoberta como provisória até que junte todas
          as “peças”.</p>
          <p class="callout-remate">Interpretar é a coisa mais fácil do mundo quando não se
          deseja saber a real mensagem transmitida!</p>
        </div>
      </section>

      <section class="section" aria-labelledby="modulos">
        <p class="section-kicker">O mapa completo</p>
        <h2 class="section-title" id="modulos">Escolha por onde começar</h2>
        <p class="section-sub">O portal espelha a anatomia do estudo bíblico profundo: fundação das línguas, rota metódica, ferramentas diárias, estante de referência e guia exegético.</p>
        <div class="grid" style="margin-top:1.4rem">${modules}</div>
      </section>

      <section class="section" aria-labelledby="ecossistema">
        <p class="section-kicker">Visão panorâmica</p>
        <h2 class="section-title" id="ecossistema">O ecossistema em uma imagem</h2>
        <p class="section-sub">Tudo o que o método integra — rota em 3 passos, obras por nível, ciclo de integração diária e inteligência artificial como co-mentora.</p>
        <figure class="info-figure" style="max-width:62rem">
          <img src="assets/img/info/ecossist.jpg" loading="lazy" decoding="async"
               alt="Infográfico do ecossistema O Sentido Autêntico: rota de crescimento em 3 passos, tabela de obras de referência (Ross, Rega e Bergmann, Mounce e Wallace) por foco e nível, diversidade metodológica da morfologia à sintaxe, ciclo de integração diária, ecossistema digital e inteligência artificial como co-mentora.">
          <figcaption>O Sentido Autêntico — diversidade metodológica da morfologia à sintaxe, com progressão integrada em 5 níveis.</figcaption>
        </figure>
      </section>

      <section class="section" aria-labelledby="porque">
        <p class="section-kicker">Fundamentos</p>
        <h2 class="section-title" id="porque">Por que este método funciona?</h2>
        <div class="grid" style="margin-top:1.4rem">${why}</div>
      </section>

      <section class="section" aria-labelledby="faq">
        <p class="section-kicker">Perguntas frequentes</p>
        <h2 class="section-title" id="faq">Tudo o que você precisa saber</h2>
        <div style="margin-top:1.4rem;max-width:52rem">${faq}</div>
      </section>

      <blockquote class="quote-band">
        “Interpretar é fácil quando não se busca a real mensagem.”
        <footer>O sentido da interpretação — quando a hermenêutica acompanha as línguas originais: contexto histórico, cultural e figuras de linguagem.</footer>
      </blockquote>

      <aside class="cta-band" aria-labelledby="cta-title">
        <h2 id="cta-title">Instale e estude onde estiver</h2>
        <p>Adicione o Sentido Autêntico à tela inicial do seu celular ou computador e tenha as línguas bíblicas sempre à mão — no avião ou nos estudos como os amigos na igreja. Sem internet, sem anúncios, sem cadastro.</p>
        <a class="btn btn-gold" href="#/sobre">${icon('download')} Como instalar</a>
      </aside>
    </div>`;
  }
};
