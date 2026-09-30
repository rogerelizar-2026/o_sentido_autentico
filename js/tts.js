/* ==========================================================================
   AutenticSense — Síntese de voz (TTS) em pt-BR via Web Speech API
   Suporta: ler página inteira, ler trechos (botões data-speak), parar.
   ========================================================================== */

const state = { speaking: false, listeners: new Set() };
let voices = [];
let ptVoice = null;

function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  voices = window.speechSynthesis.getVoices();
  ptVoice =
    voices.find((v) => /pt[-_]BR/i.test(v.lang)) ||
    voices.find((v) => /^pt/i.test(v.lang)) ||
    null;
}

if ('speechSynthesis' in window) {
  pickVoice();
  window.speechSynthesis.addEventListener('voiceschanged', pickVoice);
}

function setState(on) {
  state.speaking = on;
  state.listeners.forEach((cb) => cb(on));
}

function splitIntoChunks(text, max = 240) {
  const sentences = text.replace(/\s+/g, ' ').match(/[^.!?;:…]+[.!?;:…]*\s*/g) || [text];
  const chunks = [];
  let buf = '';
  for (const s of sentences) {
    if ((buf + s).length > max && buf) { chunks.push(buf.trim()); buf = s; }
    else buf += s;
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks;
}

export const tts = {
  get supported() { return 'speechSynthesis' in window; },
  get speaking() { return state.speaking; },
  onState(cb) { state.listeners.add(cb); return () => state.listeners.delete(cb); },

  speak(text, { lang = 'pt-BR', rate = 0.96 } = {}) {
    if (!this.supported || !text) return false;
    this.stop();
    const chunks = splitIntoChunks(String(text));
    let done = 0;
    setState(true);
    for (const chunk of chunks) {
      const u = new SpeechSynthesisUtterance(chunk);
      u.lang = lang;
      if (ptVoice && lang === 'pt-BR') u.voice = ptVoice;
      u.rate = rate;
      u.pitch = 1;
      u.onend = u.onerror = () => { if (++done >= chunks.length) setState(false); };
      window.speechSynthesis.speak(u);
    }
    return true;
  },

  stop() {
    if (!this.supported) return;
    window.speechSynthesis.cancel();
    setState(false);
  },

  /** Lê em voz alta o conteúdo principal da view corrente. */
  readMain() {
    const main = document.querySelector('main#conteudo');
    if (!main) return false;
    const clone = main.cloneNode(true);
    clone.querySelectorAll('button, [aria-hidden="true"], script, style, svg, .sr-only')
      .forEach((el) => el.remove());
    const text = (clone.innerText || clone.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
    return this.speak(text.slice(0, 4800));
  }
};
