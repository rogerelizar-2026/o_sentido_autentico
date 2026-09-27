/* ==========================================================================
 * charts.js — os 4 gráficos das páginas de idioma + ranking.
 * A tabela/explorador dos 25 métodos vive em js/metodos.js.
 * charts.js — gráficos SVG acessíveis gerados a partir de data/metodos.json.
 * Sem Chart.js: elimina chunk pesado; valores SOMENTE da tabela de métodos.
 * Cada gráfico tem resumo textual + tabela de dados equivalente.
 * ========================================================================== */

import { el, clear } from './ui.js';

let cacheMetodos = null;

export async function loadMetodos() {
  if (cacheMetodos) return cacheMetodos;
  // Build portátil (pendrive / file://): metodos embutidos por js/data-portable.js
  const embutido = window.__OSA_DATA__ && window.__OSA_DATA__.metodos;
  if (embutido) {
    cacheMetodos = embutido;
    return cacheMetodos;
  }
  const res = await fetch('./data/metodos.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('Falha ao carregar metodos.json');
  cacheMetodos = await res.json();
  return cacheMetodos;
}

function svgEl(name, attrs = {}) {
  const n = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  return n;
}

function textStyle() {
  return {
    fill: 'currentColor',
    'font-size': '11',
    'font-family': 'Inter, system-ui, sans-serif'
  };
}

/** Tabela de dados acessível (alternativa textual obrigatória). */
function dataTable(caption, headers, rows) {
  const scroll = el('div', {
    class: 'osa-table-scroll',
    role: 'region',
    tabindex: '0',
    'aria-label': 'Tabela de dados do gráfico: ' + caption
  });
  const table = el('table', { class: 'osa-table' });
  table.appendChild(el('caption', { text: caption }));
  const thead = el('thead');
  const trh = el('tr');
  headers.forEach((h) => trh.appendChild(el('th', { scope: 'col', text: h })));
  thead.appendChild(trh);
  table.appendChild(thead);
  const tbody = el('tbody');
  rows.forEach((r) => {
    const tr = el('tr');
    r.forEach((c, i) => {
      tr.appendChild(i === 0 ? el('th', { scope: 'row', text: String(c) }) : el('td', { text: String(c) }));
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  scroll.appendChild(table);
  return scroll;
}

/* ---------- 1. Dispersão: complexidade × tempo ---------- */
function scatterChart(metodos) {
  const W = 640, H = 360, pad = 48;
  const maxC = 10, maxT = 20;
  const x = (t) => pad + (t / maxT) * (W - pad * 2);
  const y = (c) => H - pad - (c / maxC) * (H - pad * 2);

  const svg = svgEl('svg', {
    viewBox: `0 0 ${W} ${H}`, role: 'img',
    'aria-label': 'Dispersão: complexidade de configuração por tempo médio até retornos práticos, para 25 métodos.'
  });
  // eixos
  svg.appendChild(svgEl('line', { x1: pad, y1: H - pad, x2: W - pad, y2: H - pad, stroke: 'currentColor', 'stroke-width': 1.5, opacity: 0.6 }));
  svg.appendChild(svgEl('line', { x1: pad, y1: pad, x2: pad, y2: H - pad, stroke: 'currentColor', 'stroke-width': 1.5, opacity: 0.6 }));
  const xt = Object.assign(textStyle(), {});
  const lblX = svgEl('text', { x: W / 2, y: H - 12, 'text-anchor': 'middle', ...textStyle() });
  lblX.textContent = 'Tempo médio até retornos práticos (semanas) — estimativa editorial';
  svg.appendChild(lblX);
  const lblY = svgEl('text', { x: 14, y: H / 2, 'text-anchor': 'middle', transform: `rotate(-90 14 ${H / 2})`, ...textStyle() });
  lblY.textContent = 'Complexidade (1–10) — estimativa editorial';
  svg.appendChild(lblY);

  for (const m of metodos) {
    const cx = x(m.tempoMedioSemanas), cy = y(m.complexidade);
    const c = svgEl('circle', {
      cx, cy, r: 7,
      fill: m.hibrido ? '#0F3731' : '#C5A059',
      opacity: 0.85, stroke: 'currentColor', 'stroke-width': 1
    });
    const t = svgEl('title');
    t.textContent = `${m.nome}: complexidade ${m.complexidade}, ${m.tempoMedioSemanas} semanas, eficiência ${m.eficiencia}`;
    c.appendChild(t);
    svg.appendChild(c);
  }
  // legenda textual embutida
  const leg = svgEl('text', { x: pad + 8, y: pad - 14, ...textStyle() });
  leg.textContent = '● verde = componente do método híbrido   ● ouro = método tradicional';
  svg.appendChild(leg);
  return svg;
}

/* ---------- 2. Radar: top 4 por eficiência ---------- */
function radarChart(top4) {
  const W = 640, H = 380, cx = W / 2, cy = H / 2 - 10, R = 120;
  const axes = ['eficiencia', 'inversoComplexidade', 'rapidez', 'acessibilidadeTexto'];
  const axisLabels = ['Eficiência (est.)', 'Menor complexidade', 'Rapidez (inverso do tempo)', 'Acesso ao texto autêntico'];
  const val = (m, ax) => {
    if (ax === 'eficiencia') return m.eficiencia / 10;
    if (ax === 'inversoComplexidade') return (10 - m.complexidade) / 9;
    if (ax === 'rapidez') return Math.max(0, (20 - m.tempoMedioSemanas) / 12);
    // acessibilidade: proxy editorial — leitura direta/texto pontua mais alto
    const textCentric = { 'texto': 1, 'aluno': 0.75, 'professor': 0.5 }[m.categoria] || 0.6;
    return textCentric * (0.7 + 0.3 * (m.eficiencia / 10));
  };

  const svg = svgEl('svg', {
    viewBox: `0 0 ${W} ${H}`, role: 'img',
    'aria-label': 'Radar comparando os quatro métodos de maior eficiência editorial em quatro dimensões.'
  });
  const colors = ['#0F3731', '#102A43', '#7B1D22', '#C5A059'];

  // anéis
  for (let ring = 1; ring <= 4; ring++) {
    const pts = axes.map((_, i) => {
      const a = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
      const r = (R * ring) / 4;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(' ');
    svg.appendChild(svgEl('polygon', { points: pts, fill: 'none', stroke: 'currentColor', opacity: 0.15 }));
  }
  axes.forEach((_, i) => {
    const a = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    svg.appendChild(svgEl('line', { x1: cx, y1: cy, x2: cx + R * Math.cos(a), y2: cy + R * Math.sin(a), stroke: 'currentColor', opacity: 0.25 }));
    const lx = cx + (R + 26) * Math.cos(a);
    const ly = cy + (R + 26) * Math.sin(a);
    const t = svgEl('text', { x: lx, y: ly, 'text-anchor': 'middle', ...textStyle() });
    t.textContent = axisLabels[i];
    svg.appendChild(t);
  });

  top4.forEach((m, mi) => {
    const pts = axes.map((ax, i) => {
      const a = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
      const r = R * Math.min(1, Math.max(0, val(m, ax)));
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(' ');
    const poly = svgEl('polygon', {
      points: pts, fill: colors[mi % 4], 'fill-opacity': 0.12,
      stroke: colors[mi % 4], 'stroke-width': 2.5
    });
    const t = svgEl('title');
    t.textContent = `${m.nome} — eficiência ${m.eficiencia}`;
    poly.appendChild(t);
    svg.appendChild(poly);
  });

  // legenda
  top4.forEach((m, i) => {
    const y = H - 36 + (i < 2 ? 0 : 0);
    const x0 = 30 + (i % 2) * 300;
    const y0 = H - 46 + Math.floor(i / 2) * 20;
    svg.appendChild(svgEl('rect', { x: x0, y: y0 - 9, width: 12, height: 12, fill: colors[i] }));
    const t = svgEl('text', { x: x0 + 18, y: y0, ...textStyle() });
    t.textContent = m.nome;
    svg.appendChild(t);
  });
  return svg;
}

/* ---------- 3. Barras: tempo médio ---------- */
function barChart(metodos) {
  const sorted = [...metodos].sort((a, b) => a.tempoMedioSemanas - b.tempoMedioSemanas);
  const rowH = 22, padL = 230, padR = 60, W = 680;
  const H = sorted.length * rowH + 50;
  const maxT = Math.max(...sorted.map((m) => m.tempoMedioSemanas));
  const svg = svgEl('svg', {
    viewBox: `0 0 ${W} ${H}`, role: 'img',
    'aria-label': 'Barras horizontais com o tempo médio estimado em semanas de cada método.'
  });
  sorted.forEach((m, i) => {
    const y = 20 + i * rowH;
    const bw = ((m.tempoMedioSemanas / maxT) * (W - padL - padR));
    const label = svgEl('text', { x: padL - 8, y: y + 12, 'text-anchor': 'end', ...textStyle() });
    label.textContent = m.nome.length > 34 ? m.nome.slice(0, 32) + '…' : m.nome;
    svg.appendChild(label);
    svg.appendChild(svgEl('rect', {
      x: padL, y: y + 2, width: Math.max(2, bw), height: rowH - 6,
      fill: m.hibrido ? '#0F3731' : '#C5A059', rx: 3, opacity: 0.9
    }));
    const val = svgEl('text', { x: padL + bw + 6, y: y + 12, ...textStyle() });
    val.textContent = String(m.tempoMedioSemanas);
    svg.appendChild(val);
  });
  return svg;
}

/* ---------- 4. Comparação híbrido vs tradicional ---------- */
function compareChart(data, hibridoIds, tradIds) {
  const hib = data.metodos.filter((m) => hibridoIds.includes(m.id));
  const tra = data.metodos.filter((m) => tradIds.includes(m.id));
  const avg = (arr, f) => arr.length ? Math.round((arr.reduce((s, m) => s + f(m), 0) / arr.length) * 100) / 100 : 0;
  const groups = [
    { label: 'Eficiência média (est.)', h: avg(hib, (m) => m.eficiencia), t: avg(tra, (m) => m.eficiencia), max: 10 },
    { label: 'Velocidade relativa (20 − semanas) / 2', h: avg(hib, (m) => (20 - m.tempoMedioSemanas) / 2), t: avg(tra, (m) => (20 - m.tempoMedioSemanas) / 2), max: 10 },
    { label: 'Simplicidade (10 − complexidade)', h: avg(hib, (m) => 10 - m.complexidade), t: avg(tra, (m) => 10 - m.complexidade), max: 10 }
  ];
  const W = 640, H = 300, pad = 40, groupW = (W - pad * 2) / groups.length;
  const svg = svgEl('svg', {
    viewBox: `0 0 ${W} ${H}`, role: 'img',
    'aria-label': 'Comparação em grupo entre componentes do método híbrido e métodos tradicionais em três dimensões médias.'
  });
  groups.forEach((g, i) => {
    const baseX = pad + i * groupW + groupW * 0.18;
    const bw = groupW * 0.28;
    const hH = (g.h / g.max) * (H - 100);
    const tH = (g.t / g.max) * (H - 100);
    svg.appendChild(svgEl('rect', { x: baseX, y: H - 50 - hH, width: bw, height: hH, fill: '#0F3731', rx: 4 }));
    svg.appendChild(svgEl('rect', { x: baseX + bw + 8, y: H - 50 - tH, width: bw, height: tH, fill: '#C5A059', rx: 4 }));
    const lbl = svgEl('text', { x: baseX + bw, y: H - 30, 'text-anchor': 'middle', ...textStyle() });
    lbl.textContent = g.label.length > 26 ? g.label.slice(0, 24) + '…' : g.label;
    svg.appendChild(lbl);
    const vh = svgEl('text', { x: baseX + bw / 2, y: H - 56 - hH, 'text-anchor': 'middle', ...textStyle() });
    vh.textContent = String(g.h);
    svg.appendChild(vh);
    const vt = svgEl('text', { x: baseX + bw * 1.5 + 8, y: H - 56 - tH, 'text-anchor': 'middle', ...textStyle() });
    vt.textContent = String(g.t);
    svg.appendChild(vt);
  });
  const leg = svgEl('text', { x: pad, y: 24, ...textStyle() });
  leg.textContent = '■ Componentes do híbrido   ■ Tradicionais (média das estimativas editoriais)';
  svg.appendChild(leg);
  return svg;
}

/** Monta todos os gráficos de uma página de idioma. */
export async function initLanguageCharts(page) {
  const host = document.getElementById('charts-host');
  if (!host) return;
  try {
    const data = await loadMetodos();
    const metodos = data.metodos;
    const top4 = [...metodos].sort((a, b) => b.eficiencia - a.eficiencia).slice(0, 4);

    const specs = [
      {
        id: 'chart-scatter', title: 'Complexidade × tempo até retornos práticos',
        summary: `Dispersão dos 25 métodos: eixo X = semanas até retornos práticos percebíveis, eixo Y = complexidade de configuração (1–10). Verde indica componentes do método híbrido; ouro, métodos tradicionais. Todos os valores são estimativas editoriais (setembro de 2026).`,
        make: () => scatterChart(metodos),
        headers: ['Método', 'Complexidade', 'Semanas', 'Eficiência'],
        rows: metodos.map((m) => [m.nome, m.complexidade, m.tempoMedioSemanas, m.eficiencia])
      },
      {
        id: 'chart-radar', title: 'Radar dos 4 métodos mais eficientes (estimativa editorial)',
        summary: `Comparação dimensional de: ${top4.map((m) => m.nome).join('; ')}. Dimensões: eficiência, menor complexidade, rapidez e acesso ao texto autêntico — todas derivadas dos campos da tabela editorial de métodos.`,
        make: () => radarChart(top4),
        headers: ['Método', 'Eficiência', 'Complexidade', 'Semanas'],
        rows: top4.map((m) => [m.nome, m.eficiencia, m.complexidade, m.tempoMedioSemanas])
      },
      {
        id: 'chart-bars', title: 'Tempo médio até retornos práticos (semanas)',
        summary: 'Barras horizontais ordenadas do menor para o maior tempo médio estimado. Verde = componente do híbrido; ouro = tradicional.',
        make: () => barChart(metodos),
        headers: ['Método', 'Semanas (est.)'],
        rows: [...metodos].sort((a, b) => a.tempoMedioSemanas - b.tempoMedioSemanas).map((m) => [m.nome, m.tempoMedioSemanas])
      },
      {
        id: 'chart-compare', title: 'Componentes híbridos × métodos tradicionais',
        summary: 'Médias das estimativas editoriais dos grupos: eficiência, velocidade relativa e simplicidade. O agrupamento segue as listas hibridoComponentes e tradicionalComponentes do arquivo de dados.',
        make: () => compareChart(data, data.hibridoComponentes, data.tradicionalComponentes),
        headers: ['Dimensão', 'Híbrido (média)', 'Tradicional (média)'],
        rows: (() => {
          const hib = metodos.filter((m) => data.hibridoComponentes.includes(m.id));
          const tra = metodos.filter((m) => data.tradicionalComponentes.includes(m.id));
          const avg = (arr, f) => arr.length ? Math.round((arr.reduce((s, m) => s + f(m), 0) / arr.length) * 100) / 100 : 0;
          return [
            ['Eficiência média', avg(hib, (m) => m.eficiencia), avg(tra, (m) => m.eficiencia)],
            ['Velocidade relativa', avg(hib, (m) => (20 - m.tempoMedioSemanas) / 2), avg(tra, (m) => (20 - m.tempoMedioSemanas) / 2)],
            ['Simplicidade', avg(hib, (m) => 10 - m.complexidade), avg(tra, (m) => 10 - m.complexidade)]
          ];
        })()
      }
    ];

    for (const spec of specs) {
      const box = el('figure', { class: 'osa-chart', id: spec.id }, [
        el('h3', { class: 'osa-chart__titulo', text: spec.title }),
        el('p', { class: 'osa-chart__summary', text: spec.summary }),
        spec.make(),
        dataTable(spec.title + ' — dados', spec.headers, spec.rows)
      ]);
      host.appendChild(box);
    }
  } catch (err) {
    clear(host);
    host.appendChild(el('div', { class: 'osa-empty', role: 'alert' },
      el('p', { text: 'Não foi possível gerar os gráficos (data/metodos.json indisponível). A tabela de 25 métodos abaixo continua íntegra.' })));
  }
}

/** Ranking derivado transparentemente das estimativas. */
export async function initRanking(containerId) {
  const host = document.getElementById(containerId);
  if (!host) return;
  try {
    const data = await loadMetodos();
    const sorted = [...data.metodos].sort((a, b) => {
      if (b.eficiencia !== a.eficiencia) return b.eficiencia - a.eficiencia;
      return a.tempoMedioSemanas - b.tempoMedioSemanas;
    });
    clear(host);
    host.appendChild(el('p', { class: 'editorial-note', text: data.critérios.ranking + ' Critério: eficiência (desc); empate decidido pelo menor tempo médio. Tudo é estimativa editorial de setembro de 2026.' }));
    const ol = el('ol');
    sorted.slice(0, 10).forEach((m) => {
      ol.appendChild(el('li', {}, [
        el('strong', { text: m.nome }),
        document.createTextNode(` — eficiência ${m.eficiencia}/10, ${m.tempoMedioSemanas} semanas (est. editorial)`)
      ]));
    });
    host.appendChild(ol);
    host.appendChild(el('p', { class: 'small', text: 'Os 15 demais métodos seguem na tabela completa; nenhum valor foi inventado fora de data/metodos.json.' }));
  } catch {
    host.textContent = '';
  }
}
