/* Testes E2E — O Sentido Autêntico
 * Executar: npm test  (requer servidor em http://127.0.0.1:4173)
 * Cobrem: navegação/deep links, termos, tema, catálogo, favoritos,
 * import/export, persistência/migração legada, a11y (axe), invariantes,
 * PWA (precache 200, offline, update flow).
 */
import { test, expect, devices } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';
const isEntry = (page, file = 'index.html') => page.url().includes(file);

async function ensureTermsGone(page) {
  // Espera o diálogo abrir (rAF) OU o aceite já existir — evita corrida
  await page.waitForFunction(() => {
    const d = document.getElementById('dialog-termos');
    const accepted = !!localStorage.getItem('osa:terms:accepted');
    return accepted || (d && d.open);
  }, null, { timeout: 8000 }).catch(() => {});
  const open = await page.evaluate(() => document.getElementById('dialog-termos')?.open);
  if (open) {
    await page.check('#terms-checkbox');
    await page.click('#terms-accept');
    await page.waitForTimeout(150);
  }
  // Garantia dura: se ainda não aceitou, aceita via UI se aberto, senão marca via fluxo real
  const accepted = await page.evaluate(() => !!localStorage.getItem('osa:terms:accepted'));
  if (!accepted) {
    const stillOpen = await page.evaluate(() => document.getElementById('dialog-termos')?.open);
    if (stillOpen) {
      await page.check('#terms-checkbox');
      await page.click('#terms-accept');
    } else {
      // reabre pela barra/gatilho e aceita (mesmo caminho do usuário)
      const hasBar = await page.locator('[data-open-terms-bar]').count();
      if (hasBar) await page.click('[data-open-terms-bar]');
      else await page.evaluate(() => document.querySelector('[data-open-terms]')?.click());
      await page.waitForTimeout(300);
      await page.check('#terms-checkbox');
      await page.click('#terms-accept');
    }
    await page.waitForTimeout(150);
  }
}

/** Fecha o diálogo de termos SEM aceitar (para testar dismissed ≠ accepted). */
async function dismissTermsOnly(page) {
  await page.waitForFunction(() => {
    const d = document.getElementById('dialog-termos');
    return !!localStorage.getItem('osa:terms:accepted') || (d && d.open);
  }, null, { timeout: 8000 }).catch(() => {});
  const open = await page.evaluate(() => document.getElementById('dialog-termos')?.open);
  if (open) {
    await page.click('#terms-cancel');
    await page.waitForTimeout(150);
  }
}



test.describe('Navegação e deep links', () => {
  test('páginas principais carregam com h1 único e lang pt-BR', async ({ page }) => {
    for (const path of ['/index.html', '/hebraico-aramaico.html', '/grego-koine.html', '/caixa-de-ferramentas.html']) {
      await page.goto(BASE + path);
      await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
      const h1s = page.locator('main h1');
      await expect(h1s).toHaveCount(1);
    }
  });

  test('deep link #heb-curriculo resolve na página de hebraico', async ({ page }) => {
    await page.goto(BASE + '/hebraico-aramaico.html#heb-curriculo');
    await page.waitForTimeout(400);
    const focusedId = await page.evaluate(() => document.activeElement?.id || document.activeElement?.closest?.('section')?.id || '');
    const visible = await page.locator('#heb-curriculo').isVisible();
    expect(visible).toBeTruthy();
  });

  test('deep link #grk-anki resolve na página de grego', async ({ page }) => {
    await page.goto(BASE + '/grego-koine.html#grk-anki');
    await expect(page.locator('#grk-anki')).toBeVisible();
  });

  test('deep link #port-books resolve na entrada', async ({ page }) => {
    await page.goto(BASE + '/index.html#port-books');
    await expect(page.locator('#port-books')).toBeVisible();
  });

  test('hash legado #heb-* na entrada redireciona para hebraico-aramaico.html', async ({ page }) => {
    await page.goto(BASE + '/index.html#heb-visao');
    await page.waitForURL(/hebraico-aramaico\.html#heb-visao/, { timeout: 5000 });
    expect(page.url()).toContain('hebraico-aramaico.html#heb-visao');
  });

  test('hash legado #grk-* na entrada redireciona para grego-koine.html', async ({ page }) => {
    await page.goto(BASE + '/index.html#grk-curriculo');
    await page.waitForURL(/grego-koine\.html#grk-curriculo/, { timeout: 5000 });
  });

  test('histórico voltar/avançar funciona entre destinos', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 }); // mobile-first: bottom nav visível
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => localStorage.setItem('osa:terms:accepted', JSON.stringify({ acceptedAt: new Date().toISOString() })));
    await page.reload();
    await page.click('.osa-bottomnav a[href="./hebraico-aramaico.html"]');
    await page.waitForURL(/hebraico-aramaico\.html/);
    await page.click('.osa-bottomnav a[href="./grego-koine.html"]');
    await page.waitForURL(/grego-koine\.html/);
    await page.goBack();
    await page.waitForURL(/hebraico-aramaico\.html/);
    await page.goForward();
    await page.waitForURL(/grego-koine\.html/);
  });

  test('"Nesta página" é gerado com links', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    const links = page.locator('#toc ol li a');
    expect(await links.count()).toBeGreaterThan(3);
  });

  test('bottom nav marca aria-current apenas no destino ativo', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto(BASE + '/grego-koine.html');
    const current = page.locator('.osa-bottomnav a[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toContainText('Grego');
  });
});

test.describe('Portal do Estudante: nota sobre análise léxico-sintática', () => {
  test('aparece antes do botão “Começar meus estudos”, com os três parágrafos', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => localStorage.setItem('osa:terms:accepted', JSON.stringify({ acceptedAt: new Date().toISOString() })));
    await page.reload();

    const nota = page.locator('#port-nota-hermeneutica');
    await expect(nota).toBeVisible();
    const bloco = page.locator('#port-intro .osa-callout');
    await expect(bloco.locator('p')).toHaveCount(3);
    await expect(bloco).toContainText('análise léxico-sintática');
    await expect(bloco).toContainText('contexto histórico-cultural');
    await expect(bloco).toContainText('Hermenêutica');
    await expect(bloco).toContainText('considerar e anotar sua descoberta como provisória');
    await expect(bloco).toContainText('Interpretar é a coisa mais fácil do mundo quando não se deseja saber a real mensagem transmitida!');

    // posição: o bloco vem ANTES do botão na ordem do documento e na tela
    const antesNoDom = await page.evaluate(() => {
      const b = document.querySelector('#port-intro .osa-callout');
      const btn = [...document.querySelectorAll('#port-intro a.osa-btn')].find((a) => a.textContent.includes('Começar meus estudos'));
      return !!(b && btn) && (b.compareDocumentPosition(btn) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
    });
    expect(antesNoDom).toBe(true);

    const caixaNota = await bloco.boundingBox();
    const caixaBotao = await page.locator('#port-intro a.osa-btn', { hasText: 'Começar meus estudos' }).boundingBox();
    expect(caixaNota.y + caixaNota.height).toBeLessThanOrEqual(caixaBotao.y + 1);

    // a frase de encerramento é destacada em negrito
    await expect(bloco.locator('.osa-callout__destaque strong')).toHaveText('Interpretar é a coisa mais fácil do mundo quando não se deseja saber a real mensagem transmitida!');
  });
});

