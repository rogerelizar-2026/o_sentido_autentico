/* AutenticSense — View: Aramaico Bíblico */

import { aramaicPassages, aramaicInNT } from '../data/alphabets.js';
import { verseById } from '../data/interlinear.js';
import { renderInterlinear, mountInterlinear } from '../components/interlinear.js';
import { icon } from '../icons.js';

export default {
  title: 'Aramaico Bíblico',
  desc: 'Descubra onde o aramaico aparece na Bíblia — de Daniel a Esdras e nas palavras de Jesus — com leitura interlinear de Daniel 5.25.',

  render() {
    const passages = aramaicPassages.map((p) => `
      <tr>
        <td><strong>${p.ref}</strong></td>
        <td>${p.descricao}</td>
      </tr>`).join('');

    const nt = aramaicInNT.map((w) => `
      <li>
        <strong><span class="greek" lang="arc">${w.expr}</span></strong>
        <span class="chip chip-gold">${w.fonte}</span><br>
        ${w.sign}
      </li>`).join('');

    return `
    <div class="container">
      <header class="page-head">
        <nav class="breadcrumb" aria-label="Trilha de navegação">
          <ol><li><a href="#/">Início</a></li><li aria-current="page">Aramaico Bíblico</li></ol>
        </nav>
        <span class="eyebrow">${icon('book')} Módulo 2 · A língua do exílio</span>
        <h1>Aramaico Bíblico</h1>
        <p class="lede">
          O aramaico foi a <strong>língua franca do antigo Oriente Médio</strong> — falada
          do Império Persa às ruas de Jerusalém no tempo de Jesus. Aparece em blocos
          inteiros de Daniel e Esdras e nas palavras mais comoventes dos Evangelhos,
          preservadas exatamente como foram ditas.
        </p>
        <p class="chip-row" aria-label="Destaques">
          <span class="chip chip-gold">~269 versículos no AT</span>
          <span class="chip chip-gold">palavras originais de Jesus</span>
          <span class="chip">mesma escrita quadrada do hebraico</span>
        </p>
      </header>

      <section class="section" aria-labelledby="onde">
        <p class="section-kicker">Mapa textual</p>
        <h2 id="onde">Onde o aramaico aparece na Bíblia</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th scope="col">Passagem</th><th scope="col">Conteúdo</th></tr></thead>
            <tbody>${passages}</tbody>
          </table>
        </div>
        <div class="callout callout--gold">
          <span class="callout-title">Hebraico e aramaico: primos próximos</span>
          As duas línguas compartilham o mesmo alfabeto de 22 letras (a “escrita quadrada”),
          léxicos semelhantes e a direção de leitura da direita para a esquerda.
          Quem aprendeu o Aleph-Bet hebraico já consegue decodificar textos aramaicos —
          mudam sobretudo a morfologia e algumas raízes.
        </div>
      </section>

      <section class="section" aria-labelledby="notas">
        <p class="section-kicker">Gramática essencial</p>
        <h2 id="notas">Três traços que delatam o aramaico</h2>
        <ol class="steps">
          <li>
            <div>
              <h3>O estado enfático em <span class="aramaic" lang="arc" dir="rtl">־אָ</span></h3>
              <p>Onde o hebraico usa o artigo prefixado <span class="hebrew" lang="he" dir="rtl">הַ</span> (“o”),
              o aramaico marca o substantivo determinado com o sufixo <span class="aramaic" lang="arc" dir="rtl">־אָ</span> (<span class="translit">-á</span>):
              <span class="aramaic" lang="arc" dir="rtl">מַלְכָּא</span> (<span class="translit">malká</span>) = “<em>o</em> rei”, e não apenas “rei”.</p>
            </div>
          </li>
          <li>
            <div>
              <h3>A conjugação Peal e suas irmãs</h3>
              <p>Os verbos se organizam em “conjugações” (binyanim) como no hebraico:
              <strong>Peal</strong> (ação simples), <strong>Pael</strong> (intensiva) e
              <strong>Afel</strong> (causativa: “fazer fazer”). Os prefixos mudam, mas a lógica é familiar.</p>
            </div>
          </li>
          <li>
            <div>
              <h3>Raízes compartilhadas, desvios felizes</h3>
              <p>Muitas raízes são as mesmas do hebraico — <span class="aramaic" lang="arc" dir="rtl">מלך</span> (reinar),
              <span class="aramaic" lang="arc" dir="rtl">אמר</span> (dizer), <span class="aramaic" lang="arc" dir="rtl">אלה</span> (Deus).
              Outras desviam: “ver” é <span class="aramaic" lang="arc" dir="rtl">חזה</span> (<span class="translit">ḥazá</span>),
              não <span class="hebrew" lang="he" dir="rtl">ראה</span> do hebraico.</p>
            </div>
          </li>
        </ol>
      </section>

      <section class="section" aria-labelledby="nt">
        <p class="section-kicker">No Novo Testamento</p>
        <h2 id="nt">A voz original, congelada no tempo</h2>
        <p>Os evangelistas escreveram em grego, mas em momentos de máxima emoção preservaram
        o aramaico que ecoava em seus ouvidos:</p>
        <ul class="check-list" style="grid-gap:1rem">${nt}</ul>
      </section>

      <section class="section" aria-labelledby="leitura-arc">
        <p class="section-kicker">Leitura guiada</p>
        <h2 id="leitura-arc">Daniel 5.25 — a escrita na parede</h2>
        <p>A festa de Belsazar é interrompida por uma mão que escreve na parede do palácio.
        Toque em cada palavra da sentença que só Daniel conseguiu ler:</p>
        ${renderInterlinear(verseById('dn525'))}
      </section>

        <div class="callout">
          <span class="callout-title">O aramaico entra no Nível 5</span>
          Na <a href="#/rota">Rota de Crescimento</a>, o Aramaico Bíblico é estudado na fase de
          fluência, aproveitando a base do hebraico — quem lê um, lê o outro.
        </div>

      <aside class="cta-band" aria-labelledby="cta-arc">
        <h2 id="cta-arc">Última língua: o grego koiné</h2>
        <p>Com hebraico e aramaico, você cobre o Antigo Testamento. O grego abre os 27 livros do Novo — e a Septuaginta, a Bíblia dos primeiros cristãos.</p>
        <a class="btn btn-gold" href="#/grego">Ir para o Grego Koiné →</a>
      </aside>
    </div>`;
  },

  mount(root) {
    mountInterlinear(root);
  }
};
