/* ==========================================================================
   AutenticSense — Componente Interlinear
   Renderiza um versículo palavra a palavra, com painel de análise
   (lexema, morfologia, transliteração e glosa) acessível por clique/teclado.
   ========================================================================== */

import { icon } from '../icons.js';
import { announce } from '../a11y.js';

const registry = new Map();

export function renderInterlinear(verse, { heading = false } = {}) {
  const blockId = `il-${verse.id}-${Math.random().toString(36).slice(2, 7)}`;
  registry.set(blockId, verse);

  const words = verse.words.map((w, i) => `
    <button type="button" class="il-word" data-il-index="${i}"
            aria-expanded="false" aria-haspopup="dialog"
            aria-label="Palavra ${i + 1}: analisar">
      <span class="il-w" lang="${verse.lang}">${w.w}</span>
      <span class="il-tr">${w.tr}</span>
    </button>`).join('');

  return `
    <section class="interlinear-block" id="${blockId}" data-il-block="${blockId}"
             aria-label="Análise interlinear de ${verse.ref}">
      <div class="interlinear-head">
        ${heading ? `<h3 class="ref" style="margin:0;border:none;padding:0">${verse.ref}</h3>`
                  : `<span class="ref">${verse.ref}</span>`}
        <span class="chip chip-gold">${verse.langLabel}</span>
        <span class="spacer"></span>
        <button type="button" class="btn-icon" data-speak="${verse.text}"
                data-speak-lang="pt-BR" aria-label="Ouvir o verso em ${verse.langLabel} (pronúncia aproximada)">
          ${icon('speaker')}
        </button>
      </div>
      <div class="interlinear" dir="${verse.dir}">${words}</div>
      <p class="translit" style="margin-top:1rem" lang="pt-BR">${verse.traducao}</p>
      <div class="il-detail" role="region" aria-label="Detalhes da palavra selecionada" tabindex="-1"></div>
      ${verse.nota ? `<p class="il-note"><strong>Nota exegética:</strong> ${verse.nota}</p>` : ''}
    </section>`;
}

export function mountInterlinear(root) {
  root.querySelectorAll('[data-il-block]').forEach((block) => {
    const verse = registry.get(block.dataset.ilBlock);
    const detail = block.querySelector('.il-detail');
    if (!verse || !detail) return;

    block.addEventListener('click', (e) => {
      const btn = e.target.closest('.il-word');
      if (!btn) return;
      select(btn);
    });

    block.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && detail.classList.contains('is-open')) {
        clearSelection();
        block.querySelector('.il-word')?.focus();
      }
    });

    function select(btn) {
      const word = verse.words[Number(btn.dataset.ilIndex)];
      if (!word) return;
      block.querySelectorAll('.il-word[aria-expanded="true"]')
        .forEach((el) => el.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', 'true');

      const scriptCls = verse.dir === 'rtl' ? 'hebrew' : 'greek';
      detail.innerHTML = `
        <div class="il-card">
          <div class="il-head">
            <span class="il-lemma ${scriptCls}" lang="${verse.lang}" dir="${verse.dir}">${word.lemma}</span>
            <span class="translit">${word.tr}</span>
            <span class="il-gloss">${word.gloss}</span>
          </div>
          <p class="il-morph"><strong>Morfologia:</strong> ${word.morph}</p>
          <p class="il-morph" style="margin:0">
            <strong>Palavra no texto:</strong>
            <span class="${scriptCls}" lang="${verse.lang}" dir="${verse.dir}" style="font-size:1.2em">${word.w}</span>
          </p>
        </div>`;
      detail.classList.add('is-open');
      detail.focus({ preventScroll: true });
      announce(`Palavra ${word.w}, transliteração ${word.tr}: ${word.gloss}.`);
    }

    function clearSelection() {
      block.querySelectorAll('.il-word[aria-expanded="true"]')
        .forEach((el) => el.setAttribute('aria-expanded', 'false'));
      detail.classList.remove('is-open');
    }
  });
}