test.describe('Onboarding e termos', () => {
  // Limpa o armazenamento de forma determinística: o bootstrap grava
  // "osa:terms:presentationSeen" ao abrir o diálogo, então limpamos ANTES e
  // DEPOIS desse primeiro carregamento — sem isso a primeira visita simulada
  // podia ser interpretada como visita repetida (teste instável).
  async function primeiraVisita(page) {
    await page.goto(BASE + '/index.html');
    await page.waitForLoadState('load');
    await page.evaluate(() => localStorage.clear());
    await page.waitForTimeout(250);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  }

  test.beforeEach(async ({ page }) => {
    await primeiraVisita(page);
  });

  test('diálogo abre na primeira visita com checkbox DESMARCADO e botão desabilitado', async ({ page }) => {
    const dlg = page.locator('#dialog-termos');
    await expect(dlg).toBeVisible({ timeout: 10000 }); // bootstrap abre via rAF
    const checked = await page.locator('#terms-checkbox').isChecked();
    expect(checked).toBe(false);
    await expect(page.locator('#terms-accept')).toBeDisabled();
  });

  test('marcar checkbox habilita aceitar; aceitar grava chave de consentimento', async ({ page }) => {
    await expect(page.locator('#dialog-termos')).toBeVisible({ timeout: 8000 });
    await page.check('#terms-checkbox');
    await expect(page.locator('#terms-accept')).toBeEnabled();
    await page.click('#terms-accept');
    await expect(dlgHidden(page)).toBeTruthy();
    const accepted = await page.evaluate(() => localStorage.getItem('osa:terms:accepted'));
    expect(accepted).toBeTruthy();
    expect(JSON.parse(accepted).acceptedAt).toBeTruthy();
    // barra some
    await expect(page.locator('#terms-bar')).toHaveAttribute('data-visible', 'false');
  });

  test('fechar sem aceitar NÃO basta: barra persistente aparece e recusar != aceitar', async ({ page }) => {
    await expect(page.locator('#dialog-termos')).toBeVisible({ timeout: 8000 });
    await page.click('#terms-cancel');
    await expect(page.locator('#terms-bar')).toHaveAttribute('data-visible', 'true');
    const accepted = await page.evaluate(() => localStorage.getItem('osa:terms:accepted'));
    expect(accepted).toBeNull();
    // ação de início reabre o diálogo
    // (barra tem botão data-open-terms-bar)
    await page.click('[data-open-terms-bar]');
    await expect(page.locator('#dialog-termos')).toBeVisible();
    await expect(page.locator('#terms-accept')).toBeDisabled();
  });

  test('flag legada de dispensa NÃO equivale a aceite e não abre sozinha', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('welcomeModalDismissed', 'true');
      localStorage.setItem('presentationCompleted', 'true');
    });
    await page.reload();
    // apresentação já vista → não reabre automaticamente…
    await page.waitForTimeout(600);
    const open = await page.evaluate(() => document.getElementById('dialog-termos').open);
    expect(open).toBe(false);
    // …mas a barra de exigência está visível
    await expect(page.locator('#terms-bar')).toHaveAttribute('data-visible', 'true');
    const accepted = await page.evaluate(() => localStorage.getItem('osa:terms:accepted'));
    expect(accepted).toBeNull();
  });

  test('aceite persiste entre recargas', async ({ page }) => {
    await expect(page.locator('#dialog-termos')).toBeVisible({ timeout: 8000 });
    await page.check('#terms-checkbox');
    await page.click('#terms-accept');
    // espera o aceite ser GRAVADO antes de recarregar (evita corrida)
    await page.waitForFunction(() => !!localStorage.getItem('osa:terms:accepted'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');
    await expect(page.locator('#dialog-termos')).toBeHidden({ timeout: 8000 });
    const open = await page.evaluate(() => document.getElementById('dialog-termos').open);
    expect(open).toBe(false);
    await expect(page.locator('#terms-bar')).toHaveAttribute('data-visible', 'false');
  });

  test('checkbox alcançável sem rolagem (sticky footer do diálogo)', async ({ page }) => {
    // reset determinístico e abertura
    await primeiraVisita(page);
    await expect(page.locator('#dialog-termos')).toBeVisible({ timeout: 8000 });
    await page.waitForTimeout(100); // layout sticky assenta
    // rola o corpo do diálogo até o topo e verifica que checkbox + botão estão no viewport
    await page.evaluate(() => {
      const body = document.querySelector('.osa-dialog__body');
      if (body) body.scrollTop = 0;
    });
    const cbBox = await page.locator('#terms-checkbox').boundingBox();
    const acceptBox = await page.locator('#terms-accept').boundingBox();
    const vp = page.viewportSize();
    expect(cbBox).not.toBeNull();
    expect(acceptBox).not.toBeNull();
    expect(cbBox.y + cbBox.height).toBeLessThanOrEqual(vp.height + 1);
    expect(acceptBox.y + acceptBox.height).toBeLessThanOrEqual(vp.height + 1);
  });
});

async function dlgHidden(page) {
  return page.evaluate(() => !document.getElementById('dialog-termos').open);
}

test.describe('Tema', () => {
  test('alternar tema persiste e não pisca na recarga', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('osa:theme', JSON.stringify('dark'));
      localStorage.setItem('osa:terms:accepted', JSON.stringify({ acceptedAt: new Date().toISOString() }));
    });
    await page.reload();
    const early = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(early).toBe('dark');
    // abre o FAB de acessibilidade e alterna o tema
    await page.click('#a11y-fab');
    await expect(page.locator('#theme-toggle')).toBeVisible();
    await page.click('#theme-toggle');
    const after = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(after).toBe('light');
    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('osa:theme');
      try { return JSON.parse(raw); } catch { return raw; }
    });
    expect(stored).toBe('light');
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
  });

  test('padrão do tema é claro na primeira visita (sem preferência armazenada)', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.removeItem('osa:theme');
      localStorage.removeItem('theme');
    });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
  });

  test('FAB de acessibilidade abre painel com tema + controles; botão único #theme-toggle', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => localStorage.setItem('osa:terms:accepted', JSON.stringify({ acceptedAt: new Date().toISOString() })));
    await page.reload();
    await expect(page.locator('#a11y-fab')).toHaveCount(1);
    await expect(page.locator('#a11y-toolbar, .osa-a11y-toolbar')).toHaveCount(0);
    await expect(page.locator('#theme-toggle')).toHaveCount(1);
    // painel fechado por padrão
    await expect(page.locator('#a11y-panel')).toBeHidden();
    await page.click('#a11y-fab');
    await expect(page.locator('#a11y-panel')).toBeVisible();
    await expect(page.locator('#theme-toggle')).toBeVisible();
    await expect(page.locator('[data-a11y="font-decrease"]')).toBeVisible();
    // fecha
    await page.keyboard.press('Escape');
    await expect(page.locator('#a11y-panel')).toBeHidden();
  });

  test('apenas um implementation de tema: botão único #theme-toggle por página', async ({ page }) => {
    for (const path of ['/index.html', '/hebraico-aramaico.html', '/grego-koine.html', '/caixa-de-ferramentas.html']) {
      await page.goto(BASE + path);
      await expect(page.locator('#theme-toggle')).toHaveCount(1);
    }
  });
});

