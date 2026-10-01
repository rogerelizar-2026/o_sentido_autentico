/* AutenticSense — View: Sobre o projeto
   Espelha o mapa mental: Propósitos e Isenções · Tecnologia e
   Ferramentas · Instituições Recomendadas. */

import { icon } from '../icons.js';

const PROPOSITOS = [
  { t: 'Porta de entrada para o aprendizado', ok: true, d: 'O portal existe para iniciar estudantes no caminho das línguas bíblicas, do zero absoluto à leitura autônoma.' },
  { t: 'Recurso imparcial e abrangente', ok: true, d: 'Apresentamos a metodologia e as referências acadêmicas reconhecidas, sem viés denominacional na apresentação dos dados linguísticos.' },
  { t: 'Feito para o estudo pessoal das Escrituras', ok: true, d: 'Cada página, ferramenta e rota foi pensada para o devocional estudioso e para a preparação de ensino ministerial.' },
  { t: 'Não substitui formação acadêmica', ok: false, d: 'O Sentido Autêntico é guia e caixa de ferramentas — não curso superior. Para formação formal, procure as instituições recomendadas ao final da página.' },
  { t: 'Licença Creative Commons', ok: true, d: 'O conteúdo educacional é livre para uso com atribuição; o código é aberto (MIT (Instituto de Tecnologia de Massachusetts)). Nada aqui é vendido ou paywalled.' }
];

const APPS = [
  { nome: 'Sofia App', tag: 'Análise exegética profunda', d: 'Anatomia do estudo em camadas: morfologia gramatical completa, domínios Louw-Nida e léxicos Strong e Goodrick-Kohlenberger — com privacidade absoluta e foco acadêmico.' },
  { nome: 'Ginoskos', tag: 'Leitura contínua', d: 'Leitura grega e hebraica com parsing integrado, ideal para o bloco de imersão diária.' },
  { nome: 'Global Bible Tools', tag: 'Pesquisa morfológica', d: 'Pesquisa avançada de formas, morfologias e estruturas — a mesa de trabalho do estudante avançado.' },
  { nome: 'Blue Letter Bible', tag: 'Análise léxica', d: 'Ferramenta indispensável de consulta léxica, dicionários e análise interlinear em português e inglês.' },
  { nome: 'Sefaria', tag: 'Textos comparados', d: 'Biblioteca digital aberta com acesso gratuito a textos originais e traduções comparadas.' },
  { nome: 'Anki', tag: 'Repetição espaçada (SRS (sistema de repetição espaçada))', d: 'O coração do Bloco 1: flashcards de vocabulário e paradigmas com algoritmo de memória de longo prazo.' }
];

const ESTRATEGIAS_IA = [
  'Ditados fonéticos interativos (som-grafia)',
  'Parsing reverso com feedback imediato',
  'Análise de desvios de verbos fracos e estruturas complexas',
  'Co-mentoria exegética no protocolo S.O.I.A. (Sintaxe, Observação, Interpretação, Aplicação)'
];

const INSTITUICOES = [
  {
    nome: 'Faculdade Batista Logos',
    uf: 'SP',
    url: 'https://faculdadelogos.edu.br/',
    d: 'Tradição batista com forte ênfase bíblico-teológica e formação ministerial em São Paulo.'
  },
  {
    nome: 'AIBREB — Associação das Igrejas Batistas Regulares do Brasil',
    uf: 'Nacional',
    url: 'https://aibreb.org.br/',
    d: 'Rede nacional de ensino teológico à distância e presencial, com trilhas em línguas bíblicas.'
  }
];

