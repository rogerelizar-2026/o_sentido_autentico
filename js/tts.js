/* ==========================================================================
   Sentido Autêntico — Síntese de voz (leitura em voz alta)
   Web Speech API, sem dependências.

   Cuidados que este módulo resolve:
   · as vozes do navegador carregam de forma assíncrona (o primeiro clique
     ficava mudo enquanto a lista ainda estava vazia);
   · o Chrome interrompe a fala por volta de 15 segundos — é preciso um
     "cutucão" periódico para a leitura longa não morrer no meio;
   · enfileirar vários trechos de uma vez embaralha a ordem em alguns
     navegadores, então a fila é reproduzida um trecho por vez;
   · caracteres hebraicos e gregos não são pronunciáveis por uma voz
     portuguesa: quem chama deve enviar a transliteração.
   ========================================================================== */

const state = { speaking: false, listeners: new Set() };

let vozes = [];
let vozesProntas = false;
let esperandoVozes = null;

/* ------------------------------ Vozes ----------------------------------- */

function carregarVozes() {
  if (!('speechSynthesis' in window)) return;
  vozes = window.speechSynthesis.getVoices() || [];
  if (vozes.length) vozesPronta();
}

function vozesPronta() {
  vozesProntas = true;
  if (esperandoVozes) { esperandoVozes(); esperandoVozes = null; }
}

if ('speechSynthesis' in window) {
  carregarVozes();
  window.speechSynthesis.addEventListener('voiceschanged', carregarVozes);
}

/** Espera a lista de vozes aparecer (com teto de tempo, para nunca travar). */
function aguardarVozes(limite = 1200) {
  if (vozesProntas || !('speechSynthesis' in window)) return Promise.resolve();
  return new Promise((resolve) => {
    const fim = setTimeout(() => { esperandoVozes = null; resolve(); }, limite);
    esperandoVozes = () => { clearTimeout(fim); resolve(); };
    carregarVozes();
  });
}

/** Escolhe a melhor voz disponível para um idioma, com quedas suaves. */
function escolherVoz(lang) {
  if (!vozes.length) return null;
  const base = String(lang || 'pt-BR').toLowerCase();
  const raiz = base.split('-')[0];
  return (
    vozes.find((v) => v.lang.toLowerCase() === base) ||
    vozes.find((v) => v.lang.toLowerCase().replace('_', '-') === base) ||
    vozes.find((v) => v.lang.toLowerCase().startsWith(raiz)) ||
    (raiz === 'pt' ? null : vozes.find((v) => v.lang.toLowerCase().startsWith('pt'))) ||
    null
  );
}

/** Há voz instalada capaz de falar este idioma? */
export function temVozPara(lang) {
  const raiz = String(lang || '').toLowerCase().split('-')[0];
  return vozes.some((v) => v.lang.toLowerCase().startsWith(raiz));
}

/* ----------------------------- Estado ------------------------------------ */

function setState(on) {
  if (state.speaking === on) return;
  state.speaking = on;
  state.listeners.forEach((cb) => { try { cb(on); } catch { /* ignora */ } });
}

/* --------------------- Antídoto para o corte do Chrome ------------------- */

let vigia = null;

function iniciarVigia() {
  pararVigia();
  vigia = setInterval(() => {
    if (!('speechSynthesis' in window)) return pararVigia();
    const s = window.speechSynthesis;
    if (!s.speaking && !s.pending) return pararVigia();
    /* pausar/retomar reinicia o cronômetro interno de 15s do Chrome */
    if (!s.paused) { s.pause(); s.resume(); }
  }, 9000);
}

function pararVigia() {
  if (vigia) { clearInterval(vigia); vigia = null; }
}

/* ------------------------------ Fila ------------------------------------- */

let fila = [];
let tocando = false;
let sessao = 0;

function fatiar(texto, max = 200) {
  const limpo = String(texto).replace(/\s+/g, ' ').trim();
  if (!limpo) return [];
  const frases = limpo.match(/[^.!?;:…]+[.!?;:…]*\s*/g) || [limpo];
  const pedacos = [];
  let buf = '';
  for (const f of frases) {
    if (f.length > max) {                    /* frase gigante: corta por vírgula */
      if (buf.trim()) { pedacos.push(buf.trim()); buf = ''; }
      let parcial = '';
      for (const parte of f.split(/(?<=,)\s*/)) {
        if ((parcial + parte).length > max && parcial) { pedacos.push(parcial.trim()); parcial = parte; }
        else parcial += parte;
      }
      if (parcial.trim()) pedacos.push(parcial.trim());
    } else if ((buf + f).length > max && buf) { pedacos.push(buf.trim()); buf = f; }
    else buf += f;
  }
  if (buf.trim()) pedacos.push(buf.trim());
  return pedacos;
}