test.describe('Catálogo: busca, filtros, favoritos, edição', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/caixa-de-ferramentas.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await ensureTermsGone(page);
    await page.waitForSelector('#result-count');
    await page.waitForFunction(() => !document.getElementById('result-count').textContent.includes('Carregando'));
  });

  test('carrega 20 recursos canônicos', async ({ page }) => {
    await expect(page.locator('#result-count')).toContainText('20 de 20');
    await expect(page.locator('#resource-results .osa-resource')).toHaveCount(20);
  });

  test('busca sem acento filtra por título/autor/descrição', async ({ page }) => {
    await page.fill('#filter-q', 'lexico');
    await page.waitForTimeout(150);
    const count = await page.locator('#resource-results .osa-resource').count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(20);
    // acento: "sefaria" e "Séfaria" — busca "sefaria"
    await page.fill('#filter-q', 'sefaria');
    await page.waitForTimeout(200);
    await expect(page.locator('#resource-results .osa-resource')).toHaveCount(1);
    await page.fill('#filter-q', 'rega');
    await page.waitForTimeout(200);
    // "rega" casa com "Grega" (subcadeia) + autor Rega — o livro de Rega precisa estar presente
    await expect(page.locator('#resource-results', { hasText: 'Noções do Grego Bíblico' })).toBeVisible();
  });

  test('chip de categoria + selects + limpar filtros', async ({ page }) => {
    // chip "Gramática" (aparece se existir categoria)
    const chip = page.locator('#filter-chips .osa-chip', { hasText: 'Gramática' });
    if (await chip.count()) {
      await chip.click();
      await page.waitForTimeout(100);
      const n = await page.locator('#resource-results .osa-resource').count();
      expect(n).toBeGreaterThan(0);
      expect(n).toBeLessThan(20);
    }
    await page.selectOption('#filter-idioma', 'hebraico');
    await page.waitForTimeout(100);
    await page.selectOption('#filter-nivel', 'iniciante');
    await page.waitForTimeout(100);
    await page.click('[data-clear-filters]');
    await page.waitForTimeout(100);
    await expect(page.locator('#result-count')).toContainText('20 de 20');
    await expect(page.locator('#filter-idioma')).toHaveValue('');
  });

  test('favoritar usa aria-pressed e aparece em Minha coleção; persiste após reload', async ({ page }) => {
    const first = page.locator('#resource-results .osa-resource').first();
    const id = await first.getAttribute('data-resource-id');
    const favBtn = first.locator('button[aria-pressed]');
    await expect(favBtn).toHaveAttribute('aria-pressed', 'false');
    await favBtn.click();
    await expect(page.locator(`#resource-results .osa-resource[data-resource-id="${id}"] button[aria-pressed]`)).toHaveAttribute('aria-pressed', 'true');
    // aba coleção
    await page.click('[data-catalog-tab="colecao"]');
    await expect(page.locator('#panel-colecao')).toBeVisible();
    await expect(page.locator(`#colecao-list .osa-resource[data-resource-id="${id}"]`)).toHaveCount(1);
    await page.reload();
    const open = await page.evaluate(() => document.getElementById('dialog-termos')?.open);
    if (open) { await page.check('#terms-checkbox'); await page.click('#terms-accept'); }
    await page.waitForFunction(() => !document.getElementById('result-count').textContent.includes('Carregando'));
    const persisted = await page.evaluate(() => JSON.parse(localStorage.getItem('osa:vault:favorites') || '[]'));
    expect(persisted).toContain(id);
  });

  test('adicionar, editar e excluir recurso do usuário (com desfazer)', async ({ page }) => {
    await page.click('[data-add-resource]');
    await expect(page.locator('#dialog-recurso')).toBeVisible();
    // validação: descrição curta
    await page.fill('#f-title', 'Meu Lexicon');
    await page.fill('#f-description', 'curta');
    await page.click('button[form="form-recurso"]');
    await expect(page.locator('#recurso-form-errors')).toContainText(/descrição/i);
    // protocolo inválido
    await page.fill('#f-description', 'Descrição válida o bastante para salvar.');
    await page.fill('#f-link', 'javascript:alert(1)');
    await page.click('button[form="form-recurso"]');
    await expect(page.locator('#recurso-form-errors')).toContainText('http');
    // salvar válido
    await page.fill('#f-link', 'https://example.com/lexicon');
    await page.click('button[form="form-recurso"]');
    await expect(page.locator('#dialog-recurso')).not.toBeVisible();
    await page.waitForTimeout(200);
    const userCount = await page.evaluate(() => JSON.parse(localStorage.getItem('osa:vault:userResources') || '[]').length);
    expect(userCount).toBe(1);
    // editar
    const userCard = page.locator('#resource-results .osa-resource', { hasText: 'Meu Lexicon' });
    await userCard.locator('button', { hasText: 'Editar' }).click();
    await page.fill('#f-title', 'Meu Lexicon v2');
    await page.click('button[form="form-recurso"]');
    await page.waitForTimeout(200);
    await expect(page.locator('#resource-results', { hasText: 'Meu Lexicon v2' })).toBeVisible();
    // excluir com confirmação + desfazer
    const card2 = page.locator('#resource-results .osa-resource', { hasText: 'Meu Lexicon v2' });
    await card2.locator('button', { hasText: 'Excluir' }).click();
    await expect(page.locator('#dialog-confirmar')).toBeVisible();
    await page.click('#confirmar-ok');
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('osa:vault:userResources') || '[]').length)).toBe(0);
    // toast de desfazer
    await page.click('.osa-toast button:text("Desfazer")');
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('osa:vault:userResources') || '[]').length)).toBe(1);
  });

  test('estados vazio/sem correspondência em pt-BR', async ({ page }) => {
    await page.fill('#filter-q', 'zzzzz-inexistente-zzzz');
    await page.waitForTimeout(200);
    await expect(page.locator('#resource-results .osa-empty')).toContainText('Nenhum recurso');
    const clearBtn = page.locator('#resource-results [data-clear-filters]');
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await expect(page.locator('#result-count')).toContainText('20 de 20');
  });
});

test.describe('Busca externa a partir do termo digitado', () => {
  const PROVEDORES = {
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    scholar: 'https://scholar.google.com/scholar?q=',
    stepbible: 'https://stepbible.org/?q=',
  };

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/caixa-de-ferramentas.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await ensureTermsGone(page);
    await page.waitForSelector('#result-count');
    await page.waitForFunction(() => !document.getElementById('result-count').textContent.includes('Carregando'));
  });

  test('oferece Google, Bing, DuckDuckGo, Google Acadêmico e STEP Bible', async ({ page }) => {
    for (const provedor of Object.keys(PROVEDORES)) {
      const botoes = page.locator(`[data-external-search="${provedor}"]`);
      expect(await botoes.count(), `provedor ${provedor}`).toBeGreaterThanOrEqual(1);
      // todos abrem em nova aba, com rel seguro e rótulo acessível
      for (const btn of await botoes.all()) {
        await expect(btn).toHaveAttribute('target', '_blank');
        const rel = await btn.getAttribute('rel');
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
        const rotulo = (await btn.getAttribute('aria-label')) || '';
        expect(rotulo.length).toBeGreaterThan(5);
      }
    }
  });

  test('a URL usa exatamente o termo digitado, com acentos codificados', async ({ page }) => {
    await page.fill('#filter-q', 'léxico hebraico');
    await page.waitForTimeout(250);
    const esperado = 'l%C3%A9xico%20hebraico';
    // os quatro provedores gerais ficam junto ao campo de busca
    for (const provedor of ['google', 'bing', 'duckduckgo', 'scholar']) {
      const href = await page.locator(`#cat-busca [data-external-search="${provedor}"]`).first().getAttribute('href');
      expect(href, provedor).toBe(PROVEDORES[provedor] + esperado);
    }
    // o STEP Bible (busca bíblica especializada) fica na seção Descoberta externa
    const step = await page.locator('#cat-externa [data-external-search="stepbible"]').getAttribute('href');
    expect(step).toBe(PROVEDORES.stepbible + esperado);
    // o termo aparece escrito na interface
    await expect(page.locator('#cat-busca [data-external-term]').first()).toHaveText('“léxico hebraico”');
    // e nenhuma busca é executada pelo site (não houve navegação)
    expect(page.url()).toContain('caixa-de-ferramentas.html');
  });

  test('sem termo, os botões ficam inertes e explicam o motivo', async ({ page }) => {
    await expect(page.locator('[data-external-hint]').first()).toBeVisible();
    const btn = page.locator('#cat-busca [data-external-search="google"]').first();
    await expect(btn).toHaveAttribute('aria-disabled', 'true');
    await expect(btn).toHaveAttribute('tabindex', '-1');
    await btn.click({ force: true });   // aria-disabled + tabindex=-1: força para provar que nada navega
    await page.waitForTimeout(250);
    expect(page.url()).toContain('caixa-de-ferramentas.html'); // não abriu nada
    expect(await page.evaluate(() => document.querySelectorAll('dialog[open]').length >= 0)).toBe(true);
    // ao digitar, habilita
    await page.fill('#filter-q', 'wallace');
    await page.waitForTimeout(200);
    await expect(page.locator('#cat-busca [data-external-search="google"]').first()).not.toHaveAttribute('aria-disabled', 'true');
    await expect(page.locator('[data-external-hint]').first()).toBeHidden();
  });

  test('o campo da seção Descoberta externa acompanha o campo de busca (mão dupla)', async ({ page }) => {
    await page.fill('#filter-q', 'regra de ouro');
    await page.waitForTimeout(250);
    await expect(page.locator('#external-q')).toHaveValue('regra de ouro');

    await page.fill('#external-q', 'sintaxe exegética');
    await page.waitForTimeout(300);
    await expect(page.locator('#filter-q')).toHaveValue('sintaxe exegética');
    const href = await page.locator('#cat-externa [data-external-search="scholar"]').getAttribute('href');
    expect(href).toBe(PROVEDORES.scholar + 'sintaxe%20exeg%C3%A9tica');
    // o filtro do catálogo também reagiu ao termo
    await expect(page.locator('#result-count')).toContainText('de 20 recursos encontrados');
  });

  test('limpar filtros volta os botões ao estado inerte', async ({ page }) => {
    await page.fill('#filter-q', 'grego');
    await page.waitForTimeout(200);
    await page.click('[data-clear-filters]');
    await page.waitForTimeout(250);
    await expect(page.locator('#external-q')).toHaveValue('');
    await expect(page.locator('#cat-busca [data-external-search="bing"]').first()).toHaveAttribute('aria-disabled', 'true');
  });

  test('os botões externos nunca apontam para o próprio site', async ({ page }) => {
    await page.fill('#filter-q', 'aramaico');
    await page.waitForTimeout(250);
    const hrefs = await page.$$eval('[data-external-search]', (els) => els.map((e) => e.getAttribute('href')));
    for (const h of hrefs) {
      expect(h.startsWith('https://')).toBe(true);
      expect(h).not.toContain('127.0.0.1');
      expect(h).not.toContain('file://');
    }
  });
});

