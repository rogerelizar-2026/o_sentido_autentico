/* export.js — camada de exportação sob demanda.
 * PDF: fallback honesto via folha de impressão (sem lib de shaping de
 * hebraico/grego no cliente). JSON: exportação nativa do catálogo.
 * Mantido separado para permitir lazy-load futuro sem alterar chamadores. */

export { exportJSON, exportPDF, importJSONFile } from './catalog.js';
