/* ==========================================================================
   AutenticSense — Dados: versículos interlineares anotados
   Glosas pedagógicas sobre textos originais de domínio público
   (tradição massorética / texto grego crítico).
   ========================================================================== */

export const verses = [
  {
    id: 'gn11',
    ref: 'Gênesis 1.1',
    lang: 'he',
    langLabel: 'Hebraico Bíblico',
    dir: 'rtl',
    text: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ',
    traducao: 'No princípio, Deus criou os céus e a terra.',
    nota: 'Observe a ordem hebraica: verbos costumam abrir a oração. בְּרֵאשִׁית (bereshit) é a primeira palavra da Bíblia — e dá nome ao livro de Gênesis em hebraico.',
    words: [
      { w: 'בְּרֵאשִׁית', tr: 'bereshít', lemma: 'רֵאשִׁית', morph: 'Subst. fem. + preposição בְּ (“em”)', gloss: 'No princípio' },
      { w: 'בָּרָא', tr: 'bará', lemma: 'בָּרָא', morph: 'Verbo Qal, perfeito, 3.ª masc. sing.', gloss: 'criou' },
      { w: 'אֱלֹהִים', tr: 'Elohím', lemma: 'אֱלֹהִים', morph: 'Subst. masc. (plural intensivo)', gloss: 'Deus' },
      { w: 'אֵת', tr: 'et', lemma: 'אֵת', morph: 'Partícula do objeto direto (não se traduz)', gloss: '(objeto)' },
      { w: 'הַשָּׁמַיִם', tr: 'hashamáim', lemma: 'שָׁמַיִם', morph: 'Subst. masc. pl. + artigo הַ', gloss: 'os céus' },
      { w: 'וְאֵת', tr: 've·ét', lemma: 'וְ + אֵת', morph: 'Conjunção “e” + partícula do objeto', gloss: 'e' },
      { w: 'הָאָרֶץ', tr: 'haárets', lemma: 'אֶרֶץ', morph: 'Subst. fem. sing. + artigo הַ', gloss: 'a terra' }
    ]
  },
  {
    id: 'dn525',
    ref: 'Daniel 5.25',
    lang: 'arc',
    langLabel: 'Aramaico Bíblico',
    dir: 'rtl',
    text: 'מְנֵא מְנֵא תְּקֵל וּפַרְסִין',
    traducao: 'MENE, MENE, TEQUEL e PARSIM — a escrita na parede do palácio de Belsazar.',
    nota: 'Quatro palavras que mudaram um império. פַרְסִין é um jogo de palavras com פָּרַס (Pérsia): o reino seria “dividido” para os persas. Este é um dos textos aramaicos mais famosos da Bíblia.',
    words: [
      { w: 'מְנֵא', tr: 'menê', lemma: 'מְנָא', morph: 'Partícipio passivo (Peal) de “contar”', gloss: 'contado' },
      { w: 'מְנֵא', tr: 'menê', lemma: 'מְנָא', morph: 'Repetição enfática (como em “na verdade, na verdade”)', gloss: 'contado' },
      { w: 'תְּקֵל', tr: 'teqêl', lemma: 'תְּקַל', morph: 'Partícipio passivo (Peal) de “pesar”', gloss: 'pesado (na balança)' },
      { w: 'וּפַרְסִין', tr: 'ufarsín', lemma: 'פְּרַס', morph: 'Conjunção וּ + “dividir” no plural', gloss: 'e dividido (os persas)' }
    ]
  },
  {
    id: 'jo11',
    ref: 'João 1.1',
    lang: 'grc',
    langLabel: 'Grego Koiné',
    dir: 'ltr',
    text: 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.',
    traducao: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.',
    nota: 'João ecoa deliberadamente Gênesis 1.1 (ἐν ἀρχῇ). No último colo, θεός aparece sem artigo (anartro), destacando a qualidade/natureza do Logos — detalhe que só o grego revela.',
    words: [
      { w: 'Ἐν', tr: 'en', lemma: 'ἐν', morph: 'Preposição + dativo', gloss: 'em / no' },
      { w: 'ἀρχῇ', tr: 'archē', lemma: 'ἀρχή', morph: 'Subst. fem., dativo sing.', gloss: 'princípio' },
      { w: 'ἦν', tr: 'ēn', lemma: 'εἰμί', morph: 'Verbo “ser”, imperfeito, 3.ª sing.', gloss: 'era / existia' },
      { w: 'ὁ', tr: 'ho', lemma: 'ὁ', morph: 'Artigo masc. nominativo', gloss: 'o' },
      { w: 'λόγος', tr: 'logos', lemma: 'λόγος', morph: 'Subst. masc. nominativo', gloss: 'Verbo / Palavra' },
      { w: 'καί', tr: 'kai', lemma: 'καί', morph: 'Conjunção coordenativa', gloss: 'e' },
      { w: 'ὁ', tr: 'ho', lemma: 'ὁ', morph: 'Artigo masc. nominativo', gloss: 'o' },
      { w: 'λόγος', tr: 'logos', lemma: 'λόγος', morph: 'Subst. masc. nominativo', gloss: 'Verbo' },
      { w: 'ἦν', tr: 'ēn', lemma: 'εἰμί', morph: 'Verbo “ser”, imperfeito, 3.ª sing.', gloss: 'estava' },
      { w: 'πρός', tr: 'pros', lemma: 'πρός', morph: 'Preposição + acusativo: direção/relação', gloss: 'com / junto de' },
      { w: 'τόν', tr: 'ton', lemma: 'ὁ', morph: 'Artigo masc. acusativo', gloss: '(o)' },
      { w: 'θεόν', tr: 'theon', lemma: 'θεός', morph: 'Subst. masc. acusativo sing.', gloss: 'Deus' },
      { w: 'καί', tr: 'kai', lemma: 'καί', morph: 'Conjunção coordenativa', gloss: 'e' },
      { w: 'θεός', tr: 'theos', lemma: 'θεός', morph: 'Nominativo anartro (sem artigo): qualidade', gloss: 'Deus (era)' },
      { w: 'ἦν', tr: 'ēn', lemma: 'εἰμί', morph: 'Verbo “ser”, imperfeito, 3.ª sing.', gloss: 'era' },
      { w: 'ὁ', tr: 'ho', lemma: 'ὁ', morph: 'Artigo masc. nominativo', gloss: 'o' },
      { w: 'λόγος', tr: 'logos', lemma: 'λόγος', morph: 'Subst. masc. nominativo', gloss: 'Verbo' }
    ]
  }
];

export function verseById(id) {
  return verses.find((v) => v.id === id) || verses[0];
}
