/* AutenticSense — Ícones SVG inline (sem dependências externas) */
const PATHS = {
  home: 'M4 11.5 12 4l8 7.5M6 10v10h12V10',
  book: 'M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3ZM5 4v16M17 4h2v13',
  scroll: 'M7 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7m0-16a2 2 0 0 0-2 2v12m2 2a2 2 0 0 0 2-2V6',
  alpha: 'M6 18 12 5l6 13M8.5 13h7',
  tools: 'M14.5 6.5a4 4 0 0 0-5.6 5L4 16.4V20h3.6l4.9-4.9a4 4 0 0 0 5-5.6l-2.7 2.7-2.3-.7-.7-2.3Z',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 5.5-2 5-5 2 2-5Z',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 5v.5m0 3v5',
  speaker: 'M4 9v6h4l5 4V5L8 9H4Zm12.5-.5a4.5 4.5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12',
  stop: 'M7 7h10v10H7z',
  copy: 'M9 9h11v11H9zM5 15V4h11',
  check: 'm5 13 4 4 10-11',
  person: 'M12 4a2.4 2.4 0 1 0 0 4.8A2.4 2.4 0 0 0 12 4Zm-6 16c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M12 8.8v2.2',
  contrast: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 2v14a7 7 0 0 0 0-14Z',
  text: 'M5 6h14M12 6v13M8 19h8',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  reset: 'M4 9a8 8 0 1 1-1 6m1-6H1m3 0V4',
  download: 'M12 3v12m0 0 4-4m-4 4-4-4M4 21h16',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Zm7 11 1 2.6 2.6 1-2.6 1L19 21l-1-2.4-2.6-1 2.6-1Zm-14 0 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8Z',
  keyboard: 'M3 7h18v11H3zM6 11h.01M10 11h.01M14 11h.01M18 11h.01M7 15h10',
  external: 'M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  /* Símbolo internacional de acesso: círculo, cabeça, braços abertos e pernas */
  accessibility: 'M12 2.6a9.4 9.4 0 1 0 0 18.8 9.4 9.4 0 0 0 0-18.8'
    + 'M12 5.6a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9'
    + 'M6.7 10.3c3.5.95 7.1.95 10.6 0'
    + 'M12 10.6v3.3m0 0-2.3 4.7m2.3-4.7 2.3 4.7'
};

export function icon(name, cls = 'icon') {
  const d = PATHS[name] || PATHS.info;
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
}
