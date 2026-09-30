/* ==========================================================================
 * catalog.js — catálogo pesquisável, filtros, favoritos, coleção pessoal,
 * CRUD de recursos do usuário, import/export JSON, exportação via impressão.
 * ========================================================================== */

import {
  getFavorites, toggleFavorite, getUserResources, addUserResource,
  updateUserResource, deleteUserResource, buildExportPayload, parseImport,
  isAllowedUrl, migrateLegacyIfNeeded, KEYS, getJSON, setJSON
} from './storage.js';
import { toast, announce, el, clear, normalize } from './ui.js';

/** Estado local do catálogo desta página. */
const state = {
  seed: [],
  categorias: {},
  idiomas: {},
  niveis: {},
  query: '',
  categoria: '',
  idioma: '',
  nivel: '',
  somenteFavoritos: false,
  colecaoMode: false, // "Minha coleção"
  loading: true,
  error: null,
  offline: false
};

const PAGE_ID = 'catalogo';

async function loadSeed() {
  state.loading = true;
  state.error = null;
  render();
  try {
    if (!navigator.onLine) state.offline = true;
    // Build portátil (pendrive / file://): dados embutidos por js/data-portable.js,
    // porque fetch() de arquivos locais é bloqueado em file://.
    const embutido = window.__OSA_DATA__ && window.__OSA_DATA__.recursos;
    let data;
    if (embutido) {
      data = embutido;
    } else {
      const res = await fetch('./data/recursos.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      data = await res.json();
    }
    if (!data || !Array.isArray(data.recursos)) throw new Error('formato');
    state.seed = data.recursos;
    state.categorias = data.categorias || {};
    state.idiomas = data.idiomas || {};
    state.niveis = data.niveis || {};
    state.loading = false;
    state.error = null;
  } catch (err) {
    state.loading = false;
    state.offline = !navigator.onLine;
    state.error = state.offline
      ? 'Você está offline e o catálogo ainda não foi carregado nesta sessão. Conecte-se uma vez para baixar a lista e tente de novo.'
      : 'Não foi possível carregar o catálogo de recursos. Verifique sua conexão e use "Tentar novamente".';
  }
  render();
}

function allResources() {
  const user = getUserResources();
  // Usuário sobrepõe seed apenas se id igual? IDs distintos — concatena.
  return [...state.seed, ...user];
}

function filtered() {
  const favs = getFavorites();
  const q = normalize(state.query);
  return allResources().filter((r) => {
    if (state.colecaoMode) {
      const isUser = !!r.userAdded;
      if (!isUser && !favs.includes(r.id)) return false;
    }
    if (state.somenteFavoritos && !favs.includes(r.id)) return false;
    if (state.categoria && r.category !== state.categoria) return false;
    if (state.idioma && r.language !== state.idioma) return false;
    if (state.nivel && r.level !== state.nivel) return false;
    if (q) {
      const hay = normalize([r.title, r.author, r.description].join(' '));
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/* ---------------- Renderização (DOM API segura) ---------------- */

function badge(text, cls) {
  return el('span', { class: 'osa-badge' + (cls ? ' ' + cls : ''), text });
}

function resourceCard(r) {
  const favs = getFavorites();
  const isFav = favs.includes(r.id);
  const isUser = !!r.userAdded;

  const favBtn = el('button', {
    type: 'button',
    class: 'osa-btn osa-btn--outline osa-btn--sm',
    'aria-pressed': isFav ? 'true' : 'false',
    'aria-label': (isFav ? 'Remover ' : 'Adicionar ') + r.title + (isFav ? ' dos favoritos' : ' aos favoritos'),
    onclick: () => {
      const res = toggleFavorite(r.id);
      announce(res.added ? `${r.title} adicionado aos favoritos.` : `${r.title} removido dos favoritos.`);
      render();
    }
  }, isFav ? '★ Favoritado' : '☆ Favoritar');

  const actions = [favBtn];

  if (isUser) {
    actions.push(
      el('button', {
        type: 'button', class: 'osa-btn osa-btn--outline osa-btn--sm',
        'aria-label': 'Editar ' + r.title,
        onclick: () => openResourceForm(r)
      }, 'Editar'),
      el('button', {
        type: 'button', class: 'osa-btn osa-btn--danger osa-btn--sm',
        'aria-label': 'Excluir ' + r.title,
        onclick: () => confirmDelete(r)
      }, 'Excluir')
    );
  }

  let linkBtn = null;
  if (r.link && isAllowedUrl(r.link)) {
    linkBtn = el('a', {
      class: 'osa-btn osa-btn--primary osa-btn--sm',
      href: r.link,
      target: '_blank',
      rel: 'noopener noreferrer external',
      'aria-label': `Abrir ${r.title} em nova aba (site externo)`
    }, 'Visitar ↗');
  }

  const meta = el('div', { class: 'osa-resource__meta' }, [
    badge(state.categorias[r.category] || r.category, 'osa-badge--gold'),
    badge(state.idiomas[r.language] || r.language),
    badge(state.niveis[r.level] || r.level),
    badge(r.type || ''),
    badge(r.free ? 'Gratuito' : 'Pago', r.free ? 'osa-badge--free' : 'osa-badge--paid'),
    isUser ? badge('Criado por você', 'osa-badge--green') : null
  ]);

  return el('article', { class: 'osa-resource', 'data-resource-id': r.id }, [
    el('div', { class: 'osa-resource__head' }, [
      el('h3', { class: 'osa-resource__title' },
        r.link && isAllowedUrl(r.link)
          ? el('a', { href: r.link, target: '_blank', rel: 'noopener noreferrer external' }, r.title)
          : r.title),
      isUser ? badge('Usuário', 'osa-badge--navy') : null
    ]),
    el('p', { class: 'osa-resource__author', text: r.author || '' }),
    el('p', { class: 'osa-resource__desc', text: r.description || '' }),
    meta,
    el('div', { class: 'osa-resource__actions' }, linkBtn ? [linkBtn, ...actions] : actions)
  ]);
}

function renderFiltersChips() {
  const wrap = document.getElementById('filter-chips');
  if (!wrap) return;
  clear(wrap);
  const cats = Object.entries(state.categorias);
  for (const [key, label] of cats) {
    // Só mostra categorias que existem nos dados (seed + usuário)
    const exists = allResources().some((r) => r.category === key);
    if (!exists) continue;
    const b = el('button', {
      type: 'button',
      class: 'osa-chip',
      'aria-pressed': state.categoria === key ? 'true' : 'false',
      onclick: () => {
        state.categoria = state.categoria === key ? '' : key;
        syncControls();
        render();
      }
    }, label);
    wrap.appendChild(b);
  }
}

function syncControls() {
  const q = document.getElementById('filter-q');
  if (q && q.value !== state.query) q.value = state.query;
  const cat = document.getElementById('filter-idioma');
  if (cat) cat.value = state.idioma;
  const niv = document.getElementById('filter-nivel');
  if (niv) niv.value = state.nivel;
  const fav = document.getElementById('filter-fav');
  if (fav) fav.checked = state.somenteFavoritos;
}

export function render() {
  const results = document.getElementById('resource-results');
  const count = document.getElementById('result-count');
  const collectionBox = document.getElementById('colecao-list');
  const collectionCount = document.getElementById('colecao-count');

  renderFiltersChips();
  syncControls();

  if (state.loading) {
    if (results) {
      clear(results);
      results.appendChild(el('div', { class: 'osa-empty', role: 'status', text: 'Carregando recursos…' }));
    }
    if (count) count.textContent = 'Carregando…';
    return;
  }
  if (state.error) {
    if (results) {
      clear(results);
      const box = el('div', { class: 'osa-empty', role: 'alert' }, [
        el('p', { text: state.error }),
        el('button', {
          type: 'button', class: 'osa-btn osa-btn--primary',
          onclick: () => loadSeed()
        }, 'Tentar novamente')
      ]);
      results.appendChild(box);
    }
    if (count) count.textContent = '—';
    return;
  }

  const list = filtered();
  const favs = getFavorites();
  const userRes = getUserResources();

  if (count) {
    const total = state.colecaoMode
      ? favs.filter((id) => state.seed.some((s) => s.id === id)).length + userRes.length
      : allResources().length;
    count.textContent = state.colecaoMode
      ? `Minha coleção: ${list.length} de ${total} itens (favoritos + criados por você)`
      : `${list.length} de ${allResources().length} recursos encontrados`;
  }

  if (collectionCount) {
    const userNotFav = userRes.filter((r) => !favs.includes(r.id)).length;
    collectionCount.textContent = `Favoritos: ${favs.length} · Recursos criados por você: ${userRes.length} · Total na coleção: ${favs.length + userNotFav} (dados somente neste dispositivo)`;
  }

  if (results) {
    clear(results);
    if (list.length === 0) {
      results.appendChild(el('div', { class: 'osa-empty' }, [
        el('p', { text: state.colecaoMode
          ? 'Sua coleção está vazia com os filtros atuais. Favorite recursos no catálogo ou adicione os seus.'
          : 'Nenhum recurso corresponde aos filtros. Ajuste a busca ou limpe os filtros.' }),
        el('button', {
          type: 'button', class: 'osa-btn osa-btn--outline',
          'data-clear-filters': true,
          onclick: () => clearFilters()
        }, 'Limpar filtros')
      ]));
    } else {
      for (const r of list) results.appendChild(resourceCard(r));
    }
  }

  // Seção "Minha coleção" (pode existir na mesma página)
  if (collectionBox) {
    clear(collectionBox);
    const favResources = state.seed.filter((s) => favs.includes(s.id));
    const all = [...favResources, ...userRes];
    if (all.length === 0) {
      collectionBox.appendChild(el('div', { class: 'osa-empty' },
        el('p', { text: 'Nenhum favorito ou recurso pessoal ainda. Use "☆ Favoritar" nas fichas do catálogo — os dados ficam somente neste dispositivo.' })));
    } else {
      for (const r of all) collectionBox.appendChild(resourceCard({ ...r }));
    }
  }
}

export function clearFilters() {
  state.query = '';
  state.categoria = '';
  state.idioma = '';
  state.nivel = '';
  state.somenteFavoritos = false;
  syncControls();
  renderFiltersChips();
  syncExternalSearch();
  render();
  announce('Filtros limpos.');
}

/* ---------------- Formulário de recurso do usuário ---------------- */

let deleteUndoBuffer = null;

function openResourceForm(existing = null) {
  const dlg = document.getElementById('dialog-recurso');
  if (!dlg) return;
  const form = document.getElementById('form-recurso');
  if (!form) return;
  form.reset();
  document.getElementById('recurso-form-errors').textContent = '';
  form.dataset.editing = existing ? existing.id : '';

  if (existing) {
    form.elements.title.value = existing.title || '';
    form.elements.author.value = existing.author || '';
    form.elements.category.value = existing.category || 'gramatica';
    form.elements.language.value = existing.language || 'todos';
    form.elements.level.value = existing.level || 'todos';
    form.elements.type.value = existing.type || '';
    form.elements.free.checked = !!existing.free;
    form.elements.link.value = existing.link || '';
    form.elements.description.value = existing.description || '';
    document.getElementById('recurso-dialog-title').textContent = 'Editar recurso';
  } else {
    document.getElementById('recurso-dialog-title').textContent = 'Adicionar recurso';
  }

  try { dlg.showModal(); } catch { dlg.setAttribute('open', ''); }
  const t = document.getElementById('recurso-dialog-title');
  if (t) { t.setAttribute('tabindex', '-1'); t.focus(); }
}

function closeResourceForm() {
  const dlg = document.getElementById('dialog-recurso');
  if (!dlg) return;
  try { if (dlg.open) dlg.close(); else dlg.removeAttribute('open'); } catch { dlg.removeAttribute('open'); }
}

function onSubmitResource(ev) {
  ev.preventDefault();
  const form = ev.target;
  const errBox = document.getElementById('recurso-form-errors');
  errBox.textContent = '';
  const fd = new FormData(form);
  const title = String(fd.get('title') || '').trim();
  const author = String(fd.get('author') || '').trim();
  const link = String(fd.get('link') || '').trim();
  const description = String(fd.get('description') || '').trim();
  const errors = [];

  if (title.length < 2) errors.push('Título é obrigatório (mínimo 2 caracteres).');
  if (description.length < 10) errors.push('Descrição é obrigatória (mínimo 10 caracteres).');
  if (link && !isAllowedUrl(link)) errors.push('O link deve começar com http:// ou https:// (outros protocolos não são aceitos).');

  if (errors.length) {
    errBox.textContent = errors.join(' ');
    errBox.focus?.();
    return;
  }

  const editingId = form.dataset.editing;
  const payload = {
    title,
    author: author || 'Autor não informado',
    category: String(fd.get('category') || 'gramatica'),
    language: String(fd.get('language') || 'todos'),
    level: String(fd.get('level') || 'todos'),
    type: String(fd.get('type') || 'Recurso'),
    free: form.elements.free.checked,
    link,
    description,
    userAdded: true
  };

  let result;
  if (editingId) {
    result = updateUserResource(editingId, payload);
    if (result.ok) toast('Recurso atualizado.', { type: 'success' });
  } else {
    const id = 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
    result = addUserResource({ id, ...payload });
    if (result.ok) toast('Recurso adicionado à sua coleção local.', { type: 'success' });
    else if (result.reason === 'duplicate') {
      errBox.textContent = 'Já existe um recurso com este identificador.';
      return;
    }
  }
  if (!result.ok) {
    errBox.textContent = 'Não foi possível salvar (armazenamento local indisponível ou cheio).';
    return;
  }
  closeResourceForm();
  render();
}

function confirmDelete(r) {
  const dlg = document.getElementById('dialog-confirmar');
  if (!dlg) return;
  const msg = dlg.querySelector('#confirmar-msg');
  if (msg) msg.textContent = `Excluir "${r.title}" da sua coleção local? Esta ação pode ser desfeita por alguns segundos.`;
  dlg.dataset.targetId = r.id;
  try { dlg.showModal(); } catch { dlg.setAttribute('open', ''); }
  const cancel = dlg.querySelector('#confirmar-cancel');
  if (cancel) cancel.focus();
}

function doDeleteConfirmed() {
  const dlg = document.getElementById('dialog-confirmar');
  if (!dlg) return;
  const id = dlg.dataset.targetId;
  const res = deleteUserResource(id);
  try { dlg.close(); } catch { dlg.removeAttribute('open'); }
  if (!res.ok) {
    toast('Não foi possível excluir.', { type: 'error' });
    return;
  }
  deleteUndoBuffer = res.removed;
  toast('Recurso excluído.', {
    type: 'info',
    actionLabel: 'Desfazer',
    onAction: () => {
      if (deleteUndoBuffer) {
        addUserResource(deleteUndoBuffer);
        deleteUndoBuffer = null;
        render();
        toast('Exclusão desfeita.', { type: 'success' });
      }
    },
    timeout: 9000
  });
  render();
}

/* ---------------- Export / Import ---------------- */

export function exportJSON() {
  const payload = buildExportPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `osa-colecao-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast('Coleção exportada como JSON.', { type: 'success' });
}

export function importJSONFile(file, policy) {
  if (!file) return;
  if (file.size > 512 * 1024) {
    toast('Arquivo maior que 512 KB. Importação cancelada.', { type: 'error' });
    return;
  }
  const reader = new FileReader();
  reader.onerror = () => toast('Falha ao ler o arquivo. Nada foi alterado.', { type: 'error' });
  reader.onload = () => {
    const result = parseImport(String(reader.result || ''), { duplicatePolicy: policy || 'keep-existing' });
    if (!result.ok) {
      toast(result.error, { type: 'error', timeout: 8000 });
      return;
    }
    toast(`Importação concluída: ${result.added} novo(s), ${result.updated} atualizado(s), ${result.skipped} ignorado(s) por duplicidade/inválido.`, { type: 'success', timeout: 8000 });
    announce('Importação concluída.');
    render();
  };
  reader.readAsText(file);
}

/**
 * Exportação "PDF": usa a biblioteca nativa de impressão do navegador.
 * Limitação honesta (static hosting): não há motor de render PDF com
 * shaping confiável de hebraico/grego no cliente sem lib pesada —
 * o fallback é a folha de estilo de impressão + "Salvar como PDF".
 */
export function exportPDF() {
  const note = document.getElementById('pdf-note');
  if (note) note.hidden = false;
  announce('Abrindo diálogo de impressão para salvar em PDF. O texto usa a folha de estilo de impressão do site.');
  setTimeout(() => window.print(), 300);
}

/* ---------------- Descoberta externa (somente abertura de busca) ----------------
 * Este site NÃO faz mineração, NÃO chama APIs de busca e NÃO guarda chaves.
 * Os botões apenas montam a URL de busca do provedor com o termo digitado pelo
 * usuário e abrem em nova aba. O href é atualizado a cada tecla digitada.
 */

export const EXTERNAL_PROVIDERS = {
  google: { nome: 'Google', buscar: (q) => `https://www.google.com/search?q=${q}` },
  bing: { nome: 'Bing', buscar: (q) => `https://www.bing.com/search?q=${q}` },
  duckduckgo: { nome: 'DuckDuckGo', buscar: (q) => `https://duckduckgo.com/?q=${q}` },
  scholar: { nome: 'Google Acadêmico', buscar: (q) => `https://scholar.google.com/scholar?q=${q}` },
  stepbible: { nome: 'STEP Bible', buscar: (q) => `https://stepbible.org/?q=${q}` }
};

/** Termo atual do campo de busca do catálogo ('' quando vazio). */
export function termoDeBuscaExterna() {
  const campo = document.getElementById('filter-q');
  return campo ? String(campo.value || '').trim().replace(/\s+/g, ' ') : '';
}

/** URL de busca do provedor para o termo informado. */
export function urlDeBuscaExterna(provedor, termo) {
  const spec = EXTERNAL_PROVIDERS[provedor];
  if (!spec) return null;
  return spec.buscar(encodeURIComponent(termo));
}

/**
 * Mantém os botões de busca externa coerentes com o termo digitado:
 * href correto, rótulo do termo visível e estado desabilitado quando vazio.
 */
export function syncExternalSearch() {
  const termo = termoDeBuscaExterna();
  const tem = termo.length > 0;

  // Campo espelho da seção "Descoberta externa" (se existir na página)
  const espelho = document.getElementById('external-q');
  if (espelho && espelho.value !== termo) espelho.value = termo;

  document.querySelectorAll('[data-external-search]').forEach((a) => {
    const provedor = a.getAttribute('data-external-search');
    const spec = EXTERNAL_PROVIDERS[provedor];
    if (!spec) return;

    if (tem) {
      a.setAttribute('href', spec.buscar(encodeURIComponent(termo)));
      a.removeAttribute('aria-disabled');
      a.removeAttribute('tabindex');
      a.classList.remove('is-disabled');
    } else {
      // Sem termo não há o que buscar: botão fica visível, porém inerte.
      a.setAttribute('href', spec.buscar(''));
      a.setAttribute('aria-disabled', 'true');
      a.setAttribute('tabindex', '-1');
      a.classList.add('is-disabled');
    }
  });

  document.querySelectorAll('[data-external-term]').forEach((n) => {
    n.textContent = tem ? `“${termo}”` : 'o termo do campo acima';
  });
  document.querySelectorAll('[data-external-hint]').forEach((n) => {
    n.hidden = tem;
  });
  document.querySelectorAll('[data-external-ready]').forEach((n) => {
    n.hidden = !tem;
  });

  return termo;
}

export function initExternalDiscovery() {
  if (!document.querySelector('[data-external-search]')) return;

  const espelho = document.getElementById('external-q');
  const principal = document.getElementById('filter-q');
  if (espelho && principal && !espelho.dataset.osaBound) {
    espelho.dataset.osaBound = '1';
    espelho.addEventListener('input', () => {
      principal.value = espelho.value;
      principal.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  syncExternalSearch();

  document.querySelectorAll('[data-external-search]').forEach((a) => {
    if (a.dataset.osaBound) return;
    a.dataset.osaBound = '1';
    if (!a.getAttribute('target')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer external';
    }
    a.addEventListener('click', (ev) => {
      if (a.getAttribute('aria-disabled') === 'true') {
        ev.preventDefault();
        announce('Digite um termo em “Buscar recursos” para habilitar a busca externa.');
        const campo = document.getElementById('filter-q');
        if (campo) campo.focus();
        return;
      }
      const provedor = a.getAttribute('data-external-search');
      const nome = (EXTERNAL_PROVIDERS[provedor] || {}).nome || provedor;
      announce(`Abrindo busca de “${termoDeBuscaExterna()}” no ${nome} em nova aba. Este site não executa buscas automaticamente.`);
    });
  });
}

/* ---------------- Bootstrap do catálogo ---------------- */

export function initCatalog() {
  migrateLegacyIfNeeded();

  const results = document.getElementById('resource-results');
  if (!results) return; // página sem catálogo: sem listeners órfãos

  const q = document.getElementById('filter-q');
  if (q && !q.dataset.osaBound) {
    q.dataset.osaBound = '1';
    q.addEventListener('input', () => {
      state.query = q.value;
      syncExternalSearch();   // mantém a busca externa igual ao termo digitado
      render();
    });
  }
  const idiom = document.getElementById('filter-idioma');
  if (idiom && !idiom.dataset.osaBound) {
    idiom.dataset.osaBound = '1';
    idiom.addEventListener('change', () => { state.idioma = idiom.value; render(); });
  }
  const niv = document.getElementById('filter-nivel');
  if (niv && !niv.dataset.osaBound) {
    niv.dataset.osaBound = '1';
    niv.addEventListener('change', () => { state.nivel = niv.value; render(); });
  }
  const fav = document.getElementById('filter-fav');
  if (fav && !fav.dataset.osaBound) {
    fav.dataset.osaBound = '1';
    fav.addEventListener('change', () => { state.somenteFavoritos = fav.checked; render(); });
  }
  document.querySelectorAll('[data-clear-filters]').forEach((b) => {
    if (b.dataset.osaBound) return;
    b.dataset.osaBound = '1';
    b.addEventListener('click', () => clearFilters());
  });

  // Abas catálogo / coleção
  document.querySelectorAll('[data-catalog-tab]').forEach((tab) => {
    if (tab.dataset.osaBound) return;
    tab.dataset.osaBound = '1';
    tab.addEventListener('click', () => {
      const mode = tab.getAttribute('data-catalog-tab');
      state.colecaoMode = mode === 'colecao';
      document.querySelectorAll('[data-catalog-tab]').forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      const pCatalog = document.getElementById('panel-catalogo');
      const pColecao = document.getElementById('panel-colecao');
      if (pCatalog) pCatalog.hidden = state.colecaoMode;
      if (pColecao) pColecao.hidden = !state.colecaoMode;
      render();
    });
  });

  // Deep link da "Minha coleção": fora do modo coleção o painel fica oculto
  // (o catálogo completo é o padrão da página). Chegando por #panel-colecao
  // — menu lateral, gaveta ou link direto — ativamos a aba correspondente e
  // levamos o painel ao visor; sem isto a âncora cai num elemento invisível.
  const revelarColecaoAncorada = () => {
    if (location.hash !== '#panel-colecao') return;
    const painel = document.getElementById('panel-colecao');
    if (!painel) return;
    if (painel.hidden) document.querySelector('[data-catalog-tab="colecao"]')?.click();
    requestAnimationFrame(() => painel.scrollIntoView({ block: 'start' }));
  };
  if (!window.__osaDeepLinkColecao) {
    window.__osaDeepLinkColecao = true;
    window.addEventListener('hashchange', revelarColecaoAncorada);
  }
  revelarColecaoAncorada();

  document.querySelectorAll('[data-add-resource]').forEach((b) => {
    if (b.dataset.osaBound) return;
    b.dataset.osaBound = '1';
    b.addEventListener('click', () => openResourceForm(null));
  });
  document.querySelectorAll('[data-export-json]').forEach((b) => {
    if (b.dataset.osaBound) return;
    b.dataset.osaBound = '1';
    b.addEventListener('click', () => exportJSON());
  });
  document.querySelectorAll('[data-export-pdf]').forEach((b) => {
    if (b.dataset.osaBound) return;
    b.dataset.osaBound = '1';
    b.addEventListener('click', () => exportPDF());
  });

  const importInput = document.getElementById('import-file');
  const importPolicy = document.getElementById('import-policy');
  if (importInput && !importInput.dataset.osaBound) {
    importInput.dataset.osaBound = '1';
    importInput.addEventListener('change', () => {
      const f = importInput.files && importInput.files[0];
      if (f) importJSONFile(f, importPolicy ? importPolicy.value : 'keep-existing');
      importInput.value = '';
    });
  }

  const form = document.getElementById('form-recurso');
  if (form && !form.dataset.osaBound) {
    form.dataset.osaBound = '1';
    form.addEventListener('submit', onSubmitResource);
  }
  const dlg = document.getElementById('dialog-recurso');
  if (dlg) {
    const cancel = dlg.querySelector('#recurso-cancel');
    if (cancel && !cancel.dataset.osaBound) {
      cancel.dataset.osaBound = '1';
      cancel.addEventListener('click', () => closeResourceForm());
    }
  }
  const confirmDlg = document.getElementById('dialog-confirmar');
  if (confirmDlg) {
    const ok = confirmDlg.querySelector('#confirmar-ok');
    const cancel = confirmDlg.querySelector('#confirmar-cancel');
    if (ok && !ok.dataset.osaBound) {
      ok.dataset.osaBound = '1';
      ok.addEventListener('click', () => doDeleteConfirmed());
    }
    if (cancel && !cancel.dataset.osaBound) {
      cancel.dataset.osaBound = '1';
      cancel.addEventListener('click', () => {
        try { confirmDlg.close(); } catch { confirmDlg.removeAttribute('open'); }
      });
    }
  }

  // Storage events (outras abas)
  window.addEventListener('storage', (ev) => {
    if (!ev.key) return;
    if ([KEYS.VAULT, KEYS.USER_RESOURCES, KEYS.LEGACY.FAVORITES, KEYS.LEGACY.USER_RESOURCES].includes(ev.key)) {
      render();
    }
  });

  window.addEventListener('online', () => { state.offline = false; if (state.error) loadSeed(); });
  window.addEventListener('offline', () => { state.offline = true; });

  initExternalDiscovery();
  loadSeed();
}
