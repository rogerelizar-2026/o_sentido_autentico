/* ==========================================================================
   AutenticSense — Roteador SPA por hash (offline-friendly)
   Cada rota: { path: '/hebraico', view: { title, desc, render(), mount?() } }
   ========================================================================== */

export function initRouter({ routes, root, onRoute }) {
  const table = new Map(routes.map((r) => [r.path, r]));
  const notFound = table.get('*');

  function currentRoute() {
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path] = raw.split('?');
    return { route: table.get(path) || notFound, path };
  }

  async function render() {
    const { route, path } = currentRoute();
    if (!route) return;
    try {
      root.innerHTML = await route.view.render({ path });
      if (typeof route.view.mount === 'function') {
        await route.view.mount(root, { path });
      }
    } catch (err) {
      console.error('[router] falha ao renderizar', path, err);
      root.innerHTML = '<div class="container section"><h1>Erro inesperado</h1>' +
        '<p>Não foi possível carregar esta página. Tente voltar ao <a href="#/">início</a>.</p></div>';
    }
    if (typeof onRoute === 'function') onRoute(route, path);
  }

  window.addEventListener('hashchange', render);
  render();
}
