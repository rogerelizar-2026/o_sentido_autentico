/* ==========================================================================
 * storage.js — persistência versionada, local, no dispositivo.
 * Nunca apaga dados do usuário: migra chaves legadas sem removê-las.
 * ========================================================================== */

export const SCHEMA_VERSION = 1;

/** Novos nomes de espaços recomendados pela especificação. */
export const KEYS = {
  TERMS_ACCEPTED: 'osa:terms:accepted',        // {acceptedAt, schemaVersion}
  TERMS_PRESENTED: 'osa:terms:presentationSeen', // apenas a apresentação foi exibida
  VAULT: 'osa:vault:favorites',                // string[] de ids
  USER_RESOURCES: 'osa:vault:userResources',   // objeto[]
  READING: 'osa:reading:positions',            // {pageId: {anchor, at}}
  THEME: 'osa:theme',
  A11Y: 'osa:a11y:prefs',
  CHECKLIST: 'osa:study:checklist',
  LEGACY: {
    FAVORITES: 'biblicalVault',
    USER_RESOURCES: 'userBiblicalResources',
    THEME: 'theme',
    WELCOME_DISMISSED: 'welcomeModalDismissed',
    PRESENTATION_COMPLETED: 'presentationCompleted'
  }
};

function safeGet(key) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try { window.localStorage.setItem(key, value); return true; } catch { return false; }
}

export function getJSON(key, fallback) {
  const raw = safeGet(key);
  if (raw == null) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
}

export function setJSON(key, value) {
  return safeSet(key, JSON.stringify(value));
}

/* ---------------- Favoritos ---------------- */

export function getFavorites() {
  const current = getJSON(KEYS.VAULT, null);
  if (Array.isArray(current)) return current.filter((x) => typeof x === 'string');
  // Migração da chave legada biblicalVault (nunca apaga)
  const legacy = getJSON(KEYS.LEGACY.FAVORITES, []);
  const migrated = Array.isArray(legacy) ? legacy.filter((x) => typeof x === 'string') : [];
  if (migrated.length) setJSON(KEYS.VAULT, migrated);
  return migrated;
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  let added;
  if (idx >= 0) { favs.splice(idx, 1); added = false; }
  else { favs.push(id); added = true; }
  setJSON(KEYS.VAULT, favs);
  // Mantém também a chave legada espelhada (sem deletar) para compatibilidade
  safeSet(KEYS.LEGACY.FAVORITES, JSON.stringify(favs));
  return { favorites: favs, added };
}

/* ---------------- Recursos do usuário ---------------- */

const USER_RESOURCE_FIELDS = ['id', 'title', 'author', 'category', 'language', 'level', 'type', 'free', 'link', 'description', 'userAdded'];

export function sanitizeUserResource(obj) {
  if (!obj || typeof obj !== 'object') return null;
  const out = {};
  for (const f of USER_RESOURCE_FIELDS) {
    if (typeof obj[f] === 'string') out[f] = obj[f];
    else if (typeof obj[f] === 'boolean') out[f] = obj[f];
  }
  if (!out.id || !out.title) return null;
  if (typeof out.free !== 'boolean') out.free = false;
  if (typeof out.description !== 'string') out.description = '';
  if (typeof out.link !== 'string') out.link = '';
  out.userAdded = true;
  return out;
}

export function getUserResources() {
  const current = getJSON(KEYS.USER_RESOURCES, null);
  if (Array.isArray(current)) return current.map(sanitizeUserResource).filter(Boolean);
  const legacy = getJSON(KEYS.LEGACY.USER_RESOURCES, []);
  const migrated = Array.isArray(legacy) ? legacy.map(sanitizeUserResource).filter(Boolean) : [];
  if (migrated.length) setJSON(KEYS.USER_RESOURCES, migrated);
  return migrated;
}

export function saveUserResources(list) {
  const ok = setJSON(KEYS.USER_RESOURCES, list);
  if (ok) safeSet(KEYS.LEGACY.USER_RESOURCES, JSON.stringify(list));
  return ok;
}

