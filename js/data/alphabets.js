/* ==========================================================================
   AutenticSense — Dados: alfabetos e sinais das línguas bíblicas
   ========================================================================== */

/* Aleph-Bet hebraico (22 consoantes; 5 possuem forma final — sofit) */
export const hebrewAlphabet = [
  { g: 'א', name: 'Álefe',  tr: 'ʾ',  som: 'Gutural suave; consoante “muda” que carrega vogal (como a pausa em “uh-oh”).' },
  { g: 'ב', name: 'Bete',   tr: 'b/v', som: '“b” com daguesh (בּ); “v” sem daguesh.' },
  { g: 'ג', name: 'Guímel', tr: 'g',  som: '“g” de “gato”.' },
  { g: 'ד', name: 'Dálete', tr: 'd',  som: '“d” de “dedo”.' },
  { g: 'ה', name: 'Hê',     tr: 'h',  som: '“h” aspirado (como em inglês “house”); no fim de palavra costuma ser muda.' },
  { g: 'ו', name: 'Vav',    tr: 'v',  som: '“v”; antes pronunciado “w”. Também serve como vogal (u/ô).' },
  { g: 'ז', name: 'Záin',   tr: 'z',  som: '“z” de “zero”.' },
  { g: 'ח', name: 'Hete',   tr: 'ḥ',  som: '“h” gutural forte, como o “j” espanhol em “Jamón”.' },
  { g: 'ט', name: 'Tete',   tr: 'ṭ',  som: '“t” enfático, com a língua no céu da boca.' },
  { g: 'י', name: 'Iode',   tr: 'y',  som: '“i” de “ioiô”; a menor letra do alfabeto.' },
  { g: 'כ', name: 'Kafe',   tr: 'k/kh', sofit: 'ך', som: '“k” com daguesh (כּ); “kh” aspirado sem daguesh. Forma final: ך.' },
  { g: 'ל', name: 'Lâmede', tr: 'l',  som: '“l” de “lua”. É a letra mais alta.' },
  { g: 'מ', name: 'Mem',    tr: 'm',  sofit: 'ם', som: '“m”. Forma final: ם (caixa fechada).' },
  { g: 'נ', name: 'Nune',   tr: 'n',  sofit: 'ן', som: '“n”. Forma final: ן (cauda longa).' },
  { g: 'ס', name: 'Sâmeque', tr: 's', som: '“s” de “só”.' },
  { g: 'ע', name: 'Áin',    tr: 'ʿ',  som: 'Gutural profunda, contração no fundo da garganta.' },
  { g: 'פ', name: 'Pê',     tr: 'p/f', sofit: 'ף', som: '“p” com daguesh (פּ); “f” sem daguesh. Forma final: ף.' },
  { g: 'צ', name: 'Tsade',  tr: 'ṣ',  sofit: 'ץ', som: '“ts” enfático, como em “pizza” falado rápido. Forma final: ץ.' },
  { g: 'ק', name: 'Qofe',   tr: 'q',  som: '“k” gutural, formado no fundo da boca.' },
  { g: 'ר', name: 'Rexe',   tr: 'r',  som: '“r” vibrante suave (uvular), como no francês.' },
  { g: 'ש', name: 'Sine',   tr: 'š/ś', som: '“sh” com ponto à direita (שׁ); “s” com ponto à esquerda (שׂ).' },
  { g: 'ת', name: 'Tav',    tr: 't',  som: '“t” de “tela”.' }
];