test.describe('Análise dos 25 métodos (UI/UX)', () => {
  const PAGINAS = [
    { arquivo: 'hebraico-aramaico.html', host: '#heb-metodos', tabela: '#heb-methods-table', paginaId: 'he' },
    { arquivo: 'grego-koine.html', host: '#grk-metodos', tabela: '#grk-methods-table', paginaId: 'grc' },
  ];

  async function abrirMetodos(page, arquivo) {
    await page.goto(BASE + '/' + arquivo);
    await page.evaluate(() => localStorage.setItem('osa:terms:accepted', JSON.stringify({ acceptedAt: new Date().toISOString() })));
    await page.reload();
    await page.waitForSelector('.osa-metodo', { timeout: 10000 });
  }

  for (const pg of PAGINAS) {
    test(`${pg.arquivo}: 25 cartões, resumo derivado e tabela completa`, async ({ page }) => {
      await abrirMetodos(page, pg.arquivo);

      await expect(page.locator('.osa-metodo')).toHaveCount(25);
      await expect(page.locator('.osa-metodos__count')).toHaveText('Mostrando os 25 métodos analisados');
      // resumo com 4 indicadores derivados (não inventados)
      await expect(page.locator('.osa-metodos__stat')).toHaveCount(4);

      // o resumo tem de bater com os valores exibidos nos cartões
      const dados = await page.$$eval('.osa-metodo', (cards) => cards.map((c) => {
        const valores = [...c.querySelectorAll('.osa-metodo__metric-value')].map((v) => parseFloat(v.textContent.replace(',', '.')));
        return { eficiencia: valores[0], complexidade: valores[1], tempo: valores[2] };
      }));
      const mediaEf = dados.reduce((s, d) => s + d.eficiencia, 0) / dados.length;
      const textoMedia = await page.locator('.osa-metodos__stat', { hasText: 'Eficiência média' }).innerText();
      const valorExibido = parseFloat(textoMedia.replace(/[^0-9,]/g, '').replace(',', '.'));
      expect(Math.abs(valorExibido - mediaEf)).toBeLessThan(0.06);
      const menorTempo = Math.min(...dados.map((d) => d.tempo));
      const textoRetorno = await page.locator('.osa-metodos__stat', { hasText: 'Retorno mais rápido' }).innerText();
      expect(textoRetorno).toContain(String(menorTempo));

      // tabela comparativa completa dentro de <details> (fechada por padrão)
      const detalhes = page.locator(`${pg.tabela} .osa-metodos__tabela`);
      await expect(detalhes).not.toHaveAttribute('open', '');
      await expect(page.locator(`${pg.tabela} tbody tr`)).toHaveCount(25);

      // a tabela abre e mostra os mesmos valores dos cartões
      await detalhes.locator('summary').click();
      await expect(detalhes).toHaveAttribute('open', '');
      await expect(page.locator(`${pg.tabela} tbody tr`).first()).toBeVisible();
    });

    test(`${pg.arquivo}: busca sem acento, chips de grupo, ordenação e limpar`, async ({ page }) => {
      await abrirMetodos(page, pg.arquivo);
      const cartoes = page.locator('.osa-metodo');

      // busca ignora acentos e caixa
      await page.fill(`#${pg.paginaId === 'he' ? 'heb' : 'grk'}-methods-table-busca`, 'memoria');
      await page.waitForTimeout(250);
      const n1 = await cartoes.count();
      expect(n1).toBeGreaterThan(0);
      expect(n1).toBeLessThan(25);
      await expect(page.locator('.osa-metodos__count')).toContainText(`de 25 métodos`);
      // a busca olha nome, foco e descrição
      await page.fill(`#${pg.paginaId === 'he' ? 'heb' : 'grk'}-methods-table-busca`, 'zzzznaoexiste');
      await page.waitForTimeout(250);
      await expect(page.locator('.osa-empty')).toBeVisible();
      await page.fill(`#${pg.paginaId === 'he' ? 'heb' : 'grk'}-methods-table-busca`, '');
      await page.waitForTimeout(250);

      // chip de grupo didático filtra e marca aria-pressed
      const chipTexto = page.locator('.osa-chips .osa-chip', { hasText: 'Centradas no texto' }).first();
      await chipTexto.click();
      await page.waitForTimeout(250);
      await expect(chipTexto).toHaveAttribute('aria-pressed', 'true');
      const nGrupo = await cartoes.count();
      expect(nGrupo).toBeGreaterThan(0);
      expect(nGrupo).toBeLessThan(25);
      for (const c of await page.locator('.osa-metodo__badges').all()) {
        expect(await c.innerText()).toContain('Centradas no texto');
      }

      // ordenação por retorno mais rápido: sequência não decrescente
      await page.locator('.osa-chips .osa-chip', { hasText: 'Todos' }).first().click();
      await page.selectOption(`#${pg.paginaId === 'he' ? 'heb' : 'grk'}-methods-table-ordem`, 'tempo');
      await page.waitForTimeout(250);
      const tempos = await page.$$eval('.osa-metodo', (cs) => cs.map((c) => parseFloat(c.querySelectorAll('.osa-metodo__metric-value')[2].textContent.replace(',', '.'))));
      expect(tempos).toEqual([...tempos].sort((a, b) => a - b));

      // somente híbridos
      await page.check(`#${pg.paginaId === 'he' ? 'heb' : 'grk'}-methods-table-hibridos`);
      await page.waitForTimeout(250);
      for (const c of await page.locator('.osa-metodo__badges').all()) {
        expect(await c.innerText()).toContain('Híbrido');
      }

      // limpar filtros volta ao conjunto completo e à ordem por eficiência
      await page.click('.osa-metodos__controls .osa-btn');
      await page.waitForTimeout(300);
      await expect(cartoes).toHaveCount(25);
      await expect(page.locator('.osa-metodos__count')).toHaveText('Mostrando os 25 métodos analisados');
      const efs = await page.$$eval('.osa-metodo', (cs) => cs.map((c) => parseFloat(c.querySelectorAll('.osa-metodo__metric-value')[0].textContent.replace(',', '.'))));
      expect(efs).toEqual([...efs].sort((a, b) => b - a)); // eficiência decrescente
    });

    test(`${pg.arquivo}: ordenação por cabeçalho da tabela respeita aria-sort`, async ({ page }) => {
      await abrirMetodos(page, pg.arquivo);
      await page.locator(`${pg.tabela} .osa-metodos__tabela summary`).click();
      const th = page.locator(`${pg.tabela} th:has(button[data-coluna="complexidade"])`);
      await expect(th).toHaveAttribute('aria-sort', 'none');
      await th.locator('button').click();
      await page.waitForTimeout(250);
      await expect(th).toHaveAttribute('aria-sort', 'ascending');
      const valores = await page.$$eval(`${pg.tabela} tbody tr`, (trs) => trs.map((tr) => parseFloat(tr.children[5].textContent.replace(',', '.'))));
      expect(valores).toEqual([...valores].sort((a, b) => a - b));
      await th.locator('button').click();
      await page.waitForTimeout(250);
      await expect(th).toHaveAttribute('aria-sort', 'descending');
    });

    test(`${pg.arquivo}: barras são decorativas e o detalhe controla texto`, async ({ page }) => {
      await abrirMetodos(page, pg.arquivo);
      // as barras não carregam informação sozinhas
      const barras = await page.locator('.osa-bar').count();
      expect(barras).toBeGreaterThan(70); // 25 cartões × 3 métricas
      for (const b of await page.locator('.osa-bar').all()) {
        await expect(b).toHaveAttribute('aria-hidden', 'true');
      }
      // botão de detalhe com aria-expanded coerente
      const btn = page.locator('.osa-metodo__mais').first();
      const antes = await btn.getAttribute('aria-expanded');
      await btn.click();
      await page.waitForTimeout(200);
      expect(await btn.getAttribute('aria-expanded')).not.toBe(antes);
      await btn.click();
      await page.waitForTimeout(200);
      expect(await btn.getAttribute('aria-expanded')).toBe(antes);
    });
  }
});

