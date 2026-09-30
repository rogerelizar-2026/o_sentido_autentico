/* AutenticSense — View: Grego Koiné */

import { greekAlphabet, greekDiphthongs } from '../data/alphabets.js';
import { verseById } from '../data/interlinear.js';
import { renderInterlinear, mountInterlinear } from '../components/interlinear.js';
import { icon } from '../icons.js';

export default {
  title: 'Grego Koiné',
  desc: 'Aprenda o alfabeto grego, sinais diacríticos e casos gramaticais, com análise interlinear de João 1.1 no original.',

  render() {
    const rows = greekAlphabet.map((l) => `
      <tr>
        <td class="letter"><span class="glyph greek" lang="grc">${l.uc} ${l.lc}</span></td>
        <td><strong>${l.name}</strong></td>
        <td class="tr">${l.tr}</td>
        <td>${l.som}</td>
      </tr>`).join('');

    const diph = greekDiphthongs.map((d) =>
      `<span class="chip"><span class="greek" lang="grc">${d.g}</span> → ${d.tr} (${d.som})</span>`).join('');

    return `
    <div class="container">
      <header class="page-head">
        <nav class="breadcrumb" aria-label="Trilha de navegação">
          <ol><li><a href="#/">Início</a></li><li aria-current="page">Grego Koiné</li></ol>
        </nav>
        <span class="eyebrow">${icon('alpha')} Módulo 3 · Novo Testamento & Septuaginta</span>
        <h1>Grego Koiné</h1>
        <p class="lede">
          Entre 300 a.C. e 300 d.C., o grego “comum” (<span class="greek" lang="grc">κοινή</span>,
          <span class="translit">koiné</span>) era a língua internacional do Mediterrâneo.
          Nele foram escritos os 27 livros do Novo Testamento e a Septuaginta (LXX),
          a tradução grega do Antigo Testamento citada pelos apóstolos.
        </p>
        <p class="chip-row" aria-label="Destaques">
          <span class="chip chip-gold">24 letras</span>
          <span class="chip chip-gold">5 casos gramaticais</span>
          <span class="chip">texto crítico NA28/UBS5</span>
        </p>
      </header>

      <section class="section" aria-labelledby="alfa-gr">
        <p class="section-kicker">Passo 1</p>
        <h2 id="alfa-gr">O alfabeto grego</h2>
        <p>Ao contrário do hebraico, o grego escreve <strong>vogais plenas</strong> e da
        esquerda para a direita. O sigma tem duas formas minúsculas:
        <span class="greek" lang="grc">σ</span> no meio da palavra e <span class="greek" lang="grc">ς</span> no final.</p>
        <div class="table-wrap">
          <table class="alpha-table">
            <thead><tr><th scope="col" class="letter">Letra</th><th scope="col">Nome</th><th scope="col">Translit.</th><th scope="col">Som</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>

      <section class="section" aria-labelledby="sinais">
        <p class="section-kicker">Passo 2</p>
        <h2 id="sinais">Sinais que mudam tudo</h2>
        <div class="grid grid-2" style="margin-top:1rem">
          <div class="card">
            <h3>Os “espíritos” (da pneuma)</h3>
            <p>Toda palavra iniciada por vogal leva um espírito.
            O <strong>suave</strong> ( <span class="greek" lang="grc">ἀ</span> ) não altera o som.
            O <strong>rude</strong> ( <span class="greek" lang="grc">ἁ</span> ) adiciona um “h” inicial:
            <span class="greek" lang="grc">ἁμαρτία</span> = <span class="translit">hamartía</span> (“pecado”).</p>
          </div>
          <div class="card">
            <h3>Acento e entonação</h3>
            <p><strong>Agudo</strong> ( <span class="greek" lang="grc">ά</span> ), <strong>grave</strong> ( <span class="greek" lang="grc">ὰ</span> )
            e <strong>circunflexo</strong> ( <span class="greek" lang="grc">ᾶ</span> ) marcam a sílaba tônica.
            Eles distinguem significados: <span class="greek" lang="grc">θεός</span> (“Deus”), sem acento, nunca é o mesmo contexto.</p>
          </div>
        </div>
        <h3 style="margin-top:1.6rem">Diftongos frequentes</h3>
        <p class="chip-row">${diph}</p>
      </section>

      <section class="section" aria-labelledby="casos">
        <p class="section-kicker">Passo 3</p>
        <h2 id="casos">Os cinco casos: a engrenagem da frase</h2>
        <p>O grego “declina” substantivos, artigos e adjetivos conforme a função na oração.
        Veja a declinação singular de <span class="greek" lang="grc">λόγος</span> (“palavra”) com o artigo:</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th scope="col">Caso</th><th scope="col">Forma</th><th scope="col">Função</th><th scope="col">Exemplo em português</th></tr></thead>
            <tbody>
              <tr><td><strong>Nominativo</strong></td><td><span class="greek" lang="grc">ὁ λόγος</span></td><td>sujeito</td><td>“<em>o Verbo</em> era Deus”</td></tr>
              <tr><td><strong>Genitivo</strong></td><td><span class="greek" lang="grc">τοῦ λόγου</span></td><td>posse, origem</td><td>“a vida <em>do Verbo</em>”</td></tr>
              <tr><td><strong>Dativo</strong></td><td><span class="greek" lang="grc">τῷ λόγῳ</span></td><td>objeto indireto, meio</td><td>“falamos <em>com o Verbo</em>”</td></tr>
              <tr><td><strong>Acusativo</strong></td><td><span class="greek" lang="grc">τὸν λόγον</span></td><td>objeto direto</td><td>“ouvimos <em>o Verbo</em>”</td></tr>
              <tr><td><strong>Vocativo</strong></td><td><span class="greek" lang="grc">λόγε</span></td><td>apelo direto</td><td>“<em>ó Verbo!</em>”</td></tr>
            </tbody>
          </table>
        </div>
        <div class="callout callout--gold">
          <span class="callout-title">Por que isso liberta o intérprete</span>
          Em português, a ordem das palavras carrega a gramática; em grego, são os
          <strong>finais das palavras</strong>. Por isso uma frase pode colocar o predicado na frente
          para dar ênfase — exatamente o que João faz no versículo abaixo.
        </div>
      </section>

      <section class="section" aria-labelledby="leitura-gr">
        <p class="section-kicker">Passo 4 · Leitura guiada</p>
        <h2 id="leitura-gr">João 1.1, palavra por palavra</h2>
        <p>O prólogo de João espelha Gênesis 1.1 — <span class="greek" lang="grc">ἐν ἀρχῇ</span> traduz
        exatamente <span class="hebrew" lang="he" dir="rtl">בְּרֵאשִׁית</span>. Toque em cada palavra:</p>
        ${renderInterlinear(verseById('jo11'))}
        <div class="callout callout--ok">
          <span class="callout-title">Ferramenta certa para a hora</span>
          Teste no <a href="#/ferramentas">Transliterador de Grego</a> palavras como
          <span class="greek" lang="grc">ἀγάπη</span> (amor), <span class="greek" lang="grc">χάρις</span> (graça) ou
          <span class="greek" lang="grc">πνεῦμα</span> (espírito).
        </div>
      </section>

        <div class="callout">
          <span class="callout-title">Do alfabeto ao Wallace</span>
          A trilha do Grego Koiné na <a href="#/rota">Rota de Crescimento</a> usa
          <a href="#/biblioteca">Rega & Bergmann</a> para a morfologia (método indutivo),
          <a href="#/biblioteca">Mounce</a> para a leitura e <a href="#/biblioteca">Wallace</a> para a sintaxe exegética — com Step Bible e Anki no dia a dia.
        </div>

      <aside class="cta-band" aria-labelledby="cta-gr">
        <h2 id="cta-gr">Agora, coloque tudo em prática</h2>
        <p>Você conhece as três línguas das Escrituras. É hora de abrir as ferramentas interativas e analisar os textos por conta própria.</p>
        <a class="btn btn-gold" href="#/ferramentas">Abrir as Ferramentas →</a>
      </aside>
    </div>`;
  },

  mount(root) {
    mountInterlinear(root);
  }
};