export default {
  title: 'Sobre',
  desc: 'Propósitos e isenções, tecnologia e ferramentas recomendadas e instituições recomendadas da metodologia Sentido Autêntico.',

  render() {
    const propositos = PROPOSITOS.map((p) => `
      <li><span><strong>${p.t}.</strong> ${p.d}</span></li>`).join('');

    const apps = APPS.map((a) => `
      <div class="app-card">
        <h4>${a.nome}</h4>
        <p class="app-tag">${a.tag}</p>
        <p style="margin-top:0.4rem">${a.d}</p>
      </div>`).join('');

    const ia = ESTRATEGIAS_IA.map((e) => `<li><span>${e}</span></li>`).join('');

    const inst = INSTITUICOES.map((i) => `
      <div class="app-card">
        <h4>${i.nome} <span class="chip chip-gold">${i.uf}</span></h4>
        <p style="margin-top:0.4rem">${i.d}</p>
        <p style="margin-top:0.7rem">
          <a class="btn btn-outline btn-sm" href="${i.url}" target="_blank" rel="noopener noreferrer">
            ${icon('external')} Acessar o site
            <span class="sr-only">de ${i.nome} (abre em nova aba)</span>
          </a>
        </p>
      </div>`).join('');

    return `
    <div class="container">
      <header class="page-head">
        <nav class="breadcrumb" aria-label="Trilha de navegação">
          <ol><li><a href="#/">Início</a></li><li aria-current="page">Sobre o projeto</li></ol>
        </nav>
        <span class="eyebrow">${icon('info')} Sentido Autêntico v2.1</span>
        <h1>Sobre o projeto</h1>
        <p class="lede">
          <strong>Sentido Autêntico</strong>, de <strong>rogerelizar</strong>, nasceu de uma convicção:
          todo estudante da Bíblia, e não apenas especialistas, merece um mapa claro para
          as línguas originais, com método, ferramentas e referências de excelência.
        </p>
      </header>

      <section class="section" aria-labelledby="propositos">
        <p class="section-kicker">Nosso termo de uso honesto</p>
        <h2 id="propositos">Propósitos e isenções</h2>
        <ul class="check-list" style="margin-top:1.2rem">${propositos}</ul>
      </section>

      <section class="section" aria-labelledby="tecnologia">
        <p class="section-kicker">Ecossistema de apoio</p>
        <h2 id="tecnologia">Tecnologia e ferramentas recomendadas</h2>
        <p>Beyond this portal, o estudioso moderno conta com um ecossistema gratuito de
        aplicativos e plataformas para o parsing, a consulta léxica e a memorização:</p>
        <div class="app-grid">${apps}</div>

        <figure class="info-figure">
          <img src="assets/img/info/sofia.jpg" loading="lazy" decoding="async"
               alt="Infográfico Sofia App — Anatomia do Estudo Bíblico Profundo: núcleo de análise exegética com morfologia gramatical, domínios Louw-Nida e léxicos Strong e GK (Goodrick-Kohlenberger), sobre pilares de avaliação máxima, privacidade de dados absoluta e foco em referência acadêmica.">
          <figcaption><strong>Sofia App:</strong> a anatomia do estudo bíblico profundo em camadas — da morfologia à semântica Louw-Nida, sobre uma base de privacidade absoluta.</figcaption>
        </figure>

        <h3 style="margin-top:2rem">A inteligência artificial como co-mentora</h3>
        <p>Na metodologia de aceleração, a inteligência artificial (por exemplo, o Notebook
        Gemini) gera prática personalizada que nenhum livro estático oferece:</p>
        <ul class="check-list" style="margin-top:0.8rem">${ia}</ul>
        <p class="small muted" style="margin-top:0.8rem">Detalhes, validação acadêmica e comparativo de eficácia na <a href="#/rota">Rota de Crescimento</a>.</p>
      </section>

      <section class="section" aria-labelledby="instituicoes">
        <p class="section-kicker">Para ir além</p>
        <h2 id="instituicoes">Instituições recomendadas</h2>
        <p>O portal não substitui a formação teológica formal. Para graduação e
        pós-graduação em línguas bíblicas e exegese, recomendamos instituições reconhecidas:</p>
        <div class="app-grid">${inst}</div>
      </section>

      <section class="section" aria-labelledby="instalar">
        <p class="section-kicker">Aplicativo instalável</p>
        <h2 id="instalar">Como instalar no seu dispositivo</h2>
        <ol class="steps">
          <li><div><h3>No computador (Chrome/Edge)</h3><p>Clique no botão <strong>Instalar</strong> no topo da página (ou no ícone de instalação da barra de endereço) e confirme. O app abre em janela própria.</p></div></li>
          <li><div><h3>No Android (Chrome)</h3><p>Toque no menu <strong>⋮</strong> e escolha <strong>“Adicionar à tela inicial”</strong> ou <strong>“Instalar aplicativo”</strong>.</p></div></li>
          <li><div><h3>No iPhone/iPad (Safari)</h3><p>Toque em <strong>Compartilhar</strong> e depois em <strong>“Adicionar à Tela de Início”</strong>. O ícone do pergaminho dourado aparece entre seus apps.</p></div></li>
        </ol>
        <div class="callout callout--ok">
          <span class="callout-title">Depois de instalado</span>
          Todo o conteúdo — textos, guias, ferramentas, infográficos e fontes — funciona
          <strong>sem internet</strong>, ideal para estudo em locais sem conexão.
        </div>
      </section>

      <section class="section" aria-labelledby="ficha">
        <p class="section-kicker">Transparência</p>
        <h2 id="ficha">Ficha técnica</h2>
        <div class="table-wrap">
          <table>
            <tbody>
              <tr><th scope="row">Nome</th><td>Sentido Autêntico</td></tr>
              <tr><th scope="row">Autoria</th><td>rogerelizar</td></tr>
              <tr><th scope="row">Tipo</th><td>Progressive Web App (PWA (aplicativo web progressivo)) educacional, standalone e offline-first</td></tr>
              <tr><th scope="row">Stack</th><td>HTML5 (linguagem de marcação da web) semântico, CSS3 (folhas de estilo em cascata) modular (design tokens) e JavaScript ES6 (ECMAScript 6, o padrão do JavaScript) puro — zero dependências de runtime</td></tr>
              <tr><th scope="row">Tipografia</th><td>Noto Serif & Noto Serif Hebrew (auto-hospedadas), pilhas nativas do sistema como fallback</td></tr>
              <tr><th scope="row">Acessibilidade</th><td>WCAG (Diretrizes de Acessibilidade para Conteúdo Web) 2.2 nível AA (segundo nível de conformidade): TTS (leitura de texto em voz alta), modo dislexia, alto contraste, tema escuro, teclado completo, aria-live</td></tr>
              <tr><th scope="row">Fontes textuais</th><td>AT (Antigo Testamento): tradição massorética (BHS (Biblia Hebraica Stuttgartensia)/BHQ (Biblia Hebraica Quinta)) · NT (Novo Testamento): texto crítico grego (NA28 (Nestle-Aland, 28.ª edição)/UBS5 (United Bible Societies, 5.ª edição)) — glosas pedagógicas originais</td></tr>
              <tr><th scope="row">Metodologia</th><td>Híbrida multimodal integrada: 5 níveis, ritmo 60 min/dia, SRS com o aplicativo Anki, co-mentoria com inteligência artificial e obras de referência acadêmica</td></tr>
              <tr><th scope="row">Conteúdo</th><td>Licença Creative Commons — uso educacional livre com atribuição · Código sob licença MIT</td></tr>
              <tr><th scope="row">Privacidade</th><td>Nenhum dado pessoal coletado, sem cookies de terceiros, sem servidores de aplicação</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <aside class="cta-band" aria-labelledby="cta-sobre">
        <h2 id="cta-sobre">Comece a jornada</h2>
        <p>Do álefe ao ômega: três línguas, cinco níveis, um só sentido — o sentido autêntico.</p>
        <a class="btn btn-gold" href="#/rota">Iniciar pelo Nível 1</a>
      </aside>
    </div>`;
  }
};
