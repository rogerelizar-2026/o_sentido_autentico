/* AutenticSense — View: Livros de Referência
   Conforme o mapa mental: Hebraico → Ross; Grego → Rega & Bergmann,
   Mounce e Wallace; Exegese/Hermenêutica → Pinto, Carson e Zuck. */

import { icon } from '../icons.js';

const OBRAS_NIVEL = [
  { obra: 'Ross <span class="muted">(Hebraico)</span>', foco: 'Alefato, niqqud e morfologia filológica', nivel: '1–3' },
  { obra: 'Rega & Bergmann <span class="muted">(Grego)</span>', foco: 'Morfologia nominal e declinações (método indutivo)', nivel: '2–3' },
  { obra: 'William Mounce <span class="muted">(Grego)</span>', foco: 'Morfologia nominal e verbal para leitura', nivel: '4–5' },
  { obra: 'Daniel Wallace <span class="muted">(Grego)</span>', foco: 'Sintaxe exegética e casos teológicos', nivel: '4–5' }
];

const LIVROS = [
  {
    grupo: 'Hebraico Bíblico', modulo: 'module--hebrew', itens: [
      {
        capa: 'ross.jpg', titulo: 'Gramática do Hebraico Bíblico',
        autor: 'Allen P. Ross', detalhe: '2.ª edição',
        foco: 'A referência filológica completa: alefato, niqqud, morfologia e sintaxe hebraica com rigor acadêmico.',
        nivel: '1–3'
      }
    ]
  },
  {
    grupo: 'Grego Koiné', modulo: 'module--greek', itens: [
      {
        capa: 'rega.jpg', titulo: 'Noções do Grego Bíblico',
        autor: 'Lourenço Stelio Rega & Johannes Bergmann', detalhe: 'Nova edição revista · Vida Nova',
        foco: 'Morfologia nominal e declinações pelo método indutivo — o melhor ponto de partida em português.',
        nivel: '2–3'
      },
      {
        capa: 'mounce.jpg', titulo: 'Fundamentos do Grego Bíblico',
        autor: 'William D. Mounce', detalhe: '2.ª edição · Vida Nova',
        foco: 'Morfologia nominal e verbal orientada à leitura fluente do Novo Testamento.',
        nivel: '4–5'
      },
      {
        capa: 'wallace.jpg', titulo: 'Gramática Grega',
        subtitulo: 'Uma Sintaxe Exegética do Novo Testamento',
        autor: 'Daniel B. Wallace', detalhe: 'Vida Nova',
        foco: 'A síntese magistral da sintaxe grega: casos teológicos, cláusulas para entrar na exegese séria.',
        nivel: '4–5'
      },
      {
        capa: 'lasor.jpg', titulo: 'Gramática Sintática do Grego do Novo Testamento',
        autor: 'William Sanford LaSor',
        foco: 'Sintaxe grega aplicada, ponte sólida entre a morfologia e a análise exegética.',
        nivel: '3–4'
      }
    ]
  },
  {
    grupo: 'Exegese & Hermenêutica', modulo: 'module--aramaic', itens: [
      {
        capa: 'pinto.jpg', titulo: 'Fundamentos para Exegese do Novo Testamento',
        subtitulo: 'Manual de Sintaxe Grega',
        autor: 'Carlos Oswaldo Cardoso Pinto & Marcelo Dias', detalhe: '2.ª ed. rev. e ampl. · Vida Nova',
        foco: 'O manual brasileiro de sintaxe grega a serviço da exegese — direto, rigoroso e ministerial.',
        nivel: '3–5'
      },
      {
        capa: 'carson.jpg', titulo: 'Os Perigos da Interpretação Bíblica',
        autor: 'D. A. Carson', detalhe: 'Vida Nova',
        foco: 'O antídoto contra as falácias: erros lexicais, gramaticais e lógicos que arruínam interpretações.',
        nivel: '2–5'
      },
      {
        capa: 'zuck.jpg', titulo: 'A Interpretação Bíblica',
        subtitulo: 'Meios de descobrir a verdade da Bíblia',
        autor: 'Roy B. Zuck', detalhe: 'Vida Nova',
        foco: 'Hermenêutica completa e acessível: gêneros literários, figuras de linguagem e aplicação.',
        nivel: '1–4'
      }
    ]
  }
];

const CICLO = [
  { t: 'Traduzir', d: 'Rega e Mounce no bolso: passe o texto do original ao português.', icon: 'book' },
  { t: 'Parsing morfológico', d: 'Analise cada forma — caso, tempo, modo, voz — nas ferramentas do portal e apps recomendados.', icon: 'tools' },
  { t: 'Consultar a sintaxe', d: 'Wallace e Pinto respondem o “porquê” teológico de cada construção.', icon: 'compass' }
];

