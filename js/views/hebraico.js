/* AutenticSense — View: Hebraico Bíblico */

import { hebrewAlphabet, niqud, begadkefat } from '../data/alphabets.js';
import { verseById } from '../data/interlinear.js';
import { renderInterlinear, mountInterlinear } from '../components/interlinear.js';
import { icon } from '../icons.js';

export default {
  title: 'Hebraico Bíblico',
  desc: 'Aprenda o Aleph-Bet hebraico, as vogais (niqud) e a regra Begadkefat, com leitura guiada interlinear de Gênesis 1.1.',

  render() {
    const alphaRows = hebrewAlphabet.map((l) => `
      <tr>
        <td class="letter">
          <span class="glyph hebrew" lang="he" dir="rtl">${l.g}</span>
          ${l.sofit ? `<span class="sub">final: <span class="hebrew" lang="he" dir="rtl">${l.sofit}</span></span>` : ''}
        </td>
        <td><strong>${l.name}</strong></td>
        <td class="tr">${l.tr}</td>
        <td>${l.som}</td>
      </tr>`).join('');

    const niqudRows = niqud.map((v) => `
      <tr>
        <td class="letter"><span class="glyph hebrew" lang="he" dir="rtl">${v.ex}</span></td>
        <td><strong>${v.name}</strong></td>
        <td class="tr">${v.tr}</td>
        <td>${v.som}</td>
      </tr>`).join('');

    const bgk = begadkefat.map((b) => `
      <span class="chip"><span class="hebrew" lang="he" dir="rtl">${b.g}</span> = ${b.plosiva} ·
      <span class="hebrew" lang="he" dir="rtl">${b.fric}</span> = ${b.fricTr}</span>`).join('');

    return `
    <div class="container">
      <header class="page-head">
        <nav class="breadcrumb" aria-label="Trilha de navegação">
          <ol><li><a href="#/">Início</a></li><li aria-current="page">Hebraico Bíblico</li></ol>
        </nav>
        <span class="eyebrow">${icon('scroll')} Módulo 1 · Antigo Testamento</span>
        <h1>Hebraico Bíblico</h1>
        <p class="lede">
          O hebraico é a língua de quase todo o Antigo Testamento — de Gênesis a Malaquias.
          Lê-se <strong>da direita para a esquerda</strong>, com 22 consoantes e vogais
          escritas como sinais ao redor das letras. Nesta trilha você domina o alfabeto
          e já lê o primeiro verso da Bíblia no original.
        </p>
        <p class="chip-row" aria-label="Destaques">
          <span class="chip chip-gold">22 consoantes</span>
          <span class="chip chip-gold">5 formas finais (sofit)</span>
          <span class="chip">leitura da direita para a esquerda</span>
          <span class="chip">tradição massorética (BHS/BHQ)</span>
        </p>
      </header>

      <section class="section" aria-labelledby="alephbet">
        <p class="section-kicker">Passo 1</p>
        <h2 id="alephbet">O Aleph-Bet</h2>
        <p>O alfabeto hebraico é inteiramente consonantal. Cinco letras assumem uma
        <strong>forma final</strong> (sofit) quando encerram a palavra — repare em Kafe, Mem, Nune, Pê e Tsade.</p>
        <div class="table-wrap">
          <table class="alpha-table">
            <thead><tr><th scope="col" class="letter">Letra</th><th scope="col">Nome</th><th scope="col">Translit.</th><th scope="col">Som</th></tr></thead>
            <tbody>${alphaRows}</tbody>
          </table>
        </div>
      </section>

      <section class="section" aria-labelledby="vogais">
        <p class="section-kicker">Passo 2</p>
        <h2 id="vogais">As vogais (niqud)</h2>
        <p>Por volta do séc. VI–X d.C., os masoretas criaram sinais para fixar a pronúncia
        sem alterar o texto consonantal. Eles ficam <em>embaixo, dentro ou acima</em> das letras.
        Abaixo, os exemplos usam a letra <span class="hebrew" lang="he" dir="rtl">ב</span> (b) como base.</p>
        <div class="table-wrap">
          <table class="alpha-table">
            <thead><tr><th scope="col" class="letter">Exemplo</th><th scope="col">Nome</th><th scope="col">Translit.</th><th scope="col">Som</th></tr></thead>
            <tbody>${niqudRows}</tbody>
          </table>
        </div>
        <div class="callout callout--gold">
          <span class="callout-title">Regra Begadkefat</span>
          Seis consoantes mudam de som conforme o <strong>daguesh</strong> (o ponto central).
          Com daguesh, são plosivas; sem daguesh, tornam-se fricativas:
        </div>
        <p class="chip-row">${bgk}</p>
      </section>

      <section class="section" aria-labelledby="leitura">
        <p class="section-kicker">Passo 3 · Leitura guiada</p>
        <h2 id="leitura">Gênesis 1.1, palavra por palavra</h2>
        <p>Toque em cada palavra para ver o lexema, a morfologia e a glosa.
        Recém-saído do alfabeto, você já consegue reconhecer letras como
        <span class="hebrew" lang="he" dir="rtl">בּ</span>, <span class="hebrew" lang="he" dir="rtl">ר</span> e
        <span class="hebrew" lang="he" dir="rtl">א</span> na primeira palavra da Bíblia.</p>
        ${renderInterlinear(verseById('gn11'))}
        <div class="callout callout--ok">
          <span class="callout-title">Pratique agora</span>
          Você já conhece as 22 letras! Vá até a ferramenta de
          <a href="#/ferramentas">transliterador</a> para ouvir e escrever cada letra —
          digite <span class="hebrew" lang="he" dir="rtl">חֶסֶד</span> (<span class="translit">ḥéssed</span>, “misericórdia”) e descubra o total.
        </div>
      </section>

        <div class="callout">
          <span class="callout-title">Quer o plano completo de estudos?</span>
          A <a href="#/rota">Rota de Crescimento</a> detalha os 5 níveis — do Aleph-Bet à
          exegese técnica em 56 semanas — com ritmo diário de 60 minutos, flashcards (Anki),
          aceleração por IA e a gramática de <a href="#/biblioteca">Allen P. Ross</a> na mochila.
        </div>

      <aside class="cta-band" aria-labelledby="cta-he">
        <h2 id="cta-he">Continue para o aramaico</h2>
        <p>O aramaico usa a mesma escrita quadrada do hebraico — quem lê um, lê o outro. Conhecer o aramaico abre as portas de Daniel e Esdras no original.</p>
        <a class="btn btn-gold" href="#/aramaico">Ir para o Aramaico →</a>
      </aside>
    </div>`;
  },

  mount(root) {
    mountInterlinear(root);
  }
};