export function addUserResource(res) {
  const list = getUserResources();
  if (list.some((r) => r.id === res.id)) return { ok: false, reason: 'duplicate' };
  list.push(res);
  const ok = saveUserResources(list);
  return { ok, resources: list };
}

export function updateUserResource(id, patch) {
  const list = getUserResources();
  const i = list.findIndex((r) => r.id === id);
  if (i < 0) return { ok: false, reason: 'notfound' };
  list[i] = { ...list[i], ...sanitizeUserResource({ ...list[i], ...patch, id, userAdded: true }) };
  const ok = saveUserResources(list);
  return { ok, resources: list };
}

export function deleteUserResource(id) {
  const list = getUserResources();
  const removed = list.find((r) => r.id === id);
  const next = list.filter((r) => r.id !== id);
  const ok = saveUserResources(next);
  return { ok, resources: next, removed };
}

/* ---------------- Termos ---------------- */

export function hasAcceptedTerms() {
  const t = getJSON(KEYS.TERMS_ACCEPTED, null);
  return !!(t && t.acceptedAt);
}

export function acceptTerms() {
  return setJSON(KEYS.TERMS_ACCEPTED, { acceptedAt: new Date().toISOString(), schemaVersion: SCHEMA_VERSION });
}

export function hasSeenPresentation() {
  // "presentationCompleted"/"welcomeModalDismissed" legados NÃO equivalem a aceite.
  const seenNew = safeGet(KEYS.TERMS_PRESENTED) === '1';
  const legacySeen = safeGet(KEYS.LEGACY.WELCOME_DISMISSED) === 'true'
    || safeGet(KEYS.LEGACY.WELCOME_DISMISSED) === '1'
    || safeGet(KEYS.LEGACY.PRESENTATION_COMPLETED) === 'true'
    || safeGet(KEYS.LEGACY.PRESENTATION_COMPLETED) === '1';
  return seenNew || legacySeen;
}

export function markPresentationSeen() {
  safeSet(KEYS.TERMS_PRESENTED, '1');
}

/* ---------------- Posições de leitura ---------------- */

export function getReadingPositions() {
  return getJSON(KEYS.READING, {}) || {};
}

export function saveReadingPosition(pageId, anchor) {
  const all = getReadingPositions();
  all[pageId] = { anchor: String(anchor || ''), at: new Date().toISOString() };
  return setJSON(KEYS.READING, all);
}

export function getResumeTarget(entryPageId) {
  const all = getReadingPositions();
  // posição mais recente de qualquer página de conteúdo
  let best = null;
  for (const [pageId, pos] of Object.entries(all)) {
    if (!pos || !pos.anchor) continue;
    if (!best || String(pos.at) > String(best.at)) best = { pageId, ...pos };
  }
  return best;
}

/* ---------------- Preferências de acessibilidade ---------------- */

export function getA11yPrefs() {
  return getJSON(KEYS.A11Y, { fontScale: 1, dyslexia: false, highContrast: false }) || {};
}

export function setA11yPref(patch) {
  const prefs = { fontScale: 1, dyslexia: false, highContrast: false, ...getA11yPrefs(), ...patch };
  setJSON(KEYS.A11Y, prefs);
  return prefs;
}

/* ---------------- Checklist de estudo (local, não é "progresso") ---------------- */

export function getChecklist(pageId) {
  const all = getJSON(KEYS.CHECKLIST, {}) || {};
  return all[pageId] || {};
}

export function setChecklistItem(pageId, itemKey, value) {
  const all = getJSON(KEYS.CHECKLIST, {}) || {};
  all[pageId] = all[pageId] || {};
  all[pageId][itemKey] = !!value;
  all[pageId].at = new Date().toISOString();
  setJSON(KEYS.CHECKLIST, all);
}

/* ---------------- Exportação / Importação JSON ---------------- */

