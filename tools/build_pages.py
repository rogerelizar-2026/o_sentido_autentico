#!/usr/bin/env python3
"""Monta as páginas estáticas a partir do chrome compartilhado + conteúdo.

Uso: python3 tools/build_pages.py
As páginas geradas são o artefato versionado (site estático sem build em runtime).
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

def chrome(page_id, lang_nav_file, title, description, main_html, *,
           og_url=None, body_lang='he' if False else None, extra_head='', scripts=''):
    nav_file = lang_nav_file
    drawer_extra = {
        'hebraico-aramaico.html': [
            ('#heb-visao', 'Visão geral'),
            ('#heb-metodos', '25 métodos'),
            ('#heb-ranking', 'Ranking'),
            ('#heb-graficos', 'Gráficos'),
            ('#heb-recursos', 'Recursos'),
            ('#heb-curriculo', 'Currículo 5 níveis'),
            ('#heb-anki', 'Anki'),
            ('#heb-ia', 'Prompts de IA'),
            ('#heb-checklist', 'Checklist'),
        ],
        'grego-koine.html': [
            ('#grk-visao', 'Visão geral'),
            ('#grk-metodos', '25 métodos'),
            ('#grk-ranking', 'Ranking'),
            ('#grk-graficos', 'Gráficos'),
            ('#grk-recursos', 'Recursos'),
            ('#grk-curriculo', 'Currículo 5 níveis'),
            ('#grk-anki', 'Anki'),
            ('#grk-ia', 'Prompts de IA'),
            ('#grk-checklist', 'Dores e checklist'),
        ],
        'caixa-de-ferramentas.html': [
            ('#cat-busca', 'Busca e filtros'),
            ('#panel-colecao', 'Minha coleção'),
            ('#cat-adicionar', 'Adicionar recurso'),
            ('#cat-import', 'Importar / exportar'),
            ('#cat-externa', 'Descoberta externa'),
        ],
        'index.html': [
            ('#port-books', 'Livros de referência'),
            ('#port-mounce-wallace', 'Mounce × Wallace'),
            ('#port-institutions', 'Instituições'),
            ('#port-coffee', 'Apoie o projeto'),
        ],
    }.get(nav_file, [])

    section_links = '\n'.join(
        f'        <a href="{h}">{t}</a>' for h, t in drawer_extra
    )
    sidebar_links = '\n'.join(
        f'        <a href="{h}">{t}</a>' for h, t in drawer_extra
    )

    return f'''<!doctype html>
<html lang="pt-BR" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <meta name="theme-color" content="#0F3731">
  <meta name="author" content="Rogério Ramão Lopes">
  <link rel="canonical" href="./{nav_file}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:site_name" content="O Sentido Autêntico">
  <meta property="og:url" content="https://rogerelizar-2026.github.io/AutenticSense-Free/{nav_file}">
  <meta name="twitter:card" content="summary">
  <link rel="manifest" href="./manifest.webmanifest">
  <link rel="icon" href="./icons/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="./icons/favicon-48.png" type="image/png">
  <link rel="apple-touch-icon" href="./icons/icon-192.png">
  <link rel="preload" href="./fonts/inter-latin-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="./fonts/inter-latin-600.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="./css/main.css">
  <script>
    try {{
      var t = localStorage.getItem('osa:theme') || localStorage.getItem('theme');
      if (t !== 'light' && t !== 'dark') {{
        t = 'light'; /* padrão do site é tema claro */
      }}
      document.documentElement.dataset.theme = t;
      document.documentElement.style.colorScheme = t;
      var a11y = JSON.parse(localStorage.getItem('osa:a11y:prefs') || '{{}}');
      if (a11y.dyslexia) document.documentElement.dataset.dyslexia = 'on';
      if (a11y.highContrast) document.documentElement.dataset.contrast = 'high';
      if (a11y.fontScale && a11y.fontScale !== 1) document.documentElement.style.fontSize = (16 * a11y.fontScale) + 'px';
    }} catch (e) {{}}
  </script>
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "{title}",
    "inLanguage": "pt-BR",
    "description": "{description}",
    "author": {{ "@type": "Person", "name": "Rogério Ramão Lopes" }}
  }}
  </script>
  {extra_head}
</head>
<body data-page="{page_id}"{' data-lang="he"' if nav_file=='hebraico-aramaico.html' else (' data-lang="grc"' if nav_file=='grego-koine.html' else '')}>
  <a class="osa-skip" href="#main-content">Pular para o conteúdo principal</a>

  <div class="osa-shell">
    <aside class="osa-sidebar" id="osa-sidebar" aria-label="Navegação do site">
      <p class="small" style="font-family:var(--osa-font-display);font-weight:700;margin:0 0 1rem">O Sentido Autêntico</p>
      <nav class="osa-sidebar-nav" aria-label="Seções do site">
        <a href="./index.html" data-nav-file="index.html">Portal do Estudante</a>
        <a href="./hebraico-aramaico.html" data-nav-file="hebraico-aramaico.html">Hebraico e Aramaico</a>
        <a href="./grego-koine.html" data-nav-file="grego-koine.html">Grego Koiné</a>
        <a href="./caixa-de-ferramentas.html" data-nav-file="caixa-de-ferramentas.html">Ferramentas Bíblicas</a>
        <hr style="border:none;border-top:1px solid var(--osa-border);margin:1rem 0">
{sidebar_links}
        <button class="osa-btn osa-btn--outline osa-btn--sm" type="button" data-open-terms style="margin-top:1rem;width:100%">Ler os termos</button>
      </nav>
    </aside>

    <div>
      <header class="osa-header">
        <button class="osa-icon-btn menu-toggle" id="menu-toggle" type="button" aria-label="Abrir menu de navegação" aria-controls="osa-drawer" aria-expanded="false">☰</button>
        <a class="osa-brand" href="./index.html">
          <img class="osa-brand__mark" src="./icons/osa-mark.svg" alt="" width="28" height="28">
          <span class="osa-brand__text">O Sentido Autêntico</span>
        </a>
      </header>

      <main id="main-content" class="osa-main osa-main--wide" tabindex="-1">
{main_html}
        <div id="terms-status" class="visually-hidden" role="status" aria-live="polite"></div>
      </main>

            <footer class="osa-footer">
        <div class="osa-footer__inner">
          <p class="small muted" id="tts-note" style="margin-bottom:.75rem">Observação: vozes em português não pronunciam hebraico e grego corretamente — os trechos originais serão lidos de forma aproximada.</p>
          <p><strong>O Sentido Autêntico</strong><br>
          Idealizador e Curador do Projeto: Rogério Ramão Lopes — <a href="mailto:rogerelizar@gmail.com">rogerelizar@gmail.com</a></p>
          <p class="osa-footer__pwa">
            <button class="osa-btn osa-btn--outline osa-btn--sm" type="button" data-pwa-help>PWA instalável — como usar offline</button>
          </p>
          <p>Material de estudo pessoal. Não forma hermeneutas ou exegetas profissionais, não substitui formação acadêmica, certificação ou acompanhamento de mentores. Explicações assistidas por IA <strong>não constituem scholarship autoritativo</strong>.</p>
        </div>
      </footer>
    </div>
  </div>

  <div class="osa-backdrop" id="osa-backdrop" data-open="false" aria-hidden="true"></div>
  <nav class="osa-drawer" id="osa-drawer" aria-label="Menu" data-open="false">
    <div class="row" style="justify-content:space-between;margin-bottom:1rem">
      <strong style="font-family:var(--osa-font-display)">Menu</strong>
      <button class="osa-icon-btn" type="button" data-drawer-close aria-label="Fechar menu" title="Fechar menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="osa-sidebar-nav">
      <a href="./index.html" data-nav-file="index.html">Portal do Estudante</a>
      <a href="./hebraico-aramaico.html" data-nav-file="hebraico-aramaico.html">Hebraico e Aramaico</a>
      <a href="./grego-koine.html" data-nav-file="grego-koine.html">Grego Koiné</a>
      <a href="./caixa-de-ferramentas.html" data-nav-file="caixa-de-ferramentas.html">Ferramentas Bíblicas</a>
      <hr style="border:none;border-top:1px solid var(--osa-border);margin:.75rem 0">
{section_links}
      <button class="osa-btn osa-btn--outline osa-btn--sm" type="button" data-open-terms style="margin-top:.75rem;width:100%">Ler e aceitar os termos</button>
    </div>
  </nav>

  <nav class="osa-bottomnav" aria-label="Navegação principal">
    <a href="./index.html" data-nav-file="index.html">
      <span class="osa-bottomnav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10.5 12 3l9 7.5V21H3z"/></svg></span>
      Início
    </a>
    <a href="./hebraico-aramaico.html" data-nav-file="hebraico-aramaico.html">
      <span class="osa-bottomnav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor" role="img" focusable="false"><text x="12" y="12" text-anchor="middle" dominant-baseline="central" font-size="23" font-weight="700" font-family="'Noto Serif Hebrew', 'Times New Roman', serif">א</text></svg></span>
      Hebraico
    </a>
    <a href="./grego-koine.html" data-nav-file="grego-koine.html">
      <span class="osa-bottomnav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor" role="img" focusable="false"><text x="12" y="12" text-anchor="middle" dominant-baseline="central" font-size="23" font-weight="700" font-family="'Noto Serif', 'Times New Roman', serif">α</text></svg></span>
      Grego
    </a>
    <a href="./caixa-de-ferramentas.html" data-nav-file="caixa-de-ferramentas.html">
      <span class="osa-bottomnav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><g transform="translate(12 12) scale(1.28) translate(-12 -12)"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2z"/></g></svg></span>
      Ferramentas
    </a>
  </nav>

  <div class="osa-terms-bar" id="terms-bar" data-visible="false" role="region" aria-label="Termos pendentes">
    <span>Você ainda não aceitou os termos de uso desta página.</span>
    <button class="osa-btn osa-btn--gold osa-btn--sm" type="button" data-open-terms-bar>Ler e aceitar os termos</button>
  </div>

  <div class="osa-update-bar" id="update-bar" data-visible="false" role="status">
    <span>Nova versão disponível.</span>
    <button class="osa-btn osa-btn--primary osa-btn--sm" type="button" data-pwa-update>Atualizar</button>
    <button class="osa-btn osa-btn--ghost osa-btn--sm" type="button" data-pwa-dismiss>Agora não</button>
  </div>

  <dialog class="osa-dialog" id="dialog-pwa" aria-labelledby="pwa-title">
    <div class="osa-dialog__body">
      <h2 id="pwa-title" style="margin-top:0">PWA instalável — como usar offline</h2>
      <p>Após a primeira visita com internet, o site abre e estuda <strong>offline como um aplicativo</strong> (conteúdo, catálogo e guias em cache). Android/Chrome: “Instalar aplicativo”. iPhone/Safari: <strong>Compartilhar → Adicionar à Tela de Início</strong>.</p>
      <div class="row" style="justify-content:flex-end">
        <button class="osa-btn osa-btn--primary" type="button" data-pwa-close>Fechar</button>
      </div>
    </div>
  </dialog>

  <dialog class="osa-dialog" id="dialog-termos" aria-labelledby="terms-title">
    <div class="osa-dialog__body">
      <h2 id="terms-title" style="margin-top:0">Termos de estudo e isenção de responsabilidade</h2>
      <p class="small"><strong>O Sentido Autêntico</strong> — Idealizador e Curador: Rogério Ramão Lopes · <a href="mailto:rogerelizar@gmail.com">rogerelizar@gmail.com</a></p>
      <p class="small"><em>“Tecnologia e profundidade histórica para conectar você ao sopro original de Deus.”</em></p>
      <p class="small">Iniciar o estudo das línguas bíblicas originais é dar um passo profundo em direção ao conhecimento de Deus nas Escrituras. Essa caminhada repleta de descobertas e de desafios práticos transformará não apenas sua compreensão do texto sagrado, mas também a forma como você enxerga a vida e como viver melhor através dela.</p>
      <h3 style="font-size:1rem">Propósito e Isenção de Responsabilidade</h3>
      <p class="small"><strong>Este material NÃO tem o propósito de:</strong></p>
      <ul class="small">
        <li>Formar hermeneutas ou exegetas profissionais</li>
        <li>Substituir formação acadêmica formal em teologia ou línguas bíblicas</li>
        <li>Fornecer certificação ou credenciamento acadêmico</li>
        <li>Estabelecer doutrinas ou interpretações teológicas definitivas</li>
        <li>Substituir o acompanhamento de professores qualificados ou mentores espirituais</li>
      </ul>
      <p class="small"><strong>Este material TEM o propósito de:</strong></p>
      <ul class="small">
        <li>Oferecer um recurso imparcial e abrangente para o início do aprendizado</li>
        <li>Apresentar diferentes métodos e abordagens de forma organizada</li>
        <li>Auxiliar na escolha de recursos adequados ao perfil de cada aprendiz</li>
        <li>Facilitar o acesso a informações sobre o estudo dessas línguas</li>
        <li>Encorajar o estudo pessoal das Escrituras em seus idiomas originais</li>
      </ul>
      <p class="small">O estudo das línguas bíblicas é um complemento valioso à leitura das traduções, mas não substitui a orientação espiritual, o discipulado comunitário e a busca por sabedoria divina. Use estes recursos com humildade, respeito e discernimento.</p>
      <h3 style="font-size:1rem">Licença e Direitos Autorais</h3>
      <p class="small">Este projeto foi idealizado e desenvolvido sob a curadoria teológica e acadêmica de Rogério Ramão Lopes em Setembro de 2026.<br>
      Licenciado sob os termos da licença internacional Creative Commons. Você está livre para compartilhar e adaptar o material, desde que atribua o crédito apropriado ao autor, não o utilize para fins comerciais e distribua suas contribuições sob a mesma licença.</p>
      <div class="osa-dialog__consent">
        <label class="osa-check" for="terms-checkbox">
          <input type="checkbox" id="terms-checkbox" name="terms">
          <span>Compreendo e aceito o propósito, as isenções de responsabilidade e as diretrizes de estudo pessoal.</span>
        </label>
      </div>
    </div>
    <div class="osa-dialog__actions">
      <button class="osa-btn osa-btn--primary" type="button" id="terms-accept" disabled>Aceitar e continuar</button>
      <button class="osa-btn osa-btn--outline" type="button" id="terms-cancel">Fechar sem aceitar</button>
    </div>
  </dialog>

  <!-- Botão redondo de acessibilidade (substitui barra + toggle de tema no header) -->
  <div class="osa-a11y-fab-wrap">
    <button class="osa-a11y-fab__btn" id="a11y-fab" type="button" aria-expanded="false" aria-controls="a11y-panel" aria-label="Abrir opções de acessibilidade" title="Acessibilidade">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <circle cx="12" cy="5" r="2"/>
        <path d="M5 9h14"/>
        <path d="M12 9v5"/>
        <path d="M8.5 21 12 14l3.5 7"/>
        <path d="M7 12h10"/>
      </svg>
    </button>
    <div class="osa-a11y-panel" id="a11y-panel" role="group" aria-label="Opções de acessibilidade" hidden>
      <button id="theme-toggle" type="button" aria-label="Alternar para tema escuro" data-theme-icon title="Alternar tema claro/escuro">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" data-theme-icon-svg><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>
      </button>
      <button type="button" data-a11y="font-decrease" aria-label="Diminuir tamanho da fonte" title="Diminuir fonte">A−</button>
      <button type="button" data-a11y="font-increase" aria-label="Aumentar tamanho da fonte" title="Aumentar fonte">A+</button>
      <button type="button" data-a11y="font-reset" aria-label="Redefinir tamanho da fonte" title="Redefinir fonte">A·</button>
      <button type="button" data-a11y="dyslexia" aria-pressed="false" aria-label="Ativar ou desativar fonte para dislexia" title="Fonte dislexia">Ad</button>
      <button type="button" data-a11y="contrast" aria-pressed="false" aria-label="Ativar ou desativar alto contraste" title="Alto contraste">◐</button>
      <button type="button" data-a11y="drawer-autohide" aria-pressed="true" aria-label="Ocultar o menu automaticamente após 4 segundos sem uso" title="Menu oculta sozinho após 4 s (clique para desligar)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="13" r="8"/><path d="M12 9.5V13l2.5 2"/><path d="M9 2h6"/><path d="M12 2v3"/></svg></button>
      <button type="button" data-tts="start" aria-pressed="false" aria-label="Ler página em voz alta" title="Ler em voz alta">▶</button>
      <button type="button" data-tts="stop" disabled aria-label="Parar leitura em voz alta" title="Parar leitura">■</button>
    </div>
  </div>
  <p id="tts-status" class="visually-hidden" role="status" aria-live="polite"></p>

  <div class="osa-toasts" id="osa-toasts" aria-live="polite"></div>

  <script type="module" src="./js/main.js"></script>
  {scripts}
</body>
</html>
'''

if __name__ == '__main__':
    print('Este módulo fornece chrome(); use import para páginas de conteúdo.')
