/* AutenticSense — View: Ferramentas Interativas (offline) */

import { verses, verseById } from '../data/interlinear.js';
import { renderInterlinear, mountInterlinear } from '../components/interlinear.js';
import { transliterateHebrew, transliterateGreek, copyText } from '../tools.js';
import { icon } from '../icons.js';
import { announce } from '../a11y.js';

const TABS = [
  { id: 'il', label: 'Interlinear' },
  { id: 'he', label: 'Transliterador hebraico' },
  { id: 'gr', label: 'Transliterador grego' },
];

export default {
  title: 'Ferramentas',
  desc: 'Ferramentas bíblicas offline: analisador interlinear e transliteradores de hebraico e grego.',

  render() {
    const tabButtons = TABS.map((t, i) => `
      <button type="button" role="tab" id="tab-${t.id}" data-tab="${t.id}"
              aria-selected="${i === 0}" aria-controls="panel-${t.id}" tabindex="${i === 0 ? 0 : -1}">
        ${t.label}
      </button>`).join('');

    const verseButtons = verses.map((v, i) => `
      <button type="button" class="chip ${i === 0 ? 'chip-gold' : ''}" data-verse-btn="${v.id}"
              aria-pressed="${i === 0}">${v.ref}</button>`).join('');

    return `
    <div class="container">
      <header class="page-head">
        <nav class="breadcrumb" aria-label="Trilha de navegação">
          <ol><li><a href="#/">Início</a></li><li aria-current="page">Ferramentas</li></ol>
        </nav>
        <span class="eyebrow">${icon('tools')} Laboratório de línguas · offline</span>
        <h1>Ferramentas Interativas</h1>
        <p class="lede">
          Quatro instrumentos de estudo que rodam <strong>inteiramente no seu dispositivo</strong>:
          nenhum texto digitado sai do navegador. Combine-os para analisar qualquer passagem
          das Escrituras nos idiomas originais.
        </p>
      </header>

      <div class="tablist" role="tablist" aria-label="Ferramentas disponíveis">${tabButtons}</div>

      <!-- Interlinear -->
      <section role="tabpanel" id="panel-il" aria-labelledby="tab-il" class="tabpanel">
        <p>Selecione um versículo e toque em cada palavra para revelar lexema, morfologia e glosa:</p>
        <div class="chip-row" role="group" aria-label="Escolher versículo">${verseButtons}</div>
        <div id="ilContainer" style="margin-top:1.2rem"></div>
      </section>

      <!-- Transliterador hebraico -->
      <section role="tabpanel" id="panel-he" aria-labelledby="tab-he" class="tabpanel" hidden>
        <div class="tool-panel">
          <p class="muted">Transliteração acadêmica simplificada. Reconhece niqud (vogais), daguesh
          lene e forte, begadkefat, shuruq, maqaf e pátach furtivo.</p>
          <div class="tool-grid">
            <div class="field">
              <label for="heIn">Texto em hebraico ou aramaico</label>
              <textarea id="heIn" class="script" lang="he" dir="rtl" spellcheck="false"
                        placeholder="כִּי אוֹר בַּחַיִּים…">שָׁלוֹם עָלֵיכֶם</textarea>
              <p class="hint">Experimente:
                <button type="button" class="btn btn-ghost btn-sm" data-he-sample="בְּרֵאשִׁית בָּרָא אֱלֹהִים">Gn 1.1</button>
                <button type="button" class="btn btn-ghost btn-sm" data-he-sample="טַלִּיתָא קוּמִי">Talita cumi</button>
                <button type="button" class="btn btn-ghost btn-sm" data-he-sample="כִּי־טוֹב יְהוָה לְעוֹלָם חַסְדּוֹ">Sl 100.5</button>
              </p>
            </div>
            <div>
              <p class="output-legend" id="heOutLegend">Transliteração (pt-BR)</p>
              <div class="output" id="heOut" aria-live="polite" aria-labelledby="heOutLegend"></div>
              <div class="a11y-row" style="margin-top:0.6rem">
                <button type="button" class="btn btn-outline btn-sm" id="heCopy">${icon('copy')} Copiar</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Transliterador grego -->
      <section role="tabpanel" id="panel-gr" aria-labelledby="tab-gr" class="tabpanel" hidden>
        <div class="tool-panel">
          <p class="muted">Estilo acadêmico simplificado: ditongos combinados, gama nasal (γ→n),
          espírito rude (h), e vogais longas η/ō assinaladas (ē, ō).</p>
          <div class="tool-grid">
            <div class="field">
              <label for="grIn">Texto em grego</label>
              <textarea id="grIn" class="greek-input" lang="grc" spellcheck="false"
                        placeholder="γράψτε ἐνθάδε…">ἀγάπη</textarea>
              <p class="hint">Experimente:
                <button type="button" class="btn btn-ghost btn-sm" data-gr-sample="λόγος">λόγος</button>
                <button type="button" class="btn btn-ghost btn-sm" data-gr-sample="ἁμαρτία">ἁμαρτία</button>
                <button type="button" class="btn btn-ghost btn-sm" data-gr-sample="πνεῦμα ἅγιον">πνεῦμα ἅγιον</button>
              </p>
            </div>
            <div>
              <p class="output-legend" id="grOutLegend">Transliteração (SBL (Society of Biblical Literature) simplificado)</p>
              <div class="output" id="grOut" aria-live="polite" aria-labelledby="grOutLegend"></div>
              <div class="a11y-row" style="margin-top:0.6rem">
                <button type="button" class="btn btn-outline btn-sm" id="grCopy">${icon('copy')} Copiar</button>
              </div>
            </div>
          </div>
        </div>
      </section>


      <div class="callout callout--gold" style="margin-top:2rem">
        <span class="callout-title">Limite honesto das ferramentas</span>
        A transliteração é um mapa fonético pedagógico, não uma análise morfológica completa:
        o sheva vocal/silencioso, o qamats-o e os contextos de begadkefat exigem avaliação da
        palavra inteira — para isso, consulte um léxico (BDB (léxico Brown-Driver-Briggs)/Strong para o AT (Antigo Testamento); BDAG (léxico Bauer-Danker-Arndt-Gingrich)/Strong para o NT (Novo Testamento)).
      </div>
    </div>`;
  },

  mount(root) {
    /* ---------- Abas (padrão WAI-ARIA) ---------- */
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    function selectTab(tab) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        root.querySelector('#' + t.getAttribute('aria-controls')).hidden = !on;
      });
      tab.focus();
    }
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => selectTab(t));
      t.addEventListener('keydown', (e) => {
        let next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); selectTab(next); }
      });
    });

    /* ---------- Interlinear: seletor de versículos ---------- */
    const ilContainer = root.querySelector('#ilContainer');
    function showVerse(id) {
      ilContainer.innerHTML = renderInterlinear(verseById(id));
      mountInterlinear(ilContainer);
      root.querySelectorAll('[data-verse-btn]').forEach((b) => {
        const on = b.dataset.verseBtn === id;
        b.setAttribute('aria-pressed', String(on));
        b.classList.toggle('chip-gold', on);
      });
      announce(`Versículo carregado: ${verseById(id).ref}.`);
    }
    root.querySelectorAll('[data-verse-btn]').forEach((b) =>
      b.addEventListener('click', () => showVerse(b.dataset.verseBtn)));
    showVerse('gn11');

    /* ---------- Transliteradores ---------- */
    const heIn = root.querySelector('#heIn');
    const heOut = root.querySelector('#heOut');
    const updateHe = () => { heOut.textContent = transliterateHebrew(heIn.value); };
    heIn.addEventListener('input', updateHe);
    root.querySelectorAll('[data-he-sample]').forEach((b) =>
      b.addEventListener('click', () => { heIn.value = b.dataset.heSample; updateHe(); }));
    root.querySelector('#heCopy').addEventListener('click', async () => {
      const ok = await copyText(heOut.textContent);
      announce(ok ? 'Transliteração hebraica copiada.' : 'Não foi possível copiar.');
    });
    updateHe();

    const grIn = root.querySelector('#grIn');
    const grOut = root.querySelector('#grOut');
    const updateGr = () => { grOut.textContent = transliterateGreek(grIn.value); };
    grIn.addEventListener('input', updateGr);
    root.querySelectorAll('[data-gr-sample]').forEach((b) =>
      b.addEventListener('click', () => { grIn.value = b.dataset.grSample; updateGr(); }));
    root.querySelector('#grCopy').addEventListener('click', async () => {
      const ok = await copyText(grOut.textContent);
      announce(ok ? 'Transliteração grega copiada.' : 'Não foi possível copiar.');
    });
    updateGr();

  }
};