export const EXPORT_SCHEMA = 'osa-colecao';
export const EXPORT_SCHEMA_VERSION = 1;
export const IMPORT_MAX_BYTES = 512 * 1024; // 512 KB

export const URL_PROTOCOL_ALLOWLIST = ['https:', 'http:'];

export function isAllowedUrl(value) {
  if (!value || typeof value !== 'string') return false;
  try {
    const u = new URL(value);
    return URL_PROTOCOL_ALLOWLIST.includes(u.protocol);
  } catch {
    return false;
  }
}

export function buildExportPayload() {
  return {
    app: 'O Sentido Autêntico',
    schema: EXPORT_SCHEMA,
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    favoritos: getFavorites(),
    recursosUsuario: getUserResources()
  };
}

/**
 * Valida e interpreta JSON importado.
 * Política de duplicatas: 'keep-existing' (padrão) mantém o registro atual.
 * @returns {{ok:true, favorites:string[], resources:object[], added:number, skipped:number, updated:number}}
 *          | {ok:false, error:string}
 */
export function parseImport(text, { duplicatePolicy = 'keep-existing' } = {}) {
  if (typeof text !== 'string' || !text.trim()) {
    return { ok: false, error: 'Arquivo vazio ou conteúdo inválido.' };
  }
  const byteSize = new TextEncoder().encode(text).length;
  if (byteSize > IMPORT_MAX_BYTES) {
    return { ok: false, error: `Arquivo acima do limite de ${IMPORT_MAX_BYTES / 1024} KB.` };
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: 'JSON corrompido ou malformado. Nada foi alterado.' };
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: 'Estrutura inesperada: o arquivo não é um objeto de coleção OSA.' };
  }
  if (data.schema !== EXPORT_SCHEMA) {
    return { ok: false, error: 'Schema não reconhecido (esperado "osa-colecao").' };
  }
  if (typeof data.schemaVersion !== 'number' || data.schemaVersion < 1) {
    return { ok: false, error: 'schemaVersion ausente ou inválido.' };
  }
  if (data.schemaVersion > EXPORT_SCHEMA_VERSION) {
    return { ok: false, error: `Versão de schema (${data.schemaVersion}) maior que a suportada (${EXPORT_SCHEMA_VERSION}).` };
  }

  const favIn = Array.isArray(data.favoritos) ? data.favoritos.filter((x) => typeof x === 'string') : [];
  const resIn = Array.isArray(data.recursosUsuario) ? data.recursosUsuario : [];

  let resources = getUserResources();
  let added = 0, skipped = 0, updated = 0;
  for (const raw of resIn) {
    const clean = sanitizeUserResource(raw);
    if (!clean) { skipped++; continue; }
    if (!isAllowedUrl(clean.link) && clean.link) {
      // recusa protocolo perigoso, mas registra como pulado
      skipped++;
      continue;
    }
    const i = resources.findIndex((r) => r.id === clean.id);
    if (i >= 0) {
      if (duplicatePolicy === 'replace') { resources[i] = { ...resources[i], ...clean }; updated++; }
      else skipped++; // keep-existing
    } else {
      resources.push(clean);
      added++;
    }
  }

  const existingFavs = getFavorites();
  const mergedFavs = [...existingFavs];
  for (const f of favIn) {
    if (!mergedFavs.includes(f)) mergedFavs.push(f);
  }

  // Persistência (pode falhar por quota — sinalizado pelo chamador via try)
  const okRes = saveUserResources(resources);
  const okFav = setJSON(KEYS.VAULT, mergedFavs);
  if (!okRes || !okFav) {
    return { ok: false, error: 'Falha ao gravar no armazenamento local (quota?). Seus dados anteriores foram mantidos.' };
  }

  return { ok: true, favorites: mergedFavs, resources, added, skipped, updated };
}

/** Migra silenciosamente qualquer dado legado para as chaves novas (sem deletar). */
export function migrateLegacyIfNeeded() {
  getFavorites();
  getUserResources();
}
