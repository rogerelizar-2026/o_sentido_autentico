/* AutenticSense — View: 404 */

import { icon } from '../icons.js';

export default {
  title: 'Página não encontrada',
  desc: 'A página solicitada não existe no AutenticSense.',

  render() {
    return `
    <div class="container section center" style="text-align:center;padding-block:6rem">
      <p class="eyebrow">Erro 404</p>
      <h1>Esta página se perdeu no deserto</h1>
      <p class="lede" style="margin-inline:auto">O caminho que você digitou não leva a nenhum texto —
      nem em hebraico, nem em aramaico, nem em grego.</p>
      <p style="margin-top:1.5rem">
        <a class="btn btn-gold" href="#/">${icon('home')} Voltar ao início</a>
        <a class="btn btn-outline" href="#/ferramentas">Ir às ferramentas</a>
      </p>
    </div>`;
  }
};
