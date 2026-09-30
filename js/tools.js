/* ==========================================================================
   AutenticSense — Motor das ferramentas linguísticas
   Transliteração hebraica/aramaica e grega.
   100% local: nenhuma informação sai do dispositivo.
   ========================================================================== */

/* ----------------------------- HEBRAICO ---------------------------------- */

const HE = {
  'א': ['ʾ', 'ʾ'], 'ב': ['b', 'v'], 'ג': ['g', 'g'], 'ד': ['d', 'd'],
  'ה': ['h', 'h'], 'ו': ['v', 'v'], 'ז': ['z', 'z'], 'ח': ['ḥ', 'ḥ'],
  'ט': ['ṭ', 'ṭ'], 'י': ['y', 'y'], 'כ': ['k', 'kh'], 'ך': ['k', 'kh'],
  'ל': ['l', 'l'], 'מ': ['m', 'm'], 'ם': ['m', 'm'], 'נ': ['n', 'n'],
  'ן': ['n', 'n'], 'ס': ['s', 's'], 'ע': ['ʿ', 'ʿ'], 'פ': ['p', 'f'],
  'ף': ['p', 'f'], 'צ': ['ṣ', 'ṣ'], 'ץ': ['ṣ', 'ṣ'], 'ק': ['q', 'q'],
  'ר': ['r', 'r'], 'ש': ['sh', 'sh'], 'ת': ['t', 't']
};
const HE_BGDKPT = 'בגדכפת';
const HE_VOWELS = {
  'ֱ': 'e', 'ֲ': 'a', 'ֳ': 'o',
  'ִ': 'i', 'ֵ': 'ê', 'ֶ': 'e',
  'ַ': 'a', 'ָ': 'â', 'ֹ': 'ô', 'ֻ': 'u'
};
const HE_MAQAF = '־';    /* U+05BE */
const HE_SOF = '׃';      /* U+05C3 */
const HE_DAGESH = 'ּ';
const HE_SHIN_DOT = 'ׁ';
const HE_SIN_DOT = 'ׂ';
const HE_SHEVA = 'ְ';

/* Um sinal “colável” (ponto vocálico/daguesh), excluindo maqaf e sof pasuq */
function isHeMark(ch) {
  const c = ch.codePointAt(0);
  return (c >= 0x0591 && c <= 0x05BD) || c === 0x05BF || (c >= 0x05C1 && c <= 0x05C2);
}

const VOCALS = 'aeêioôâuûā';

/**
 * Transliteração pedagógica simplificada do hebraico/aramaico.
 * Reconhece niqud, daguesh lene/forte, begadkefat, shuruq, hólam male
 * (וֹ), iode como mater (יִ / após tsere), maqaf e pátach furtivo.
 */