function bookCard(l) {
  return `
    <article class="book-card">
      <img class="book-cover" src="assets/img/livros/${l.capa}" loading="lazy" decoding="async"
           alt="Capa do livro ${l.titulo}, de ${l.autor}">
      <div class="book-info">
        <h4>${l.titulo}</h4>
        ${l.subtitulo ? `<p class="book-sub">${l.subtitulo}</p>` : ''}
        <p class="book-autor">${l.autor}</p>
        <p class="book-foco">${l.foco}</p>
        <p class="chip-row">
          ${l.detalhe ? `<span class="chip" title="Edição">${l.detalhe}</span>` : ''}
          <span class="chip chip-gold">Nível ${l.nivel}</span>
        </p>
      </div>
    </article>`;
}

export default {
  title: 'Livros de Referência',
  desc: 'As gramáticas e manuais recomendados por língua e nível: Ross (Hebraico), Rega & Bergmann, Mounce, Wallace, LaSor (Grego), Pinto, Carson e Zuck (Exegese).',

  render() {
    const tabela = OBRAS_NIVEL.map((o) => `
      <tr><td><strong>${o.obra}</strong></td><td>${o.foco}</td><td><span class="chip chip-gold">${o.nivel}</span></td></tr>`).join('');

    const grupos = LIVROS.map((g) => `
      <section class="section ${g.modulo}" aria-labelledby="grp-${g.grupo.split(' ')[0].toLowerCase()}">
        <p class="section-kicker" style="color:var(--module-color)">Estante</p>
        <h2 id="grp-${g.grupo.split(' ')[0].toLowerCase()}" style="border-color:var(--module-color)">${g.grupo}</h2>
        <div class="book-grid">${g.itens.map(bookCard).join('')}</div>
      </section>`).join('');

    const ciclo = CICLO.map((c, i) => `
      <div class="card">
        <span class="card-icon" aria-hidden="true">${icon(c.icon)}</span>
        <h3>${i + 1}. ${c.t}</h3>
        <p>${c.d}</p>
      </div>`).join('');

    return `
    <div class="container">
      <header class="page-head">
        <nav class="breadcrumb" aria-label="Trilha de navegação">
          <ol><li><a href="#/">Início</a></li><li aria-current="page">Livros de Referência</li></ol>
        </nav>
        <span class="eyebrow">${icon('book')} Curadoria acadêmica</span>
        <h1>Livros de Referência</h1>
        <p class="lede">
          As ferramentas aceleram, mas as <strong>gramáticas formam</strong>. Esta é a estante
          curada da metodologia: obras de excelência didática e filológica organizadas por
          língua e pelo nível em que entram na <a href="#/rota">sua rota de crescimento</a>.
        </p>
      </header>

      <section class="section" aria-labelledby="foco-nivel">
        <p class="section-kicker">Mapa da estante</p>
        <h2 id="foco-nivel">Obras por foco didático e nível</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th scope="col">Obra</th><th scope="col">Foco didático</th><th scope="col">Nível</th></tr></thead>
            <tbody>${tabela}</tbody>
          </table>
        </div>
        <div class="callout" style="margin-top:1.4rem">
          <span class="callout-title">Da morfologia à sintaxe</span>
          Rega e Mounce focam em <em>o que a palavra é</em> (morfologia); Wallace explica
          <em>por que a construção importa teologicamente</em> (sintaxe). A base morfológica
          (semanas 1–20) serve de ponte para a análise exegética avançada (semana 21 em diante).
        </div>
      </section>

      ${grupos}

      <section class="section" aria-labelledby="ciclo">
        <p class="section-kicker">Como usar</p>
        <h2 id="ciclo">O ciclo de integração diária</h2>
        <div class="grid" style="margin-top:1.4rem">${ciclo}</div>
        <div class="callout callout--gold" style="margin-top:1.4rem">
          <span class="callout-title">Nota exegética de 2–3 linhas</span>
          Feche cada sessão registrando uma breve nota com o que a forma gramatical mudou no
          seu entendimento do texto. Em poucos meses você terá um caderno exegético próprio.
        </div>
      </section>

      <div class="callout callout--danger">
        <span class="callout-title">Direitos autorais</span>
        As capas exibidas têm finalidade exclusivamente educacional e identificatória. Todos os
        direitos pertencem aos autores e editoras (Vida Nova, Thomas Nelson Brasil, entre outras).
        Adquira os volumes pelos canais oficiais — a formação que eles oferecem vale cada centavo.
      </div>

      <aside class="cta-band" aria-labelledby="cta-bib">
        <h2 id="cta-bib">Agora, mãos à obra</h2>
        <p>Com a estante definida, volte à rota e organize suas próximas 56 semanas de estudo — 60 minutos por dia, um bloco de cada vez.</p>
        <a class="btn btn-gold" href="#/rota">${icon('compass')} Revisitar a Rota de Crescimento</a>
      </aside>
    </div>`;
  }
};