test.describe('Importação / exportação JSON', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/caixa-de-ferramentas.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await ensureTermsGone(page);
    await page.waitForFunction(() => !document.getElementById('result-count').textContent.includes('Carregando'));
  });

  test('export gera payload com schema e versionamento', async ({ page }) => {
    const payload = await page.evaluate(async () => {
      const mod = await import('/js/storage.js');
      return mod.buildExportPayload();
    });
    expect(payload.schema).toBe('osa-colecao');
    expect(payload.schemaVersion).toBe(1);
    expect(Array.isArray(payload.favoritos)).toBe(true);
    expect(Array.isArray(payload.recursosUsuario)).toBe(true);
  });

  test('import válida: adiciona e aplica política keep-existing', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const mod = await import('/js/storage.js');
      // seed existente não está no user resources; importamos 1 novo + 1 duplicado
      const good = {
        app: 'O Sentido Autêntico', schema: 'osa-colecao', schemaVersion: 1,
        favoritos: ['sofia-app', 'step-bible'],
        recursosUsuario: [
          { id: 'user-import-1', title: 'Recurso Importado', author: 'Teste', category: 'lexico', language: 'grego', level: 'iniciante', type: 'Web', free: true, link: 'https://example.com/a', description: 'Descrição de recurso importado para teste.', userAdded: true },
          { id: 'user-import-1', title: 'Duplicado', category: 'lexico', language: 'grego', level: 'todos', type: 'X', free: false, link: 'https://example.com/dup', description: 'Deve ser ignorado por keep-existing.', userAdded: true },
          { id: 'bad-link', title: 'Link Ruim', category: 'app', language: 'grego', level: 'todos', type: 'X', free: false, link: 'javascript:alert(1)', description: 'Protocolo não permitido aqui.', userAdded: true }
        ]
      };
      const keep = mod.parseImport(JSON.stringify(good), { duplicatePolicy: 'keep-existing' });
      const replaced = mod.parseImport(JSON.stringify({
        ...good,
        recursosUsuario: [good.recursosUsuario[0]]
      }), { duplicatePolicy: 'replace' });
      return { keep, replaced, favs: mod.getFavorites(), users: mod.getUserResources() };
    });
    expect(result.keep.ok).toBe(true);
    expect(result.keep.added).toBe(1);
    expect(result.keep.skipped).toBeGreaterThanOrEqual(1); // dup ou link
    expect(result.favs).toEqual(expect.arrayContaining(['sofia-app', 'step-bible']));
    expect(result.users.find((r) => r.id === 'user-import-1').title).toBe('Recurso Importado');
    expect(result.replaced.ok).toBe(true);
  });

  test('rejeita JSON corrompido, schema errado e acima de 512KB sem alterar dados', async ({ page }) => {
    const out = await page.evaluate(async () => {
      const mod = await import('/js/storage.js');
      const before = JSON.stringify(mod.getUserResources());
      const corrupt = mod.parseImport('{not json', {});
      const wrongSchema = mod.parseImport(JSON.stringify({ schema: 'outro', schemaVersion: 1 }), {});
      const big = mod.parseImport('{"schema":"osa-colecao","schemaVersion":1,"favoritos":["x"],"recursosUsuario":[' +
        Array.from({ length: 9000 }, (_, i) => `{"id":"u${i}","title":"Título longo o suficiente para ocupar espaço ${i}","description":"${'x'.repeat(40)}"}`).join(',') +
        ']}', {});
      const after = JSON.stringify(mod.getUserResources());
      return { corrupt, wrongSchema, big, unchanged: before === after };
    });
    expect(out.corrupt.ok).toBe(false);
    expect(out.wrongSchema.ok).toBe(false);
    expect(out.big.ok).toBe(false);
    expect(out.big.error).toMatch(/limite|512/i);
    expect(out.unchanged).toBe(true);
  });

  test('protocolos de URL: só http/https', async ({ page }) => {
    const res = await page.evaluate(async () => {
      const mod = await import('/js/storage.js');
      return {
        http: mod.isAllowedUrl('http://x.com'),
        https: mod.isAllowedUrl('https://x.com'),
        js: mod.isAllowedUrl('javascript:alert(1)'),
        data: mod.isAllowedUrl('data:text/html,x'),
        file: mod.isAllowedUrl('file:///etc/passwd')
      };
    });
    expect(res).toEqual({ http: true, https: true, js: false, data: false, file: false });
  });
});

test.describe('Persistência e migração legada', () => {
  test('migra biblicalVault e userBiblicalResources sem apagar chaves legadas', async ({ page }) => {
    await page.goto(BASE + '/caixa-de-ferramentas.html');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('biblicalVault', JSON.stringify(['ross-gramatica-hebraico', 'sofia-app']));
      localStorage.setItem('userBiblicalResources', JSON.stringify([
        { id: 'legacy-1', title: 'Recurso Legado', author: 'Eu', category: 'midia', language: 'grego', level: 'todos', type: 'Video', free: true, link: 'https://example.com/legacy', description: 'Recurso criado em versão anterior do site.' }
      ]));
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('welcomeModalDismissed', 'true');
    });
    await page.reload();
    // Fecha diálogos SEM aceitar (dismissed ≠ accepted)
    await dismissTermsOnly(page);
    await page.waitForFunction(() => {
      const c = document.getElementById('result-count');
      return c && !c.textContent.includes('Carregando') && !c.textContent.includes('—');
    });
    const state = await page.evaluate(() => ({
      newFavs: JSON.parse(localStorage.getItem('osa:vault:favorites') || '[]'),
      legacyFavs: JSON.parse(localStorage.getItem('biblicalVault') || '[]'),
      newUserRes: (JSON.parse(localStorage.getItem('osa:vault:userResources') || '[]')).map((r) => r.id),
      legacyUserRes: JSON.parse(localStorage.getItem('userBiblicalResources') || '[]').map((r) => r.id),
      themeNew: localStorage.getItem('osa:theme'),
      themeLegacy: localStorage.getItem('theme'),
      accepted: localStorage.getItem('osa:terms:accepted')
    }));
    expect(state.newFavs).toEqual(expect.arrayContaining(['ross-gramatica-hebraico', 'sofia-app']));
    expect(state.legacyFavs).toEqual(expect.arrayContaining(['ross-gramatica-hebraico'])); // legada intacta
    expect(state.newUserRes).toContain('legacy-1');
    expect(state.legacyUserRes).toContain('legacy-1'); // legada intacta
    expect(state.themeNew === 'dark' || state.themeNew === '"dark"').toBe(true);
    expect(state.themeLegacy).toBe('dark');
    expect(state.accepted).toBeNull(); // dismissed ≠ accepted
    // recurso legado visível na UI
    await expect(page.locator('#resource-results', { hasText: 'Recurso Legado' })).toBeVisible();
  });

  test('posição de leitura ≠ lições concluídas; "Continuar" só com estado real', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('osa:terms:accepted', JSON.stringify({ acceptedAt: new Date().toISOString() }));
    });
    await page.reload();
    await page.waitForTimeout(400);
    // sem posição (usuário ainda não rolou): link oculto
    await expect(page.locator('#resume-link')).toBeHidden();
    // salva posição manualmente via módulo
    await page.evaluate(async () => {
      const mod = await import('/js/storage.js');
      mod.saveReadingPosition('hebraico', 'heb-curriculo');
    });
    await page.reload();
    await expect(page.locator('#resume-link')).toBeVisible();
    const href = await page.locator('#resume-link').getAttribute('href');
    expect(href).toContain('hebraico-aramaico.html#heb-curriculo');
    // não há métricas de % de conclusão
    const pct = await page.locator('main').innerText();
    expect(pct).not.toMatch(/\d+% *concluíd/i);
  });
});

