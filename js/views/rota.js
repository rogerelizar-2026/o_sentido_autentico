/* AutenticSense — View: Rota de Crescimento
   Estruturada conforme o mapa mental "O Sentido Autêntico" e os
   infográficos da metodologia híbrida/multimodal integrada. */

import { icon } from '../icons.js';

const PASSOS = [
  {
    t: 'Domine a fundação (Nível 1)',
    d: 'Antes de correr para conjugações complexas, foque no alfabeto, nas vogais e na pronúncia — evitando que a memorização vire mera adivinhação. Adicione o vocabulário, iniciando com as 200 palavras mais frequentes.'
  },
  {
    t: 'A regra dos 30–60 minutos',
    d: 'A constância diária supera maratonas esporádicas: o segredo está no contato diário com o texto e no uso de repetição espaçada (SRS (sistema de repetição espaçada)), não em sessões heroicas de fim de semana.'
  },
  {
    t: 'Selecione as obras certas',
    d: 'Use gramáticas didáticas brasileiras e internacionais de excelência: Ross para o Hebraico; Rega & Bergmann e Mounce para a morfologia do Grego; Wallace para a sintaxe exegética.'
  }
];

const NIVEIS = [
  {
    n: 'Fundação', dur: '8 semanas',
    d: 'Alefato/alfabeto, reconhecimento de som-grafia, pronúncia e as primeiras 200 palavras mais frequentes das Escrituras. Meta: decodificar qualquer palavra do texto.'
  },
  {
    n: 'Básico · Morfologia', dur: '12 semanas',
    d: 'Gramática essencial com Rega & Bergmann (grego) e Ross (hebraico): substantivos, adjetivos, declinações e verbos regulares. Início da leitura de textos bíblicos simples.'
  },
  {
    n: 'Intermediário', dur: '16 semanas',
    d: 'Leitura autônoma de perícopes, morfologia verbal completa (stems, tempos, particípios e infinitivos) e parsing diário de versículos reais.'
  },
  {
    n: 'Avançado · Sintaxe', dur: '20 semanas',
    d: 'Transição para a exegese técnica com Daniel B. Wallace: a função das palavras no texto, casos teológicos, cláusulas e estruturas discursivas.'
  },
  {
    n: 'Fluência (contínuo)', dur: 'em curso',
    d: 'Leitura fluida do texto completo, inclusão do Aramaico Bíblico, comparação LXX (Septuaginta) × TM (Texto Massorético) e pesquisa acadêmica.'
  }
];

const BLOCOS = [
  { t: 'Bloco 1 · Revisão', min: '20 min', icon: 'reset',
    d: 'Flashcards no Anki (SRS) para manutenção da memória de longo prazo: vocabulário e paradigmas gramaticais.' },
  { t: 'Bloco 2 · Aquisição', min: '20 min', icon: 'book',
    d: 'Novo conteúdo gramatical ou expansão de vocabulário, por lições estruturadas nas obras de referência.' },
  { t: 'Bloco 3 · Imersão', min: '20 min', icon: 'scroll',
    d: 'Prática direta com o texto bíblico: leitura atenta do original ou análise interlinear nas ferramentas do portal.' }
];

const ESTRATEGIAS_IA = [
  { nivel: 'Nível 1 · Fundação', estr: 'Ditados fonéticos interativos', d: 'A inteligência artificial dita palavras para treinar a correlação som-grafia e o reconhecimento rápido de caracteres.' },
  { nivel: 'Nível 2 · Básico', estr: 'Parsing reverso', d: 'A inteligência artificial fornece a análise morfológica e você reconstrói a forma original no idioma.' },
  { nivel: 'Nível 3 · Intermediário', estr: 'Análise de desvios', d: 'Interrogação automatizada sobre verbos fracos/irregulares, particípios e estruturas complexas (waw consecutivo).' },
  { nivel: 'Nível 4 · Avançado', estr: 'Co-mentoria exegética S.O.I.A.', d: 'Protocolo Sintaxe, Observação, Interpretação e Aplicação com a inteligência artificial como parceira de estudo.' },
  { nivel: 'Nível 5 · Fluência', estr: 'Filologia comparada', d: 'Comparação semântica entre a Septuaginta (LXX) e o Texto Massorético (TM) para identificar nuances teológicas.' }
];

