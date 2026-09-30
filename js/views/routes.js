/* AutenticSense — Mapa de rotas e itens de navegação
   Estrutura alinhada ao mapa mental "O Sentido Autêntico". */

import home from './home.js';
import rota from './rota.js';
import hebraico from './hebraico.js';
import aramaico from './aramaico.js';
import grego from './grego.js';
import ferramentas from './ferramentas.js';
import biblioteca from './biblioteca.js';
import exegese from './exegese.js';
import sobre from './sobre.js';
import notfound from './notfound.js';

export const routes = [
  { path: '/', view: home },
  { path: '/rota', view: rota },
  { path: '/hebraico', view: hebraico },
  { path: '/aramaico', view: aramaico },
  { path: '/grego', view: grego },
  { path: '/ferramentas', view: ferramentas },
  { path: '/biblioteca', view: biblioteca },
  { path: '/exegese', view: exegese },
  { path: '/sobre', view: sobre },
  { path: '*', view: notfound }
];

/* top !== false → aparece também na barra superior (desktop) */
export const navItems = [
  { path: '/', label: 'Início', desc: 'Visão geral do portal', icon: 'home' },
  { path: '/rota', label: 'Rota', desc: 'Níveis, metodologia e ritmo diário', icon: 'compass' },
  { path: '/hebraico', label: 'Hebraico', desc: 'Aleph-Bet, niqud e Gênesis 1.1', icon: 'scroll' },
  { path: '/aramaico', label: 'Aramaico', desc: 'Daniel, Esdras e a voz de Jesus', icon: 'text' },
  { path: '/grego', label: 'Grego Koiné', desc: 'Alfabeto, casos e João 1.1', icon: 'alpha' },
  { path: '/ferramentas', label: 'Ferramentas', desc: 'Interlinear e transliteração', icon: 'tools' },
  { path: '/biblioteca', label: 'Livros', desc: 'Ross, Rega, Mounce, Wallace e mais', icon: 'book' },
  { path: '/exegese', label: 'Exegese', desc: 'Método integrado em 7 passos', icon: 'sparkle', top: false },
  { path: '/sobre', label: 'Sobre', desc: 'Propósitos, tecnologia e instituições', icon: 'info', top: false }
];