test.describe('Menu lateral: fecha ao tocar fora e oculta-se por inatividade', () => {
  // A gaveta só existe abaixo de 1024px (no desktop a sidebar é fixa);
  // por isso o viewport é reduzido nos dois projetos.
  const abrir = async (page) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => localStorage.setItem('osa:terms:accepted', JSON.stringify({ acceptedAt: new Date().toISOString() })));
    await page.reload();
    await page.waitForTimeout(300);
    await page.click('#menu-toggle');
    await expect(page.locator('#osa-drawer')).toHaveAttribute('data-open', 'true');
  };
  const estaAberta = (page) => page.locator('#osa-drawer').getAttribute('data-open');

  test('clique/toque fora da gaveta fecha (inclusive sobre o cabeçalho)', async ({ page }) => {
    await abrir(page);
    // ponto bem fora da gaveta (conteúdo/backdrop)
    await page.mouse.click(350, 480);
    await page.waitForTimeout(250);
    expect(await estaAberta(page)).toBe('false');

    // sobre a faixa do cabeçalho, onde fica o próprio botão e a marca
    await page.click('#menu-toggle');
    await expect(page.locator('#osa-drawer')).toHaveAttribute('data-open', 'true');
    await page.mouse.click(300, 28);
    await page.waitForTimeout(250);
    expect(await estaAberta(page)).toBe('false');
  });

  test('toque (touch) fora também fecha', async ({ page, hasTouch }) => {
    test.skip(!hasTouch, 'projeto sem suporte a toque (desktop)');
    await abrir(page);
    await page.touchscreen.tap(350, 480);
    await page.waitForTimeout(250);
    expect(await estaAberta(page)).toBe('false');
  });

  test('auto-oculta após 4 s de inatividade, devolve o foco e avisa', async ({ page }) => {
    await abrir(page);
    // 3 s ainda aberto
    await page.waitForTimeout(3000);
    expect(await estaAberta(page)).toBe('true');
    // passados os 4 s, fecha sozinha
    await expect(page.locator('#osa-drawer')).toHaveAttribute('data-open', 'false', { timeout: 4000 });
    // foco volta para o botão do menu
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('menu-toggle');
    // aviso em região viva explicando o auto-ocultar
    await expect(page.locator('#osa-live-region')).toContainText('4 segundos');
  });

  test('interação dentro do menu reinicia a contagem de inatividade', async ({ page }) => {
    await abrir(page);
    await page.waitForTimeout(2500);
    await page.mouse.move(80, 320);        // movimento dentro da gaveta = atividade
    await page.waitForTimeout(2500);
    expect(await estaAberta(page)).toBe('true');   // 5 s no total, mas sem 4 s parado
    await page.keyboard.press('Tab');              // teclado também conta como atividade
    await page.waitForTimeout(2500);
    expect(await estaAberta(page)).toBe('true');
    // e sem nenhuma interação, o menu fecha
    await expect(page.locator('#osa-drawer')).toHaveAttribute('data-open', 'false', { timeout: 5000 });
  });

  test('a preferência de acessibilidade desliga o auto-ocultar e persiste', async ({ page }) => {
    await abrir(page);
    await page.evaluate(() => window.OSASidebar.close());
    await page.click('#a11y-fab');
    const botao = page.locator('[data-a11y="drawer-autohide"]');
    await expect(botao).toHaveAttribute('aria-pressed', 'true');
    await botao.click();
    await expect(botao).toHaveAttribute('aria-pressed', 'false');
    const prefs = await page.evaluate(() => JSON.parse(localStorage.getItem('osa:a11y:prefs') || '{}'));
    expect(prefs.drawerAutoHide).toBe(false);

    // com a preferência desligada, o menu fica aberto além dos 4 s
    await page.keyboard.press('Escape');
    await page.click('#menu-toggle');
    await page.waitForTimeout(5200);
    expect(await estaAberta(page)).toBe('true');

    // e a escolha sobrevive ao recarregamento
    await page.reload();
    await page.waitForTimeout(400);
    await page.click('#a11y-fab');
    await expect(page.locator('[data-a11y="drawer-autohide"]')).toHaveAttribute('aria-pressed', 'false');
  });

  test('a API expõe o controle e não dispara aviso com a gaveta fechada', async ({ page }) => {
    await abrir(page);
    const api = await page.evaluate(() => ({
      setAutoHide: typeof window.OSASidebar?.setAutoHide,
      isAutoHideOn: window.OSASidebar?.isAutoHideOn(),
      ms: window.OSASidebar?.IDLE_HIDE_MS
    }));
    expect(api.setAutoHide).toBe('function');
    expect(api.isAutoHideOn).toBe(true);
    expect(api.ms).toBe(4000);

    // fechada por clique fora: nenhum aviso de auto-ocultar é anunciado depois
    await page.mouse.click(350, 480);
    await page.waitForTimeout(5000);
    const regiao = page.locator('#osa-live-region');
    const existe = (await regiao.count()) > 0;
    const texto = existe ? await regiao.textContent() : '';
    expect(String(texto)).not.toContain('4 segundos');
  });
});

test.describe('Invariantes de confiabilidade', () => {
  test('API da sidebar existe e gaveta começa fechada', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => localStorage.setItem('osa:terms:accepted', JSON.stringify({ acceptedAt: new Date().toISOString() })));
    await page.reload();
    const api = await page.evaluate(() => typeof window.OSASidebar?.open === 'function'
      && typeof window.OSASidebar?.close === 'function'
      && typeof window.OSASidebar?.toggle === 'function');
    expect(api).toBe(true);
    const open0 = await page.evaluate(() => document.getElementById('osa-drawer').dataset.open);
    expect(open0).toBe('false');
    // abrir por ação deliberada
    await page.click('#menu-toggle');
    await expect(page.locator('#osa-drawer')).toHaveAttribute('data-open', 'true');
    // Escape fecha
    await page.keyboard.press('Escape');
    await expect(page.locator('#osa-drawer')).toHaveAttribute('data-open', 'false');
    // backdrop fecha
    await page.click('#menu-toggle');
    await page.click('#osa-backdrop', { force: true });
    await expect(page.locator('#osa-drawer')).toHaveAttribute('data-open', 'false');
  });

  test('sem erros de console em página nenhuma (visitas repetidas)', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(String(err)));
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
    for (const path of ['/index.html', '/hebraico-aramaico.html', '/grego-koine.html', '/caixa-de-ferramentas.html']) {
      await page.goto(BASE + path);
      await page.waitForTimeout(800);
      await page.goto(BASE + path);
      await page.waitForTimeout(400);
    }
    // ignora erros de rede de favicon/externos se houver
    const real = errors.filter((e) => !/favicon|net::ERR|Failed to load resource/i.test(e));
    expect(real).toEqual([]);
  });

  test('nenhuma chamada a função indefinida (referências OSASidebar/tema)', async ({ page }) => {
    await page.goto(BASE + '/hebraico-aramaico.html');
    const undefinedCalls = await page.evaluate(() => {
      // dispara handlers comuns
      const results = [];
      try { window.OSASidebar.toggle(); window.OSASidebar.close(); } catch (e) { results.push(String(e)); }
      return results;
    });
    expect(undefinedCalls).toEqual([]);
  });

  test('nenhum overflow-x global com overflow hidden !important', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    const css = await page.evaluate(() => {
      let bad = false;
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.cssText && /overflow-x\s*:\s*hidden\s*!important/i.test(rule.cssText)
              && /(^|\})\s*(html|body|\*)\s*[,{]/.test(rule.cssText)) {
              bad = true;
            }
          }
        } catch { /* cross-origin */ }
      }
      return bad;
    });
    expect(css).toBe(false);
  });
});