export default {
  title: 'Rota de Crescimento',
  desc: 'Do alefato à fluência: roteiro em 5 níveis para dominar Hebraico, Aramaico e Grego Koiné — com ritmo diário de 60 minutos, SRS e metodologia de aceleração com inteligência artificial.',

  render() {
    const passos = PASSOS.map((p, i) => `
      <div class="card">
        <span class="card-icon" aria-hidden="true">${icon(['scroll', 'reset', 'book'][i])}</span>
        <h3>Passo ${i + 1} · ${p.t}</h3>
        <p>${p.d}</p>
      </div>`).join('');

    const niveis = NIVEIS.map((nv) => `
      <li>
        <div>
          <h3>Nível ${NIVEIS.indexOf(nv) + 1} · ${nv.n} <span class="chip chip-gold" style="vertical-align:middle">${nv.dur}</span></h3>
          <p>${nv.d}</p>
        </div>
      </li>`).join('');

    const blocos = BLOCOS.map((b) => `
      <div class="plan-card">
        <span class="plan-ico" aria-hidden="true">${icon(b.icon)}</span>
        <strong>${b.t}</strong>
        <span class="plan-min">${b.min}</span>
        <p>${b.d}</p>
      </div>`).join('');

    const estrategias = ESTRATEGIAS_IA.map((e) => `
      <tr>
        <td><strong>${e.nivel}</strong></td>
        <td><span class="chip chip-gold">${e.estr}</span></td>
        <td>${e.d}</td>
      </tr>`).join('');

    return `
    <div class="container">
      <header class="page-head">
        <nav class="breadcrumb" aria-label="Trilha de navegação">
          <ol><li><a href="#/">Início</a></li><li aria-current="page">Rota de Crescimento</li></ol>
        </nav>
        <span class="eyebrow">${icon('compass')} Metodologia híbrida multimodal</span>
        <h1>Rota de Crescimento</h1>
        <p class="lede">
          Um roteiro estruturado e econômico — <strong>custo R$ 0</strong> — para levar você do
          primeiro contato com o alefato à leitura exegética madura. Ideal para estudantes de
          teologia, pastores, líderes e autodidatas, baseado em consistência, repetição espaçada
          e prática diária com o texto original.
        </p>
        <p class="chip-row" aria-label="Destaques da rota">
          <span class="chip chip-gold">5 níveis</span>
          <span class="chip chip-gold">60 min/dia</span>
          <span class="chip chip-gold">56 semanas para exegese (hebraico)</span>
          <span class="chip">retenção ~90% com SRS</span>
          <span class="chip">R$ 0 de investimento</span>
        </p>
      </header>

      <div class="callout callout--gold" style="margin-top:1.6rem">
        <span class="callout-title">Nota editorial</span>
        Adequação de níveis e semanas é uma organização editorial deste portal
        (vigência: <strong>setembro de 2026</strong>) para o material indicado —
        não é um cronograma oficial das editoras.
      </div>

      <section class="section" aria-labelledby="tres-passos">
        <p class="section-kicker">O ecossistema</p>
        <h2 id="tres-passos">Três passos que sustentam tudo</h2>
        <div class="grid" style="margin-top:1.4rem">${passos}</div>
      </section>

      <section class="section" aria-labelledby="niveis">
        <p class="section-kicker">Progressão</p>
        <h2 id="niveis">Os cinco níveis, da fundação à fluência</h2>
        <p>As semanas referem-se à trilha de Hebraico e Aramaico. A trilha de Grego Koiné segue
        a mesma lógica, adaptando a bibliografia (Rega → Mounce → Wallace) e o alvo lexical
        (as 200 palavras mais frequentes do Novo Testamento).</p>
        <ol class="steps">${niveis}</ol>
      </section>

      <section class="section" aria-labelledby="ritmo">
        <p class="section-kicker">O dia a dia</p>
        <h2 id="ritmo">O ritmo diário — 60 minutos</h2>
        <div class="plan-grid" style="margin-top:1.2rem">${blocos}</div>
        <div class="callout callout--gold" style="margin-top:1.4rem">
          <span class="callout-title">SRS: o segredo invisível</span>
          A repetição espaçada (Anki) mantém o vocabulário vivo com apenas 15–20 minutos diários.
          Sem ela, o esquecimento devora em semanas o que levou meses para construir; com ela,
          a retenção beira 90%.
        </div>
      </section>

      <section class="section" aria-labelledby="ia">
        <p class="section-kicker">Acelerador</p>
        <h2 id="ia">Metodologia de aceleração com inteligência artificial</h2>
        <p>A inteligência artificial atua como <strong>co-mentora 24/7</strong>: feedback imediato,
        repetição personalizada e exercícios impossíveis de gerar sozinho. Estudos da metodologia
        indicam leitura autônoma até 3× mais rápida em relação ao método tradicional.</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th scope="col">Nível</th><th scope="col">Estratégia com inteligência artificial</th><th scope="col">Como funciona</th></tr></thead>
            <tbody>${estrategias}</tbody>
          </table>
        </div>
        <div class="stat-strip" role="list" aria-label="Indicadores da metodologia">
          <div class="stat" role="listitem"><b>3×</b><span>mais rápido que o método tradicional</span></div>
          <div class="stat" role="listitem"><b>90%</b><span>retenção de vocabulário (SRS + inteligência artificial)</span></div>
          <div class="stat" role="listitem"><b>12–14</b><span>meses até a fluência (vs. 24–36)</span></div>
          <div class="stat" role="listitem"><b>R$ 0</b><span>recursos web gratuitos + inteligência artificial</span></div>
        </div>
        <div class="callout" style="margin-top:1.4rem">
          <span class="callout-title">Alerta acadêmico</span>
          Use a inteligência artificial apenas como um meio de acelerar o treinamento.
          <strong>Não a use para validar análises e conclusões</strong> que dependem de
          sensibilidade e direcionamento lógico-espiritual. Busque esclarecimento nas
          gramáticas e léxicos de referência (<a href="#/biblioteca">biblioteca</a>) e
          professores de formação acadêmica, certificação ou acompanhamento de mentores.
          Inteligência artificial não é autoridade, é ferramenta.
        </div>
      </section>

      <section class="section" aria-labelledby="infograficos">
        <p class="section-kicker">Material visual</p>
        <h2 id="infograficos">Os infográficos da jornada</h2>
        <p>Baixe ou consulte os pôsteres-resumo do método:</p>

        <figure class="info-figure">
          <img src="assets/img/info/ecossist.jpg" loading="lazy" decoding="async"
               alt="Infográfico do ecossistema O Sentido Autêntico: rota de crescimento em 3 passos, tabela de obras de referência por nível, diversidade metodológica da morfologia à sintaxe, ciclo de integração diária, ecossistema digital e inteligência artificial como co-mentora.">
          <figcaption><strong>O ecossistema em uma página:</strong> a rota em 3 passos, as obras por nível e o ciclo de integração diária.</figcaption>
        </figure>

        <div class="info-grid">
          <figure class="info-figure">
            <img src="assets/img/info/hebraico.jpg" loading="lazy" decoding="async"
                 alt="Infográfico Domínio das Línguas Bíblicas: o caminho para a fluência em Hebraico e Aramaico, com níveis 1 a 5, ritmo diário de 60 minutos em três blocos, ecossistema de suporte com Anki, Sefaria e Blue Letter Bible, 56 semanas para exegese e investimento zero.">
            <figcaption><strong>Hebraico e Aramaico:</strong> 56 semanas para exegese, nível a nível.</figcaption>
          </figure>
          <figure class="info-figure">
            <img src="assets/img/info/grego.jpg" loading="lazy" decoding="async"
                 alt="Infográfico Plano de Estudo do Grego Bíblico Koiné: da fundação à fluência em cinco níveis, com cronograma diário de 60 minutos, bibliografia de referência em Rega e Wallace, e ferramentas Step Bible e Anki.">
            <figcaption><strong>Grego Koiné:</strong> da fundação à sintaxe exegética.</figcaption>
          </figure>
        </div>

        <figure class="info-figure">
          <img src="assets/img/info/metodologia.jpg" loading="lazy" decoding="async"
               alt="Infográfico Metodologia de Aceleração: línguas bíblicas com inteligência artificial, mostrando estratégias de inteligência artificial por nível — ditados fonéticos, parsing reverso, análise de desvios, co-mentoria exegética SOIA e filologia comparada — além do comparativo de eficácia contra o método tradicional.">
          <figcaption><strong>Metodologia com inteligência artificial:</strong> estratégias por nível e comparativo de eficácia.</figcaption>
        </figure>
      </section>

      <aside class="cta-band" aria-labelledby="cta-rota">
        <h2 id="cta-rota">Equipe a sua mochila</h2>
        <p>A rota só funciona com as obras certas no caminho. Conheça as gramáticas e manuais recomendados — do nível 1 ao 5 — na nossa biblioteca de referências.</p>
        <a class="btn btn-gold" href="#/biblioteca">${icon('book')} Ver livros de referência</a>
      </aside>
    </div>`;
  }
};
