/* ==========================================================================
 * metodos.js — explorador dos 25 métodos analisados (páginas de hebraico e grego).
 *
 * UI/UX: em vez de uma tabela densa de 8 colunas (que exigia rolagem lateral
 * no celular e obrigava a ler 25 linhas para comparar), a seção passa a ter:
 *   1. barra de controles — busca, chips de grupo didático, ordenação,
 *      filtro de híbridos e contador anunciado em região viva;
 *   2. resumo comparativo do conjunto filtrado (derivado, nunca inventado);
 *   3. cartões de método com barras de Eficiência/Complexidade/Tempo;
 *   4. tabela comparativa completa dentro de <details>, com cabeçalho
 *      ordenável (aria-sort) e tecla de acesso.
 *
 * Honestidade: todo número sai de data/metodos.json; Eficiência (0–10),
 * Complexidade (1–10) e Tempo (semanas) são estimativas editoriais de
 * setembro de 2026 e isso fica visível na interface — nada é "medido".
 * ========================================================================== */

import { el, clear, normalize } from './ui.js';
import { loadMetodos } from './charts.js';

const ESTIMATIVA = 'Estimativas editoriais de setembro de 2026 (0–10 e semanas) — para comparar perfis, não são resultados de pesquisa.';

const ORDENACOES = {
  eficiencia: { rotulo: 'Maior eficiência primeiro', comparar: (a, b) => b.eficiencia - a.eficiencia || a.tempoMedioSemanas - b.tempoMedioSemanas },
  tempo: { rotulo: 'Retorno mais rápido (menos semanas)', comparar: (a, b) => a.tempoMedioSemanas - b.tempoMedioSemanas || b.eficiencia - a.eficiencia },
  complexidade: { rotulo: 'Menor complexidade primeiro', comparar: (a, b) => a.complexidade - b.complexidade || b.eficiencia - a.eficiencia },
  nome: { rotulo: 'Nome (A–Z)', comparar: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR') }
};

const COLUNAS_TABELA = [
  { chave: 'indice', rotulo: '#', fixa: true },
  { chave: 'nome', rotulo: 'Método', ordenavel: true },
  { chave: 'categoria', rotulo: 'Grupo didático', ordenavel: true },
  { chave: 'foco', rotulo: 'Foco', ordenavel: true },
  { chave: 'eficiencia', rotulo: 'Eficiência (est.)', ordenavel: true, numerica: true },
  { chave: 'complexidade', rotulo: 'Complexidade (est.)', ordenavel: true, numerica: true },
  { chave: 'tempoMedioSemanas', rotulo: 'Semanas (est.)', ordenavel: true, numerica: true },
  { chave: 'descricao', rotulo: 'Descrição e aplicação', fixa: true }
];

function pct(valor, max) {
  return Math.max(0, Math.min(100, (Number(valor) / max) * 100));
}

function nf(valor) {
  return Number(valor).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}

function badge(texto, classe) {
  return el('span', { class: 'osa-badge' + (classe ? ' ' + classe : ''), text: texto });
}

/** Barra decorativa — o valor numérico sempre aparece em texto ao lado. */
function barra(valor, max, classe) {
  return el('span', { class: 'osa-bar ' + (classe || ''), 'aria-hidden': 'true' }, [
    el('span', { class: 'osa-bar__fill', style: `width:${pct(valor, max).toFixed(1)}%` })
  ]);
}

function metrica(rotulo, valorTexto, valor, max, classe, descricaoLonga) {
  return el('div', { class: 'osa-metodo__metric', title: descricaoLonga || rotulo }, [
    el('span', { class: 'osa-metodo__metric-label', text: rotulo }),
    el('span', { class: 'visually-hidden', text: (descricaoLonga || rotulo) + ': ' }),
    el('span', { class: 'osa-metodo__metric-value', text: valorTexto }),
    barra(valor, max, classe)
  ]);
}

function cartaoMetodo(m, i, data, langKey) {
  const apl = langKey === 'he' ? m.aplicacaoHebraico : m.aplicacaoGrego;
  const rotuloApl = langKey === 'he' ? 'No hebraico e aramaico' : 'No grego koiné';
  const idDetalhe = `detalhe-${m.id}`;

  // Em telas estreitas o detalhe começa recolhido (a lista fica escaneável);
  // em telas largas aparece com 4 linhas e o botão libera o texto inteiro.
  const estreito = window.matchMedia('(max-width: 759px)').matches;

  const detalhe = el('div', { class: 'osa-metodo__detalhe', id: idDetalhe }, [
    el('p', { class: 'osa-metodo__desc', text: m.descricao }),
    apl ? el('p', { class: 'osa-metodo__aplicacao' }, [
      el('strong', { text: rotuloApl + ': ' }),
      document.createTextNode(apl)
    ]) : null
  ]);
  if (estreito) detalhe.hidden = true;

  // aria-expanded reflete se o TEXTO está expandido (no celular o bloco
  // inteiro começa oculto; no desktop ele aparece com 4 linhas).
  const rotuloFechado = estreito ? 'Ver descrição e aplicação' : 'Ver descrição completa';
  const rotuloAberto = estreito ? 'Recolher descrição e aplicação' : 'Recolher descrição';
  const btnMais = el('button', {
    type: 'button', class: 'osa-metodo__mais', 'aria-expanded': 'false',
    'aria-controls': idDetalhe, text: rotuloFechado
  });
  btnMais.addEventListener('click', () => {
    const expandido = btnMais.getAttribute('aria-expanded') === 'true';
    if (expandido) {
      detalhe.classList.remove('is-expandida');
      if (estreito) detalhe.hidden = true;
      btnMais.setAttribute('aria-expanded', 'false');
      btnMais.textContent = rotuloFechado;
    } else {
      detalhe.hidden = false;
      detalhe.classList.add('is-expandida');
      btnMais.setAttribute('aria-expanded', 'true');
      btnMais.textContent = rotuloAberto;
    }
  });

  return el('li', { class: 'osa-metodo', 'data-metodo-id': m.id }, [
    el('div', { class: 'osa-metodo__head' }, [
      el('span', { class: 'osa-metodo__rank', 'aria-hidden': 'true', text: String(i + 1) }),
      el('h3', { class: 'osa-metodo__nome', text: m.nome }),
      el('span', { class: 'osa-metodo__badges' }, [
        badge(data.gruposDidaticos[m.categoria] || m.categoria, 'osa-badge--navy'),
        m.hibrido ? badge('Híbrido', 'osa-badge--gold') : null
      ])
    ]),
    el('div', { class: 'osa-metodo__metrics' }, [
      metrica('Eficiência (est.)', `${nf(m.eficiencia)}/10`, m.eficiencia, 10, 'osa-bar--eficiencia',
        'Eficiência estimada (0 a 10)'),
      metrica('Complex. (est.)', `${nf(m.complexidade)}/10`, m.complexidade, 10, 'osa-bar--complexidade',
        'Complexidade estimada (1 a 10)'),
      metrica('Retorno (est.)', `${nf(m.tempoMedioSemanas)} sem.`, m.tempoMedioSemanas, 16, 'osa-bar--tempo',
        'Semanas até retorno prático perceptível (estimativa)')
    ]),
    m.foco && m.foco.length
      ? el('ul', { class: 'osa-metodo__foco', 'aria-label': 'Focos do método' },
        m.foco.map((f) => el('li', { class: 'osa-tag', text: f })))
      : null,
    detalhe,
    btnMais
  ]);
}

function linhaTabela(m, i, data, langKey) {
  const apl = langKey === 'he' ? m.aplicacaoHebraico : m.aplicacaoGrego;
  const descCell = el('td', { class: 'osa-metodos__td-desc' });
  descCell.appendChild(document.createTextNode(m.descricao));
  if (apl) {
    descCell.appendChild(el('br'));
    descCell.appendChild(el('em', { text: (langKey === 'he' ? 'No hebraico/aramaico: ' : 'No grego: ') + apl }));
  }
  return el('tr', { 'data-metodo-id': m.id }, [
    el('th', { scope: 'row', class: 'osa-metodos__td-num', text: String(i + 1) }),
    el('td', { text: m.nome }),
    el('td', { text: data.gruposDidaticos[m.categoria] || m.categoria }),
    el('td', { text: m.foco.join(', ') }),
    el('td', { class: 'osa-metodos__td-num', text: `${nf(m.eficiencia)}/10` }),
    el('td', { class: 'osa-metodos__td-num', text: nf(m.complexidade) }),
    el('td', { class: 'osa-metodos__td-num', text: nf(m.tempoMedioSemanas) }),
    descCell
  ]);
}

export async function initMethodsExplorer(containerId) {
  const host = document.getElementById(containerId);
  if (!host) return;
  let data;
  try {
    data = await loadMetodos();
  } catch {
    clear(host);
    host.appendChild(el('p', { class: 'osa-unavailable', text: 'Análise dos métodos indisponível (dados locais não carregados).' }));
    return;
  }

  const langKey = document.body.dataset.lang; // 'he' ou 'grc'
  const estado = { busca: '', grupo: '', hibridos: false, ordem: 'eficiencia', coluna: 'eficiencia', direcao: 'desc' };

  /* ---------------- estrutura ---------------- */
  const campoBusca = el('input', {
    type: 'search', class: 'osa-input', id: containerId + '-busca',
    placeholder: 'Buscar por nome, foco ou descrição', autocomplete: 'off'
  });
  const chips = el('div', { class: 'osa-chips', role: 'group', 'aria-label': 'Filtrar por grupo didático' });
  const select = el('select', { class: 'osa-select', id: containerId + '-ordem', 'aria-label': 'Ordenar métodos' });
  Object.entries(ORDENACOES).forEach(([k, v]) => select.appendChild(el('option', { value: k, text: v.rotulo })));
  const checkHibridos = el('input', { type: 'checkbox', id: containerId + '-hibridos' });
  const btnLimpar = el('button', { type: 'button', class: 'osa-btn osa-btn--outline osa-btn--sm', text: 'Limpar filtros' });
  const contador = el('p', { class: 'osa-metodos__count', role: 'status', 'aria-live': 'polite' });
  const resumo = el('div', { class: 'osa-metodos__resumo' });
  const lista = el('ul', { class: 'osa-metodos__grid' });
  const corpoTabela = el('tbody');
  const ths = {};

  const tabela = el('table', { class: 'osa-table' }, [
    el('caption', { text: 'Tabela comparativa dos 25 métodos — ' + ESTIMATIVA }),
    el('thead', {}, [
      el('tr', {}, COLUNAS_TABELA.map((c) => {
        const th = el('th', { scope: 'col', class: c.numerica ? 'osa-metodos__td-num' : null });
        if (c.ordenavel) {
          const btn = el('button', {
            type: 'button', class: 'osa-th-sort', 'data-coluna': c.chave,
            text: c.rotulo,
            'aria-label': 'Ordenar por ' + c.rotulo
          });
          th.appendChild(btn);
          th.setAttribute('aria-sort', 'none');
          ths[c.chave] = th;
        } else {
          th.textContent = c.rotulo;
        }
        return th;
      }))
    ]),
    corpoTabela
  ]);

  const detalhesTabela = el('details', { class: 'osa-metodos__tabela', 'data-abrir-impressao': '1' }, [
    el('summary', { class: 'osa-accordion__summary', text: 'Ver tabela comparativa completa (25 métodos × 8 colunas)' }),
    el('p', { class: 'small muted', text: 'Cabeçalhos ordenáveis por teclado. No celular, a tabela rola na horizontal; os cartões acima já mostram os mesmos valores.' }),
    el('div', { class: 'osa-table-scroll', role: 'region', tabindex: '0', 'aria-label': 'Tabela dos 25 métodos de aprendizado analisados' }, [tabela])
  ]);

  const raiz = el('div', { class: 'osa-metodos' }, [
    el('div', { class: 'osa-metodos__toolbar', role: 'group', 'aria-label': 'Filtrar e ordenar os 25 métodos' }, [
      el('div', { class: 'osa-field', style: 'margin:0' }, [
        el('label', { for: campoBusca.id, text: 'Buscar método' }),
        campoBusca,
        el('span', { class: 'osa-hint', text: 'Ex.: “leitura”, “memória”, “anki” — ignora acentos e maiúsculas.' })
      ]),
      el('div', { class: 'osa-field', style: 'margin:0' }, [
        el('label', { text: 'Grupo didático' }),
        chips,
        el('p', { class: 'small muted', style: 'margin:.35rem 0 0', text: ESTIMATIVA })
      ]),
      el('div', { class: 'osa-metodos__controls' }, [
        el('div', { class: 'osa-field', style: 'margin:0' }, [
          el('label', { for: select.id, text: 'Ordenar por' }),
          select
        ]),
        el('label', { class: 'osa-check', for: checkHibridos.id, style: 'margin:0' }, [
          checkHibridos,
          el('span', { text: 'Somente híbridos' })
        ]),
        btnLimpar
      ])
    ]),
    contador,
    resumo,
    lista,
    detalhesTabela
  ]);

  clear(host);
  host.appendChild(raiz);

  /* ---------------- filtros ---------------- */
  const filtrados = () => {
    const termo = normalize(estado.busca);
    return data.metodos.filter((m) => {
      if (estado.grupo && m.categoria !== estado.grupo) return false;
      if (estado.hibridos && !m.hibrido) return false;
      if (!termo) return true;
      const alvo = normalize([m.nome, m.descricao, m.aplicacaoHebraico, m.aplicacaoGrego, m.foco.join(' '), data.gruposDidaticos[m.categoria] || ''].join(' '));
      return alvo.includes(termo);
    });
  };

  const ordenados = (lista) => {
    const m = ORDENACOES[estado.ordem] || ORDENACOES.eficiencia;
    return [...lista].sort(m.comparar);
  };

  function renderChips() {
    clear(chips);
    const grupos = Object.entries(data.gruposDidaticos);
    const total = (c) => data.metodos.filter((m) => m.categoria === c).length;
    const todos = el('button', {
      type: 'button', class: 'osa-chip', 'aria-pressed': estado.grupo === '' ? 'true' : 'false',
      text: `Todos (${data.metodos.length})`,
      onclick: () => { estado.grupo = ''; render(); }
    });
    chips.appendChild(todos);
    for (const [k, rotulo] of grupos) {
      chips.appendChild(el('button', {
        type: 'button', class: 'osa-chip', 'aria-pressed': estado.grupo === k ? 'true' : 'false',
        text: `${rotulo} (${total(k)})`,
        onclick: () => { estado.grupo = estado.grupo === k ? '' : k; render(); }
      }));
    }
  }

  function renderResumo(lista) {
    clear(resumo);
    if (!lista.length) return;
    const mediaEf = lista.reduce((s, m) => s + m.eficiencia, 0) / lista.length;
    const mediaCx = lista.reduce((s, m) => s + m.complexidade, 0) / lista.length;
    const menorTempo = lista.reduce((min, m) => Math.min(min, m.tempoMedioSemanas), Infinity);
    const maisSimples = lista.reduce((min, m) => Math.min(min, m.complexidade), Infinity);
    const itens = [
      ['Eficiência média (est.)', `${nf(mediaEf)}/10`],
      ['Complexidade média (est.)', `${nf(mediaCx)}/10`],
      ['Retorno mais rápido', `${nf(menorTempo)} semanas`],
      ['Menor complexidade', `${nf(maisSimples)}/10`]
    ];
    itens.forEach(([rotulo, valor]) => {
      resumo.appendChild(el('div', { class: 'osa-metodos__stat' }, [
        el('span', { class: 'osa-metodos__stat-label', text: rotulo }),
        el('strong', { class: 'osa-metodos__stat-valor', text: valor })
      ]));
    });
    resumo.appendChild(el('p', { class: 'osa-metodos__stat-nota small', text: `Calculado apenas sobre os ${lista.length} métodos exibidos agora.` }));
  }

  function renderTabela(lista) {
    clear(corpoTabela);
    lista.forEach((m, i) => corpoTabela.appendChild(linhaTabela(m, i, data, langKey)));
  }

  function render() {
    renderChips();
    const filtro = ordenados(filtrados());
    clear(lista);
    if (!filtro.length) {
      lista.appendChild(el('li', { class: 'osa-empty', role: 'status', text: 'Nenhum método corresponde a esses filtros. Ajuste a busca ou use “Limpar filtros”.' }));
    } else {
      filtro.forEach((m, i) => lista.appendChild(cartaoMetodo(m, i, data, langKey)));
    }
    renderResumo(filtro);
    renderTabela(filtro);
    contador.textContent = filtro.length === data.metodos.length
      ? `Mostrando os ${data.metodos.length} métodos analisados`
      : `Mostrando ${filtro.length} de ${data.metodos.length} métodos`;
    Object.entries(ths).forEach(([chave, th]) => {
      th.setAttribute('aria-sort', chave === estado.coluna ? (estado.direcao === 'asc' ? 'ascending' : 'descending') : 'none');
    });
  }

  /* ---------------- eventos ---------------- */
  campoBusca.addEventListener('input', () => { estado.busca = campoBusca.value; render(); });
  select.addEventListener('change', () => {
    estado.ordem = select.value;
    const mapa = { eficiencia: 'eficiencia', tempo: 'tempoMedioSemanas', complexidade: 'complexidade', nome: 'nome' };
    estado.coluna = mapa[estado.ordem] || 'eficiencia';
    estado.direcao = estado.ordem === 'nome' || estado.ordem === 'complexidade' || estado.ordem === 'tempo' ? 'asc' : 'desc';
    render();
  });
  checkHibridos.addEventListener('change', () => { estado.hibridos = checkHibridos.checked; render(); });
  btnLimpar.addEventListener('click', () => {
    estado.busca = '';
    estado.grupo = '';
    estado.hibridos = false;
    estado.ordem = 'eficiencia';
    estado.coluna = 'eficiencia';
    estado.direcao = 'desc';
    campoBusca.value = '';
    select.value = 'eficiencia';
    checkHibridos.checked = false;
    render();
  });

  // Ordenação pela tabela (teclado e mouse; aria-sort reflete o estado)
  Object.entries(ths).forEach(([chave, th]) => {
    const btn = th.querySelector('button');
    btn.addEventListener('click', () => {
      const asc = !(estado.coluna === chave && estado.direcao === 'asc');
      estado.coluna = chave;
      estado.direcao = asc ? 'asc' : 'desc';
      estado.ordem = 'manual';
      const campo = chave === 'categoria' ? 'categoria' : chave;
      const lista = filtrados().sort((a, b) => {
        if (campo === 'foco') return a.foco.join(', ').localeCompare(b.foco.join(', '), 'pt-BR') * (asc ? 1 : -1);
        if (campo === 'categoria') {
          const va = data.gruposDidaticos[a.categoria] || a.categoria;
          const vb = data.gruposDidaticos[b.categoria] || b.categoria;
          return va.localeCompare(vb, 'pt-BR') * (asc ? 1 : -1);
        }
        if (campo === 'nome') return a.nome.localeCompare(b.nome, 'pt-BR') * (asc ? 1 : -1);
        return (a[campo] - b[campo]) * (asc ? 1 : -1);
      });
      clear(lista_node());
      lista.forEach((m, i) => lista_node().appendChild(cartaoMetodo(m, i, data, langKey)));
      renderTabela(lista);
      renderResumo(lista);
      contador.textContent = `Ordenado por ${COLUNAS_TABELA.find((c) => c.chave === chave).rotulo} (${asc ? 'crescente' : 'decrescente'}) — ${lista.length} de ${data.metodos.length} métodos`;
      Object.entries(ths).forEach(([k, t]) => t.setAttribute('aria-sort', k === chave ? (asc ? 'ascending' : 'descending') : 'none'));
    });
  });

  function lista_node() { return lista; }

  render();
}

/* --------------------------------------------------------------------------
 * Impressão / PDF: abre as tabelas marcadas com data-abrir-impressao e
 * restaura o estado depois — o fallback de PDF é a impressão do navegador.
 * -------------------------------------------------------------------------- */
export function initPrintExpanders() {
  const abertosAntes = new Map();
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('details[data-abrir-impressao]').forEach((d) => {
      abertosAntes.set(d, d.open);
      d.open = true;
    });
  });
  window.addEventListener('afterprint', () => {
    abertosAntes.forEach((estava, d) => { d.open = estava; });
    abertosAntes.clear();
  });
  return true;
}
