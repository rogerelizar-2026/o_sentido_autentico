/* AutenticSense — View: Exegese Integrada */

import { icon } from '../icons.js';

const STEPS = [
  {
    t: 'Delimitação e observação do texto',
    d: 'Escolha a perícope (unidade literária) e leia-a várias vezes em boas traduções — depois no original. Pergunte: quem escreve, a quem, o quê, quando, onde, por quê e como. Nada de conclusões antes da observação.'
  },
  {
    t: 'Contexto histórico e cultural',
    d: 'Reconstrua o mundo do texto: geopolítica, costumes, economia e religião da época. Um “cinto de ouro”, um “circunciso” ou um “publicano” significam coisas precisas no primeiro século.'
  },
  {
    t: 'Contexto literário e gênero',
    d: 'Narrativa, poesia, profecia, carta e apocalipse obedecem a regras distintas. Leia o gênero certo do jeito certo, e situe o trecho no arco do livro e do cânone.'
  },
  {
    t: 'Análise lexical (o sentido das palavras)',
    d: 'Estudo de lexemas nos dicionários (BDB (léxico Brown-Driver-Briggs), HALOT (Hebrew and Aramaic Lexicon of the Old Testament), BDAG (léxico Bauer-Danker-Arndt-Gingrich)): campo semântico, frequência de uso e uso no próprio autor. Cuidado com a falácia etimológica — significado é uso, não é raiz “mágica”.'
  },
  {
    t: 'Análise sintática e estrutural',
    d: 'Relações de cláusulas, tempos verbais, partículas e arquiteturas literárias (paralelismo hebraico, quiasmos, inclusões). A sintaxe revela o que o autor quis enfatizar.'
  },
  {
    t: 'Síntese teológica e canônica',
    d: 'Como o texto conversa com o restante da Escritura? A analogia da fé — passagens claras iluminando as difíceis — mantém a interpretação dentro do testemunho conjunto da Bíblia.'
  },
  {
    t: 'Aplicação hermenêutica responsável',
    d: 'Do “o que significou” ao “o que significa”: atravesse a ponte com prudência, distinguindo princípios atemporais de expressões culturais, sempre com humildade e comunidade.'
  }
];

const PRINCIPLES = [
  { k: 'O texto tem a palavra final', d: 'A exegese serve ao texto — o oposto da eisegese, que o usa para confirmar ideias prévias.' },
  { k: 'Contexto acima de tudo', d: 'Nenhum versículo significa isolado o que não significaria dentro do seu parágrafo, livro e época.' },
  { k: 'O claro interpreta o obscuro', d: 'Doutrinas se constroem sobre passagens límpidas; enigmas pontuais não derrubam ensinos explícitos.' },
  { k: 'Sem anacronismo', d: 'Não leia conceitos modernos em categorias antigas: pergunte primeiro o que o autor podia querer dizer.' },
  { k: 'Humildade interpretativa', d: 'Intérpretes sérios divergem. Apresente o grau de certeza e ouça a tradição e a comunidade.' },
  { k: 'As línguas iluminam, não mandam sozinhas', d: 'Conhecer o grego/h e aramaico afina a leitura, mas não substitui contexto, lógica e vida de oração.' }
];

const GLOSSARY = [
  { t: 'Exegese', d: 'Do grego exēgeomai (“conduzir para fora”): extrair do texto o seu sentido original.' },
  { t: 'Eisegese', d: 'O oposto da exegese: “ler para dentro” do texto ideias que não estão ali. A principal falha interpretativa.' },
  { t: 'Hermenêutica', d: 'Os princípios e a teoria da interpretação; a exegese é a sua aplicação prática.' },
  { t: 'Perícope', d: 'Unidade literária completa delimitada para estudo (um parágrafo, um salmo, uma narrativa).' },
  { t: 'Lexema', d: 'A forma de dicionário de uma palavra; no hebraico, vinculada à raiz (shoresh) trilítera.' },
  { t: 'Texto Massorético', d: 'Tradição hebraica do AT (Antigo Testamento) fixada pelos masoretas (séc. VI–X d.C.), base das edições BHS (Biblia Hebraica Stuttgartensia)/BHQ (Biblia Hebraica Quinta).' },
  { t: 'Septuaginta (LXX)', d: 'Tradução grega do Antigo Testamento (séc. III–II a.C.); a Bíblia mais citada no NT (Novo Testamento).' },
  { t: 'Qerê / Ketiv', d: 'Notas masoréticas: o que se lê (qerê) vs. o que está escrito (ketiv) na linha do texto.' },
  { t: 'Targum', d: 'Traduções aramaicas sinagogais do Antigo Testamento, testemunhas de como os judeus liam seus textos.' },
  { t: 'Interlinear', d: 'Edição com o texto original e glosas alinhadas palavra a palavra — ponte entre tradução e original.' },
  { t: 'Quiasmo', d: 'Estrutura em espelho (A-B-B′-A′) comum na Bíblia hebraica; o centro costuma ser o ponto de ênfase.' }
];