function proximo(idSessao) {
  if (idSessao !== sessao) return;
  const item = fila.shift();
  if (!item) { tocando = false; pararVigia(); setState(false); return; }

  const u = new SpeechSynthesisUtterance(item.texto);
  u.lang = item.lang;
  const voz = escolherVoz(item.lang);
  if (voz) u.voice = voz;
  u.rate = item.rate;
  u.pitch = 1;
  u.volume = 1;

  let seguiu = false;
  const seguir = () => {
    if (seguiu) return;
    seguiu = true;
    proximo(idSessao);
  };
  u.onend = seguir;
  u.onerror = (e) => {
    /* "interrupted" e "canceled" são esperados quando o usuário manda parar */
    if (e && !['interrupted', 'canceled'].includes(e.error)) {
      console.warn('[voz] falha ao falar o trecho:', e.error);
    }
    seguir();
  };

  try {
    window.speechSynthesis.speak(u);
  } catch (err) {
    console.warn('[voz] erro inesperado:', err);
    seguir();
  }
}

/* ------------------------------- API ------------------------------------- */

export const tts = {
  get supported() { return 'speechSynthesis' in window; },
  get speaking() { return state.speaking; },
  get vozes() { return vozes.slice(); },

  onState(cb) { state.listeners.add(cb); return () => state.listeners.delete(cb); },

  /**
   * Fala um texto. Devolve true se a leitura foi realmente enfileirada.
   * @param {string} texto
   * @param {{lang?: string, rate?: number}} opcoes
   */
  speak(texto, { lang = 'pt-BR', rate = 0.96 } = {}) {
    if (!this.supported) return false;
    const conteudo = String(texto == null ? '' : texto).trim();
    if (!conteudo) return false;

    this.stop();
    const idSessao = ++sessao;

    aguardarVozes().then(() => {
      if (idSessao !== sessao) return;          /* outra leitura começou */
      const pedacos = fatiar(conteudo);
      if (!pedacos.length) return;
      fila = pedacos.map((t) => ({ texto: t, lang, rate }));
      tocando = true;
      setState(true);
      iniciarVigia();
      /* o Chrome engole a primeira fala se ela vier colada num cancel() */
      setTimeout(() => proximo(idSessao), 60);
    });

    return true;
  },

  stop() {
    if (!this.supported) return;
    sessao += 1;
    fila = [];
    tocando = false;
    pararVigia();
    try {
      window.speechSynthesis.resume();   /* sai da pausa antes de cancelar */
      window.speechSynthesis.cancel();
    } catch { /* ignora */ }
    setState(false);
  },

  toggle(texto, opcoes) {
    if (state.speaking) { this.stop(); return false; }
    return this.speak(texto, opcoes);
  },

  /** Lê em voz alta o conteúdo principal da página atual. */
  readMain() {
    const main = document.querySelector('main#conteudo');
    if (!main) return false;

    const clone = main.cloneNode(true);
    clone.querySelectorAll(
      'button, script, style, svg, .sr-only, [aria-hidden="true"], ' +
      '[hidden], [data-nao-ler], .interlinear, .breadcrumb, table'
    ).forEach((el) => el.remove());

    /* Vozes de português não pronunciam escrita hebraica, aramaica ou grega:
       deixá-las no texto produz silêncio ou ruído no meio da frase. */
    clone.querySelectorAll('[lang="he"], [lang="arc"], [lang="grc"], .hebrew, .aramaic, .greek')
      .forEach((el) => el.remove());

    /* textContent funciona mesmo em nó solto, fora da árvore renderizada */
    const bruto = clone.textContent || '';
    const texto = bruto
      .replace(/[ \t\u00A0]+/g, ' ')
      .replace(/\n{2,}/g, '. ')
      .replace(/\s*\n\s*/g, '. ')
      .replace(/(\.\s*){2,}/g, '. ')
      .trim();

    if (!texto) return false;
    return this.speak(texto.slice(0, 6000));
  }
};

export default tts;