/* Sinais vocálicos (niqud) — exemplos sobre a letra ב   */
export const niqud = [
  { name: 'Pátach',       ex: 'בַ',  tr: 'a',  som: '“a” curto (pá).' },
  { name: 'Qamats',       ex: 'בָ',  tr: 'ā',  som: '“a” longo; às vezes “o” (qamats hatuf).' },
  { name: 'Tsêrê',        ex: 'בֵ',  tr: 'ē',  som: '“ê” fechado (rede).' },
  { name: 'Ségol',        ex: 'בֶ',  tr: 'e',  som: '“é” aberto (pé).' },
  { name: 'Híriq',        ex: 'בִ',  tr: 'i',  som: '“i” (vida).' },
  { name: 'Hólam',        ex: 'בֹ',  tr: 'ō',  som: '“ô” fechado (avô).' },
  { name: 'Qibbuts',      ex: 'בֻ',  tr: 'u',  som: '“u” curto.' },
  { name: 'Shuruq',       ex: 'בוּ', tr: 'ū',  som: '“u” longo (vav com daguesh).' },
  { name: 'Sheva',        ex: 'בְ',  tr: 'ə',  som: '“e” ultrarrápido (naʿ) ou mudo (nach).' },
  { name: 'Hataf Pátach', ex: 'חֲ',  tr: 'a',  som: 'Meio “a”, sob guturais.' },
  { name: 'Hataf Ségol',  ex: 'חֱ',  tr: 'e',  som: 'Meio “e”, sob guturais.' },
  { name: 'Hataf Qamats', ex: 'חֳ',  tr: 'o',  som: 'Meio “o”, sob guturais.' }
];

/* Consoantes Begadkefat (plosiva ↔ fricativa, conforme o daguesh lene) */
export const begadkefat = [
  { g: 'בּ', plosiva: 'b', fric: 'ב', fricTr: 'v'  },
  { g: 'גּ', plosiva: 'g', fric: 'ג', fricTr: 'gh' },
  { g: 'דּ', plosiva: 'd', fric: 'ד', fricTr: 'dh' },
  { g: 'כּ', plosiva: 'k', fric: 'כ', fricTr: 'kh' },
  { g: 'פּ', plosiva: 'p', fric: 'פ', fricTr: 'f'  },
  { g: 'תּ', plosiva: 't', fric: 'ת', fricTr: 'th' }
];

/* Alfabeto grego (24 letras) */
export const greekAlphabet = [
  { uc: 'Α', lc: 'α',   name: 'Alfa',     tr: 'a',  som: '“a” (casa).' },
  { uc: 'Β', lc: 'β',   name: 'Beta',     tr: 'b',  som: '“b”; no fim da era koiné, tendia a “v”.' },
  { uc: 'Γ', lc: 'γ',   name: 'Gama',     tr: 'g',  som: '“g”; antes de γ, κ, χ, ξ soa “n” (ἄγγελος → ánguélos).' },
  { uc: 'Δ', lc: 'δ',   name: 'Delta',    tr: 'd',  som: '“d”.' },
  { uc: 'Ε', lc: 'ε',   name: 'Épsilon',  tr: 'e',  som: '“e” curto (rede).' },
  { uc: 'Ζ', lc: 'ζ',   name: 'Zeta',     tr: 'z',  som: '“dz/zd”; na koiné, “z”.' },
  { uc: 'Η', lc: 'η',   name: 'Eta',      tr: 'ē',  som: '“ê” longo.' },
  { uc: 'Θ', lc: 'θ',   name: 'Teta',     tr: 'th', som: '“t” aspirado (como “th” inglês em “thing”).' },
  { uc: 'Ι', lc: 'ι',   name: 'Iota',     tr: 'i',  som: '“i”.' },
  { uc: 'Κ', lc: 'κ',   name: 'Capa',     tr: 'k',  som: '“k/c”.' },
  { uc: 'Λ', lc: 'λ',   name: 'Lambda',   tr: 'l',  som: '“l”.' },
  { uc: 'Μ', lc: 'μ',   name: 'Mi',       tr: 'm',  som: '“m”.' },
  { uc: 'Ν', lc: 'ν',   name: 'Ni',       tr: 'n',  som: '“n”.' },
  { uc: 'Ξ', lc: 'ξ',   name: 'Xi',       tr: 'x',  som: '“cs/ks” (táxi).' },
  { uc: 'Ο', lc: 'ο',   name: 'Ômicron',  tr: 'o',  som: '“o” curto (nó).' },
  { uc: 'Π', lc: 'π',   name: 'Pi',       tr: 'p',  som: '“p”.' },
  { uc: 'Ρ', lc: 'ρ',   name: 'Rô',       tr: 'r',  som: '“r” vibrante; no início de palavra leva espírito rude: “rh”.' },
  { uc: 'Σ', lc: 'σ/ς', name: 'Sigma',    tr: 's',  som: '“s”; ς é a forma usada no fim da palavra.' },
  { uc: 'Τ', lc: 'τ',   name: 'Tau',      tr: 't',  som: '“t”.' },
  { uc: 'Υ', lc: 'υ',   name: 'Ípsilon',  tr: 'y',  som: '“u” fechado (como o “u” francês); translitera-se “y”.' },
  { uc: 'Φ', lc: 'φ',   name: 'Fi',       tr: 'ph', som: '“p” aspirado; hoje “f”.' },
  { uc: 'Χ', lc: 'χ',   name: 'Qui',      tr: 'ch', som: '“kh”, como o “ch” escocês de “loch”.' },
  { uc: 'Ψ', lc: 'ψ',   name: 'Psi',      tr: 'ps', som: '“ps” (salmo).' },
  { uc: 'Ω', lc: 'ω',   name: 'Ômega',    tr: 'ō',  som: '“ô” longo.' }
];