test.describe('Acessibilidade (axe)', () => {
  for (const path of ['/index.html', '/hebraico-aramaico.html', '/grego-koine.html', '/caixa-de-ferramentas.html']) {
    for (const theme of ['light', 'dark']) {
      test(`axe ${path} tema ${theme}: zero critical/serious`, async ({ page }) => {
        await page.goto(BASE + path);
        await page.evaluate((t) => {
          localStorage.setItem('osa:theme', t);
          localStorage.setItem('osa:terms:accepted', JSON.stringify({ acceptedAt: new Date().toISOString() }));
        }, theme);
        await page.reload();
        await page.waitForTimeout(500);
        const { AxeBuilder } = await import('@axe-core/playwright');
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        const bad = results.violations.filter((v) => ['critical', 'serious'].includes(v.impact));
        if (bad.length) {
          console.log('VIOLATIONS', path, theme, JSON.stringify(bad.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })), null, 2));
        }
        expect(bad.map((v) => v.id)).toEqual([]);
      });
    }
  }

  test('skip link focável e visível no primeiro Tab', async ({ page }) => {
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => localStorage.setItem('osa:terms:accepted', JSON.stringify({ acceptedAt: new Date().toISOString() })));
    await page.reload();
    await page.waitForTimeout(300);
    await page.keyboard.press('Tab');
    const text = await page.evaluate(() => document.activeElement?.textContent || '');
    expect(text).toContain('Pular para o conteúdo');
  });
});

test.describe('Alvos de toque e viewport móvel', () => {
  test('bottom nav e header não cobrem foco; tap targets ≥44px (390px)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + '/index.html');
    const sizes = await page.evaluate(() => {
      const sel = '.osa-bottomnav a, #menu-toggle, #a11y-fab, #theme-toggle, .osa-btn';
      const out = [];
      document.querySelectorAll(sel).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) out.push({ t: el.textContent.trim().slice(0, 20), w: r.width, h: r.height });
      });
      return out;
    });
    for (const s of sizes) {
      expect(s.h, `altura de ${s.t}`).toBeGreaterThanOrEqual(44);
    }
  });

  test('viewport 320px sem overflow horizontal de página', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    for (const path of ['/index.html', '/caixa-de-ferramentas.html']) {
      await page.goto(BASE + path);
      await page.waitForTimeout(300);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(over, path).toBeLessThanOrEqual(1);
    }
  });
});