export default {
  title: 'Exegese Integrada',
  desc: 'Método exegético em 7 passos — da observação do texto original à aplicação — com princípios hermenêuticos e glossário.',

  render() {
    const steps = STEPS.map((s) => `
      <li>
        <div>
          <h3>${s.t}</h3>
          <p>${s.d}</p>
        </div>
      </li>`).join('');

    const principles = PRINCIPLES.map((p) => `
      <li><span><strong>${p.k}.</strong> ${p.d}</span></li>`).join('');

    const glossary = GLOSSARY.map((g) => `
      <div class="g-term">
        <dt>${g.t}</dt>
        <dd>${g.d}</dd>
      </div>`).join('');

    return `
    <div class="container">
      <header class="page-head">
        <nav class="breadcrumb" aria-label="Trilha de navegação">
          <ol><li><a href="#/">Início</a></li><li aria-current="page">Exegese Integrada</li></ol>
        </nav>
        <span class="eyebrow">${icon('compass')} Método · Do original à aplicação</span>
        <h1>Exegese Integrada</h1>
        <p class="lede">
          Exegese é a arte e a ciência de <strong>deixar o texto falar</strong>. Este método
          integra línguas originais, contexto, literatura e teologia em sete passos que
          transformam o estudo bíblico de leitura apressada em escuta profunda.
        </p>
      </header>

      <div class="callout">
        <span class="callout-title">A regra de ouro</span>
        Observe antes de interpretar; interprete antes de aplicar; aplique antes de ensinar.
        Quem pula etapas quase sempre encontra no texto apenas o próprio eco.
      </div>

      <section class="section" aria-labelledby="metodo">
        <p class="section-kicker">O fluxo de trabalho</p>
        <h2 id="metodo">Sete passos do texto original ao coração</h2>
        <ol class="steps">${steps}</ol>
      </section>

      <section class="section" aria-labelledby="principios">
        <p class="section-kicker">Guarda-corpos</p>
        <h2 id="principios">Princípios hermenêuticos</h2>
        <ul class="check-list" style="margin-top:1.2rem">${principles}</ul>
      </section>

      <section class="section" aria-labelledby="glossario">
        <p class="section-kicker">Vocabulário técnico</p>
        <h2 id="glossario">Glossário do exegeta</h2>
        <dl class="glossary">${glossary}</dl>
      </section>

      <blockquote class="quote-band">
        “Interpretar é fácil quando não se busca a real mensagem.”
        <footer>O estudo das línguas originais só é válido se acompanhado da hermenêutica — contexto histórico, cultural e figuras de linguagem.</footer>
      </blockquote>

      <section class="section" aria-labelledby="classicos">
        <p class="section-kicker">Base bibliográfica</p>
        <h2 id="classicos">Aprofunde com os clássicos</h2>
        <p>Os guarda-corpos hermenêuticos que sustentam este método:</p>
        <div class="book-strip">
          <a href="#/biblioteca" aria-label="Ver Os Perigos da Interpretação Bíblica na biblioteca">
            <img src="assets/img/livros/carson.jpg" alt="Capa de Os Perigos da Interpretação Bíblica, de D. A. Carson" loading="lazy" decoding="async">
            <span><b>Os Perigos da Interpretação Bíblica</b><span>D. A. Carson — falácias que arruínam exegeses</span></span>
          </a>
          <a href="#/biblioteca" aria-label="Ver A Interpretação Bíblica na biblioteca">
            <img src="assets/img/livros/zuck.jpg" alt="Capa de A Interpretação Bíblica, de Roy B. Zuck" loading="lazy" decoding="async">
            <span><b>A Interpretação Bíblica</b><span>Roy B. Zuck — meios de descobrir a verdade</span></span>
          </a>
          <a href="#/biblioteca" aria-label="Ver Fundamentos para Exegese do Novo Testamento na biblioteca">
            <img src="assets/img/livros/pinto.jpg" alt="Capa de Fundamentos para Exegese do Novo Testamento, de Pinto e Dias" loading="lazy" decoding="async">
            <span><b>Fundamentos para Exegese do NT</b><span>Pinto & Dias — manual de sintaxe grega</span></span>
          </a>
        </div>
      </section>

      <aside class="cta-band" aria-labelledby="cta-ex">
        <h2 id="cta-ex">Treine com textos reais</h2>
        <p>Aplique os sete passos agora mesmo: comece pelo analisador interlinear e observe morfologia, léxico e estrutura em Gênesis 1.1, Daniel 5.25 e João 1.1.</p>
        <a class="btn btn-gold" href="#/ferramentas">${icon('tools')} Abrir o analisador interlinear</a>
      </aside>
    </div>`;
  }
};