export function transliterateHebrew(text) {
  const chars = Array.from(String(text || '').replace(/[‎‏]/g, '').trim());
  let out = '';

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    if (ch === HE_MAQAF) { out += '-'; continue; }
    if (ch === HE_SOF) { out += ':'; continue; }

    if (HE[ch]) {
      let dagesh = false, shin = false, sin = false, vow = '', sheva = false;
      while (i + 1 < chars.length && isHeMark(chars[i + 1])) {
        const mark = chars[++i];
        if (mark === HE_DAGESH) dagesh = true;
        else if (mark === HE_SHIN_DOT) shin = true;
        else if (mark === HE_SIN_DOT) sin = true;
        else if (mark === HE_SHEVA) sheva = true;
        else if (HE_VOWELS[mark] !== undefined) vow += HE_VOWELS[mark];
        /* cantilação/acentos: ignorados */
      }

      const nextChar = chars[i + 1];
      const isWordEnd = nextChar === undefined || /[\s.,:;!?׃־"“”'()]/.test(nextChar);

      /* Shuruq: vav + daguesh => vogal u longo */
      if (ch === 'ו' && dagesh) { out += 'û'; continue; }
      /* Hólam male: וֹ como mater => só a vogal ô */
      if (ch === 'ו' && vow === 'ô') { out += 'ô'; continue; }
      /* Iode + híriq (mater) => î */
      if (ch === 'י' && vow === 'i') { out += 'î'; continue; }
      /* Iode sem sinal vocálico próprio (e sem sheva): mater após vogal longa */
      if (ch === 'י' && vow === '' && !sheva) {
        if (out.endsWith('i')) out = out.slice(0, -1) + 'î';
        else if (out.endsWith('ê') || out.endsWith('e')) { /* mater do tsere: omite */ }
        else if (out.length === 0 || !VOCALS.includes(out[out.length - 1])) out += 'y';
        continue;
      }

      let cons = (dagesh && HE_BGDKPT.includes(ch)) ? HE[ch][0] : HE[ch][1];
      if (ch === 'ש') cons = sin ? 's' : (shin ? 'sh' : 'sh');

      /* Daguesh forte: gemina a consoante (não ocorre em guturais/resh) */
      if (dagesh && !HE_BGDKPT.includes(ch) && !'אהחערו'.includes(ch) && ch !== 'ר') {
        cons += cons;
      }

      /* Pátach furtivo: “a” final após gutural é pronunciado ANTES dela */
      const gutturalFinal = 'חע'.includes(ch) || (ch === 'ה' && dagesh);
      if (gutturalFinal && vow.endsWith('a') && isWordEnd) {
        out += 'a' + cons;
        continue;
      }

      /* Sheva silencioso (nach) no fim da palavra: não se translitera */
      if (sheva && vow === '' && isWordEnd) {
        out += cons;
        continue;
      }

      out += cons + (sheva ? 'e' : '') + vow;
      continue;
    }

    /* Demais caracteres (espaços, pontuação, latim): preserva */
    out += ch;
  }

  return out.replace(/[ ]{2,}/g, ' ').trim();
}

/* ------------------------------- GREGO ----------------------------------- */

const GR = {
  'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'ē',
  'θ': 'th', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x',
  'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y',
  'φ': 'ph', 'χ': 'ch', 'ψ': 'ps', 'ω': 'ō'
};
const GR_VOWELS = 'αεηιουω';
const GR_DIPHTHONGS = {
  'αι': 'ai', 'ει': 'ei', 'οι': 'oi', 'υι': 'yi',
  'αυ': 'au', 'ευ': 'eu', 'ου': 'ou', 'ηυ': 'ēu', 'ωυ': 'ōu'
};
const GR_ROUGH = '̔';          /* U+0314 espírito rude */
const GR_DIAERESIS = '̈';       /* U+0308 cancela o ditongo */

/** Transliteração acadêmica do grego (estilo SBL simplificado). */
export function transliterateGreek(text) {
  return String(text || '')
    .split(/(\s+)/)
    .map((seg) => (/^\s+$/.test(seg) || seg === '' ? seg : grWord(seg)))
    .join('');
}

function grWord(word) {
  const clusters = [];
  for (const ch of Array.from(word.normalize('NFD'))) {
    if (/\p{Mark}/u.test(ch)) {
      if (clusters.length) clusters[clusters.length - 1].marks.push(ch);
    } else {
      clusters.push({ base: ch, marks: [] });
    }
  }

  let out = '';
  let started = false;

  for (let i = 0; i < clusters.length; i++) {
    const c = clusters[i];
    const lower = c.base.toLowerCase();
    if (!(lower in GR)) { out += c.base; continue; }

    const next = clusters[i + 1];
    const nextLower = next ? next.base.toLowerCase() : '';
    let t;

    /* Gama nasal: γ antes de γ, κ, χ, ξ => n */
    if (lower === 'γ' && 'γκχξ'.includes(nextLower)) {
      t = 'n';
    } else if (
      GR_VOWELS.includes(lower) && next && nextLower in GR &&
      GR_DIPHTHONGS[lower + nextLower] && !next.marks.includes(GR_DIAERESIS)
    ) {
      t = GR_DIPHTHONGS[lower + nextLower];
      i += 1;
    } else {
      t = GR[lower];
    }

    if (!started) {
      if (c.marks.includes(GR_ROUGH)) t = lower === 'ρ' ? 'rh' : 'h' + t;
      if (c.base !== lower && c.base.toUpperCase() === c.base) {
        t = t.charAt(0).toUpperCase() + t.slice(1);
      }
      started = true;
    }
    out += t;
  }
  return out;
}

/* --------------------------- Utilidades ---------------------------------- */

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}