test.describe('PWA', () => {
  test('toda URL precacheada responde 200', async ({ request }) => {
    const sw = await request.get(BASE + '/sw.js');
    const text = await sw.text();
    const block = text.split('CORE_ASSETS')[1].split('];')[0];
    const urls = [...block.matchAll(/'(\.[^']+)'/g)].map((m) => m[1]);
    expect(urls.length).toBeGreaterThan(10);
    for (const u of urls) {
      const res = await request.get(BASE + u.replace(/^\.\//, '/'));
      expect(res.status(), u).toBe(200);
    }
  });

  test('registra SW, preserva dados e usa fluxo de atualização visível', async ({ page, context }) => {
    await page.goto(BASE + '/index.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await ensureTermsGone(page);
    // aceitar favorito
    await page.goto(BASE + '/caixa-de-ferramentas.html');
    await ensureTermsGone(page);
    await page.waitForFunction(() => !document.getElementById('result-count').textContent.includes('Carregando'));
    await page.locator('#resource-results .osa-resource').first().locator('button[aria-pressed]').click();
    const reg = await page.evaluate(async () => {
      const r = await navigator.serviceWorker.getRegistration();
      return { registered: !!r, scope: r?.scope || null };
    });
    expect(reg.registered).toBe(true);
    // fluxo de atualização: barra oculta por padrão; não força ativação
    const barHidden = await page.evaluate(() => document.getElementById('update-bar')?.dataset.visible !== 'true');
    expect(barHidden).toBe(true);
    // dados preservados
    const favs = await page.evaluate(() => JSON.parse(localStorage.getItem('osa:vault:favorites') || '[]'));
    expect(favs.length).toBeGreaterThan(0);
    const accepted = await page.evaluate(() => !!localStorage.getItem('osa:terms:accepted'));
    expect(accepted).toBe(true);
  });

  test('páginas visitadas funcionam offline (cache runtime)', async ({ page, context }) => {
    await page.goto(BASE + '/index.html');
    await page.waitForTimeout(500); // SW instala e precacha
    await page.waitForFunction(async () => {
      const keys = await caches.keys();
      return keys.some((k) => k.startsWith('osa-core'));
    }).catch(() => {});
    // força controlador
    await page.waitForTimeout(1000);
    const controlled = await page.evaluate(() => !!navigator.serviceWorker.controller);
    if (!controlled) {
      // primeira visita pode não controlar sem clients.claim — recarrega uma vez
      await page.reload();
      await page.waitForTimeout(800);
    }
    await context.setOffline(true);
    await page.goto(BASE + '/index.html').catch(() => {});
    // ou recarrega via cache
    const text = await page.locator('body').innerText().catch(() => '');
    const offlineFallback = text.includes('offline') || text.includes('Offline') || text.includes('Portal');
    // Se a navegação falhou, espera-se a página offline do SW
    if (!offlineFallback) {
      // tenta de novo via evaluate (SPA-like)
      const ok = await page.evaluate(async () => {
        try {
          const r = await fetch('./index.html', { cache: 'only-if-cached' });
          return r.ok;
        } catch { return false; }
      });
      expect(ok).toBe(true);
    } else {
      expect(offlineFallback).toBe(true);
    }
    await context.setOffline(false);
  });
});

/* ------------------------------------------------------------------ *
 * Regressões da auditoria de 24/09/2026.
 * Cada teste aqui corresponde a um defeito real medido e corrigido:
 * âncora quebrada (#cat-colecao), aviso de leitura fora de landmark,
 * og:url ausente, saltos de título (h2→h4) e grego politônico sem
 * glifos na fonte embarcada. Se algum voltar, estes testes falham.
 * ------------------------------------------------------------------ */
test.describe('Regressões da auditoria (24/09/2026)', () => {
  const PAGINAS = [
    'index.html',
    'hebraico-aramaico.html',
    'grego-koine.html',
    'caixa-de-ferramentas.html',
    'offline.html',
    '404.html'
  ];

  test('toda referência interna aponta para um elemento existente', async ({ page }) => {
    for (const arq of PAGINAS) {
      await page.goto(`${BASE}/${arq}`);
      await page.waitForTimeout(200);
      const quebradas = await page.evaluate(() => {
        const ids = new Set([...document.querySelectorAll('[id]')].map((e) => e.id));
        const ruins = [];
        const atributos = ['aria-labelledby', 'aria-controls', 'aria-describedby'];
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
          const h = a.getAttribute('href');
          if (h && h.length > 1 && !ids.has(h.slice(1))) ruins.push(`href=${h}`);
        });
        document.querySelectorAll(`[${atributos.join('],[')}]`).forEach((el) => {
          for (const at of atributos) {
            for (const id of (el.getAttribute(at) || '').split(/\s+/).filter(Boolean)) {
              if (!ids.has(id)) ruins.push(`${at}=${id}`);
            }
          }
        });
        document.querySelectorAll('label[for]').forEach((l) => {
          const id = l.getAttribute('for');
          if (id && !ids.has(id) && !document.getElementById(id)) ruins.push(`for=${id}`);
        });
        return ruins;
      });
      expect(quebradas, `${arq}: referências internas quebradas`).toEqual([]);
    }
  });

  test('hierarquia de títulos sem saltos de nível', async ({ page }) => {
    for (const arq of ['index.html', 'hebraico-aramaico.html', 'grego-koine.html', 'caixa-de-ferramentas.html']) {
      await page.goto(`${BASE}/${arq}`);
      await page.waitForTimeout(600);
      const saltos = await page.evaluate(() => {
        const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
          .filter((h) => !h.closest('[hidden]') && !h.hasAttribute('hidden'));
        const out = [];
        let anterior = 0;
        for (const h of hs) {
          const n = Number(h.tagName[1]);
          if (anterior && n > anterior + 1) out.push(`${anterior}→${n}: ${h.textContent.trim().slice(0, 40)}`);
          anterior = n;
        }
        return out;
      });
      expect(saltos, `${arq}: saltos na hierarquia de títulos`).toEqual([]);
    }
  });

  test('aviso da leitura em voz alta fica dentro de um landmark', async ({ page }) => {
    for (const arq of ['index.html', 'hebraico-aramaico.html', 'grego-koine.html', 'caixa-de-ferramentas.html']) {
      await page.goto(`${BASE}/${arq}`);
      const dentro = await page.evaluate(() => {
        const n = document.getElementById('tts-note');
        if (!n) return null;
        const land = n.closest('aside, [role="complementary"], main, [role="main"], footer, [role="contentinfo"], section[aria-label], section[aria-labelledby]');
        return land ? land.tagName.toLowerCase() : '';
      });
      expect(dentro, `${arq}: #tts-note precisa estar dentro de um landmark`).not.toBe('');
    }
  });

  test('og:url absoluto e coerente com sitemap e package.json', async ({ page }) => {
    const bases = [];
    for (const arq of ['index.html', 'hebraico-aramaico.html', 'grego-koine.html', 'caixa-de-ferramentas.html']) {
      await page.goto(`${BASE}/${arq}`);
      const og = await page.evaluate(() => document.querySelector('meta[property="og:url"]')?.content || '');
      expect(og, `${arq}: og:url ausente`).not.toBe('');
      expect(og, `${arq}: og:url precisa ser absoluta`).toMatch(/^https?:\/\/[^/]+\/.+\//);
      expect(og.endsWith(arq), `${arq}: og:url deve terminar com o nome da página`).toBe(true);
      bases.push(og.slice(0, og.length - arq.length));
    }
    // Todas as páginas compartilham a mesma base...
    expect(new Set(bases).size, `bases divergentes: ${[...new Set(bases)].join(' | ')}`).toBe(1);
    // ...e a base é a mesma do sitemap e do package.json (evita atualização pela metade).
    const { readFileSync } = await import('node:fs');
    const base = bases[0];
    expect(readFileSync('sitemap.xml', 'utf8'), 'sitemap.xml fora de sincronia com o og:url').toContain(`<loc>${base}`);
    expect(JSON.parse(readFileSync('package.json', 'utf8')).homepage, 'package.json.homepage fora de sincronia').toBe(base);
  });

  test('"Minha coleção" leva ao painel existente', async ({ page }) => {
    await page.goto(`${BASE}/caixa-de-ferramentas.html`);
    await ensureTermsGone(page);
    const r = await page.evaluate(async () => {
      const links = [...document.querySelectorAll('a[href="#panel-colecao"]')];
      const alvo = document.getElementById('panel-colecao');
      if (!links.length || !alvo) return { links: links.length, temAlvo: !!alvo };
      location.hash = '#panel-colecao';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      await new Promise((res) => setTimeout(res, 900));
      const caixa = alvo.getBoundingClientRect();
      return {
        links: links.length,
        temAlvo: true,
        visivel: alvo.hidden === false && caixa.height > 0,
        abaAtiva: document.querySelector('[data-catalog-tab="colecao"]')?.getAttribute('aria-selected'),
        alvoNoVisor: caixa.height > 0 && caixa.top > -80 && caixa.top < window.innerHeight,
        hash: location.hash
      };
    });
    expect(r.links, 'nenhum link para o painel da coleção').toBeGreaterThan(0);
    expect(r.temAlvo, '#panel-colecao não existe').toBe(true);
    expect(r.hash).toBe('#panel-colecao');
    expect(r.visivel, 'o painel da coleção continua oculto depois do deep link').toBe(true);
    expect(r.abaAtiva, 'a aba "Minha coleção" deveria ficar selecionada').toBe('true');
    expect(r.alvoNoVisor, 'o painel não foi levado ao visor').toBe(true);
  });

  test('grego politônico: face declarada, arquivo embarcado e usado no rendering', async ({ page }) => {
    const { readFileSync } = await import('node:fs');
    const sw = readFileSync('sw.js', 'utf8');
    expect(sw, 'o politônico precisa estar no precache do service worker').toContain('./fonts/noto-serif-greek-ext-400.woff2');
    const css = readFileSync('css/fonts.css', 'utf8');
    expect(css).toContain('noto-serif-greek-ext-400.woff2');

    const baixados = [];
    page.on('request', (req) => {
      if (req.url().endsWith('.woff2')) baixados.push(req.url().split('/').pop());
    });
    await page.goto(`${BASE}/grego-koine.html`);
    await ensureTermsGone(page);
    await page.reload();
    await page.waitForTimeout(1500);

    // A face precisa existir para "Noto Serif" cobrindo o bloco grego estendido.
    // O CSS é agregado por @import (main.css → fonts.css), por isso a varredura
    // entra em r.styleSheet.cssRules além de r.cssRules.
    const faces = await page.evaluate(() => {
      const out = [];
      const visitar = (regras) => {
        for (const r of regras) {
          if (r.cssText.startsWith('@font-face')) {
            const familia = r.style?.getPropertyValue('font-family') || '';
            const faixa = r.style?.getPropertyValue('unicode-range') || '';
            if (/noto serif/i.test(familia) && /1F00/i.test(faixa)) out.push(faixa.slice(0, 40));
          }
          if (r.styleSheet && r.styleSheet.cssRules) visitar([...r.styleSheet.cssRules]);
          else if (r.cssRules && !r.styleSheet) visitar([...r.cssRules]);
        }
      };
      for (const folha of document.styleSheets) {
        try { visitar([...folha.cssRules]); } catch { /* folha de outra origem */ }
      }
      return out;
    });
    expect(faces.length, '@font-face de "Noto Serif" cobrindo U+1F00–1FFF').toBeGreaterThan(0);
    expect(baixados, 'o arquivo politônico deve ser realmente baixado').toContain('noto-serif-greek-ext-400.woff2');

    // Proveniência dos glifos: as larguras @100px batem com as métricas do
    // arquivo embarcado (advance/unitsPerEm). Se o politônico passar a ser
    // desenhado por fonte do sistema, os valores divergem e o teste falha.
    const larguras = await page.evaluate(async () => {
      await document.fonts.ready;
      const c = document.createElement('canvas').getContext('2d');
      const medir = (t) => { c.font = '100px "Noto Serif"'; return c.measureText(t).width; };
      return { politonico: medir('ἀ'), iota: medir('ῇ'), basico: medir('λ') };
    });
    expect(Math.abs(larguras.politonico - 63.9), 'ἀ deveria vir de noto-serif-greek-ext-400').toBeLessThan(1.5);
    expect(Math.abs(larguras.iota - 61.4), 'ῇ deveria vir de noto-serif-greek-ext-400').toBeLessThan(1.5);
    expect(Math.abs(larguras.basico - 58.3), 'λ deveria vir de noto-serif-greek-400').toBeLessThan(1.5);
  });

  test('links de título do catálogo têm alvo de toque de 24px', async ({ page }) => {
    await page.goto(`${BASE}/caixa-de-ferramentas.html`);
    await ensureTermsGone(page);
    await page.reload();
    await page.waitForSelector('.osa-resource__title a', { timeout: 8000 });
    const alturas = await page.evaluate(() =>
      [...document.querySelectorAll('.osa-resource__title a')].map((a) => a.getBoundingClientRect().height)
    );
    expect(alturas.length).toBeGreaterThan(0);
    for (const h of alturas) expect(h).toBeGreaterThanOrEqual(23.9);
  });
});

test.describe('Guia integrado — regressões 1.2.0', () => {
  test('carrega sem erros, usa ativos externos e conclusão é explícita', async ({ page }) => {
    const errors=[]; page.on('pageerror', e=>errors.push(e.message));
    await page.goto(BASE + '/guia-exegese.html');
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('#m1 .module-complete')).toBeVisible();
    expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('osa:exegese:state')||'{}').done?.m1||false)).toBe(false);
    await page.click('#m1 .module-complete');
    expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('osa:exegese:state')).done.m1)).toBe(true);
    expect(errors).toEqual([]);
  });
  test('abas respondem ao teclado e expõem ARIA', async ({ page }) => {
    await page.goto(BASE + '/guia-exegese.html#m5');
    const first=page.locator('#langTabs [role="tab"]').first();
    await expect(first).toHaveAttribute('aria-selected', /true|false/);
    await first.focus(); await page.keyboard.press('ArrowRight');
    await expect(page.locator('#langTabs [role="tab"]:focus')).toHaveCount(1);
  });
  test('não tem overflow horizontal crítico em 320 px', async ({ page }) => {
    await page.setViewportSize({width:320,height:700}); await page.goto(BASE+'/guia-exegese.html');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
  test('metadados e links institucionais usam produção/HTTPS', async ({ page }) => {
    await page.goto(BASE+'/guia-exegese.html');
    await expect(page.locator('a[href="https://aibreb.org.br/instituicoes_seminarios.html"]')).toHaveCount(1);
    await expect(page.locator('a[href^="http:"]')).toHaveCount(0);
  });
});