/* Diftongos gregos mais comuns */
export const greekDiphthongs = [
  { g: 'αι', tr: 'ai', som: '“ai” (pai)' },
  { g: 'ει', tr: 'ei', som: '“ei” (leite)' },
  { g: 'οι', tr: 'oi', som: '“oi” (herói)' },
  { g: 'υι', tr: 'ui', som: '“ui” (cuidado)' },
  { g: 'αυ', tr: 'au', som: '“au” (causa)' },
  { g: 'ευ', tr: 'eu', som: '“eu” (Europa)' },
  { g: 'ου', tr: 'ou', som: '“u” longo (coruja)' }
];

/* Onde o aramaico aparece na Bíblia */
export const aramaicPassages = [
  { ref: 'Dn 2.4b–7.28', descricao: 'O bloco central de Daniel: sonhos, fornalha, cova dos leões e visões — o maior trecho aramaico da Bíblia.' },
  { ref: 'Ed 4.8–6.18',  descricao: 'Correspondência oficial do Império Persa sobre a reconstrução de Jerusalém.' },
  { ref: 'Ed 7.12–26',   descricao: 'A carta do rei Artaxerxes autorizando Esdras.' },
  { ref: 'Jr 10.11',     descricao: 'Um único versículo em aramaico, dirigido aos exilados: uma declaração contra os ídolos.' },
  { ref: 'Gn 31.47',     descricao: 'Labão chama o memorial de “Jegar-Saaduta” (“monte de testemunho”, em aramaico).' }
];

/* Aramaico no Novo Testamento */
export const aramaicInNT = [
  { expr: 'טליתא קומי · Talita cumi', fonte: 'Mc 5.41', sign: '“Menina, eu te digo: levanta-te!” — Jesus ressuscita a filha de Jairo.' },
  { expr: 'אלי אלי למא שבקתני · Eli, Eli, lemá sabactâni', fonte: 'Mt 27.46', sign: '“Deus meu, Deus meu, por que me desamparaste?” — citação do Sl 22.1.' },
  { expr: 'ܡܪܢ ܐܬܐ · Maranatá', fonte: '1Co 16.22', sign: '“Vem, Senhor!” ou “Nosso Senhor veio” — aclamação da igreja primitiva.' },
  { expr: 'אבא · Abá', fonte: 'Mc 14.36', sign: '“Pai” — o endereço íntimo de Jesus a Deus, preservado no original.' },
  { expr: 'כיפא · Cefas', fonte: 'Jo 1.42', sign: '“Pedra” — o nome aramaico de Pedro (traduzido como Πέτρος).' }
];
