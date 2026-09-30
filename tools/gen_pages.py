#!/usr/bin/env python3
"""Gera hebraico-aramaico.html, grego-koine.html e caixa-de-ferramentas.html."""
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent))
from build_pages import chrome, ROOT

# ---------------------------------------------------------------------------
# HEBRAICO & ARAMAICO (Apêndice C.2)
# ---------------------------------------------------------------------------
heb_main = r'''
        <p class="small" style="letter-spacing:.08em;text-transform:uppercase;color:var(--osa-gold-ink);font-weight:700">Destino 2 de 4</p>
        <div class="osa-page-heading">
          <svg class="osa-page-heading__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 4.5v12.5"/><path d="M3 8.5a9 9 0 0 0 18 0"/><path d="M7 8.5a5 5 0 0 0 10 0"/><path d="M10 8.5a2 2 0 0 0 4 0"/><path d="M12 17v3.5"/><path d="M8.5 20.5h7"/></svg>
          <h1 id="heb-h1">Hebraico Bíblico <em>e Aramaico</em></h1>
        </div>
        <div class="osa-callout osa-callout--gold" role="note">
          <p style="margin:0"><strong>Esta página também cobre o aramaico bíblico.</strong> O currículo dedica o nível Intermediário à leitura de passagens aramaicas (referências de leitura: <bdi>Dt 2:25</bdi>; <bdi>Jr 10:11</bdi>; <bdi>Et 3:15–4:8</bdi>), além do hebraico do Antigo Testamento. O léxico e a morfologia aramaica entram como extensão natural do alfabeto hebraico (compartilhado em sua forma quadrática).</p>
        </div>

        <div class="osa-scripture-banner" aria-label="Abertura em hebraico e grego">
          <span class="he" lang="he" dir="rtl">בְּרֵאשִׁית בָּרֵא אֱלֹהִים</span>
          <span class="sep" aria-hidden="true">|</span>
          <span class="grc" lang="grc">Ἐν ἀρχῇ ἦν ὁ λόγος</span>
        </div>

        <nav class="osa-toc" id="toc" aria-labelledby="toc-title">
          <h2 id="toc-title">Nesta página</h2>
          <ol></ol>
        </nav>

        <!-- 0. Propósito -->
        <section class="prose-section" id="heb-intro" aria-labelledby="heb-h0">
          <h2 id="heb-h0">Introdução e propósito</h2>
          <p class="lead">Este destino reúne estratégia, métodos, currículo e ferramentas para <strong>iniciar o estudo do hebraico bíblico</strong> — incluindo os trechos em <strong>aramaico bíblico</strong> — com rotina sustentável de 30 a 60 minutos por dia.</p>
          <p>O caminho é transparente: você verá 25 métodos de aprendizagem de línguas com <em>estimativas editoriais de setembro de 2026</em> rotuladas, um ranking com critério explícito, gráficos gerados a partir da própria tabela de dados, recursos gratuitos e pagos, e um currículo de cinco níveis com checkpoints.</p>
        </section>

        <!-- 1. Visão geral e estatísticas -->
        <section class="prose-section" id="heb-visao" aria-labelledby="heb-h1v">
          <h2 id="heb-h1v">1. Visão geral e estatísticas</h2>
          <p>Características do <strong>alfabeto hebraico</strong> (familiar compartilhado com o aramaico quadrático) — fatos de língua, sem contagens fabricadas:</p>
          <div class="osa-table-scroll" role="region" tabindex="0" aria-label="Tabela de características do hebraico bíblico">
            <table class="osa-table">
              <caption>Características estruturais (fatos de língua)</caption>
              <thead><tr><th scope="col">Aspecto</th><th scope="col">Descrição</th></tr></thead>
              <tbody>
                <tr><th scope="row">Escrita</th><td>Alfabeto de 22 consoantes, da direita para a esquerda; sem vogais plenas no texto massorético histórico (marcas de vocalização = niqqud, sistema massorético)</td></tr>
                <tr><th scope="row">Niqqud</th><td>Sistema de sinais vocálicos e de acentuação usado na tradição de leitura do texto bíblico</td></tr>
                <tr><th scope="row">Família linguística</th><td>Línguas semíticas (ramo canaanita): parentes do aramaico, acádio e árabe</td></tr>
                <tr><th scope="row">Direção</th><td>RTL (direita-para-esquerda); a interface do site permanece em LTR — apenas os trechos bíblicos usam <span class="visually-hidden">direção </span><code>dir="rtl"</code></td></tr>
                <tr><th scope="row">Aramaico bíblico</th><td>Presente em partes de Daniel e Esdras, além de versículos isolados (ex.: Jr 10:11); compartilha o alfabeto com formas próprias de escrita e morfologia</td></tr>
                <tr><th scope="row">Raízes</th><td>Mebuladas em radicais consonantais (geralmente trilíteras) — chave do vocabulário e dos stems verbais</td></tr>
                <tr><th scope="row">Estado construto</th><td>Relação possessiva/articular entre substantivos — núcleo da sintaxe nominal inicial</td></tr>
                <tr><th scope="row">Estimativa editorial de esforço</th><td>≈ 56 semanas de rotina diária até leitura confortável com gramática, conforme o plano deste portal — <strong>não é estatística oficial</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p class="editorial-note">Nenhum número desta seção é “estatística de mercado” ou contagem de falantes: são <strong>fatos linguísticos</strong> e uma <strong>estimativa editorial de esforço</strong> do projeto (setembro de 2026).</p>
        </section>

        <!-- 2. 25 métodos -->
        <section class="prose-section" id="heb-metodos" aria-labelledby="heb-h2m">
          <h2 id="heb-h2m">2. Métodos de aprendizado (25 métodos analisados)</h2>
          <p>Conjunto de métodos reais e reconhecidos de aprendizagem de línguas, adaptados ao hebraico/aramaico bíblicos. <strong>Eficiência, complexidade e tempo são estimativas editoriais de setembro de 2026 (0–10 e semanas)</strong> — use para comparar perfis, não como resultado de pesquisa.</p>
          <p class="small muted">Explore pelos cartões (com barras comparativas) ou abra a tabela completa no fim da seção. Busca, filtros e ordenação agem sobre os 25 métodos e o resumo abaixo é recalculado sobre o que estiver visível.</p>
          <div id="heb-methods-table"></div>
        </section>

        <!-- 3. Análise didática -->
        <section class="prose-section" id="heb-analise" aria-labelledby="heb-h3a">
          <h2 id="heb-h3a">3. Análise didática detalhada</h2>
          <details class="osa-accordion" open>
            <summary class="osa-accordion__summary">Centradas no professor</summary>
            <div class="osa-accordion__content">
              <p><strong>Gramática–Tradução, Método Direto, Áudio-Lingual, Suggestopedia</strong> e partes da Via Silenciosa dependem de mediação forte. São excelentes para entregar clareza de paradigma e correção, mas sozinhas atrasam o contato com o texto autêntico. Uso recomendado: aulas ou vídeos <em>sobre</em> gramática, nunca no lugar da leitura diária.</p>
            </div>
          </details>
          <details class="osa-accordion">
            <summary class="osa-accordion__summary">Centradas no aluno</summary>
            <div class="osa-accordion__content">
              <p><strong>Repetição espaçada (Anki), Coaching, TPR, Abordagem Natural, CLL, Tradução Inversa, Shadowing, Mnemônicas</strong> dão autonomia ao autodidata. O risco é a bolha: sem texto longo e sem correção humana periódica, o repertório cresce desconectado da leitura. Uso recomendado: blocos curtos diários + 1 mentor ou grupo quinzenal.</p>
            </div>
          </details>
          <details class="osa-accordion">
            <summary class="osa-accordion__summary">Centradas no texto</summary>
            <div class="osa-accordion__content">
              <p><strong>Leitura direta, Leitura extensiva/estreita, Entrada Compreensível, Ensino por Conteúdo, Assimilação, Imersão textual</strong> mantêm o texto bíblico no centro — objetivo final do portal. Uso recomendado: coluna vertebral do currículo, com gramática como suporte sob demanda (Ross, interlinear, léxicos).</p>
            </div>
          </details>
        </section>

        <!-- 4. Ranking -->
        <section class="prose-section" id="heb-ranking" aria-labelledby="heb-h4r">
          <h2 id="heb-h4r">4. Ranking de eficácia</h2>
          <div id="heb-ranking-list" aria-live="polite"></div>
        </section>

        <!-- 5. Gráficos -->
        <section class="prose-section" id="heb-graficos" aria-labelledby="heb-h5g">
          <h2 id="heb-h5g">5. Gráficos comparativos</h2>
          <p>Quatro visualizações geradas <strong>somente</strong> com os valores da tabela de 25 métodos; cada uma inclui resumo textual e tabela de dados equivalente.</p>
          <div id="charts-host"></div>
        </section>

        <!-- 5.1 Infográfico -->
        <section class="prose-section" id="heb-infografico" aria-labelledby="heb-h51">
          <h2 id="heb-h51">5.1 Infográfico do plano</h2>
          <figure class="osa-figure">
            <img src="./downloads/mapa-aceleracao.svg" alt="Infográfico com os cinco níveis do currículo: Fundação, Básico, Intermediário, Avançado e Fluência, e o método vencedor de integração híbrida." width="960" height="540" loading="lazy" decoding="async">
            <figcaption>Cronologia <strong>estimativa editorial de setembro de 2026</strong> — referenciais de estudo, não calendário oficial de editoras.</figcaption>
          </figure>
        </section>

        <!-- 6. Recursos gratuitos -->
        <section class="prose-section" id="heb-recursos" aria-labelledby="heb-h6">
          <h2 id="heb-h6">6. Recursos gratuitos</h2>
          <ul>
            <li><a href="https://biblehub.com/interlinear" target="_blank" rel="noopener noreferrer external">Bible Hub Interlinear</a> — interlinear hebraico/grego, Strong, BDB, Gesenius.</li>
            <li><a href="https://stepbible.org/" target="_blank" rel="noopener noreferrer external">Step Bible</a> — análise interlinear e léxica (Tyndale House).</li>
            <li><a href="https://biblicallanguagecenter.com/" target="_blank" rel="noopener noreferrer external">Aleph with Beth</a> — curso imersivo-comunicativo em vídeo.</li>
            <li><strong>Anki + compartilhamentos</strong> — decks compartilhados da comunidade; confira autoria e qualidade antes de instalar.</li>
            <li><a href="https://sefaria.org/" target="_blank" rel="noopener noreferrer external">Sefaria</a> — Tanakh com traduções paralelas.</li>
            <li><a href="https://www.deadseascrolls.org.il/" target="_blank" rel="noopener noreferrer external">Dead Sea Scrolls Digital Library</a> — manuscritos digitalizados.</li>
            <li><a href="https://etcbc.github.io/bhsa/" target="_blank" rel="noopener noreferrer external">ETCBC</a> — base de dados anotada sintaticamente (avançado).</li>
          </ul>
        </section>

        <!-- 7. Recursos pagos por faixa -->
        <section class="prose-section" id="heb-pagos" aria-labelledby="heb-h7">
          <h2 id="heb-h7">7. Recursos pagos por faixa de preço</h2>
          <p>Agrupamento editorial por investimento relativo — <strong>faixas qualitativas</strong>, não tabelas de preço (preços mudam; confira nos sites oficiais). Somente obras do catálogo oficial (Apêndice B):</p>
          <div class="osa-table-scroll" role="region" tabindex="0" aria-label="Faixas de preço de recursos pagos">
            <table class="osa-table">
              <caption>Recursos pagos — faixa editorial de investimento</caption>
              <thead><tr><th scope="col">Faixa</th><th scope="col">Recursos</th><th scope="col">Observação</th></tr></thead>
              <tbody>
                <tr><th scope="row">Baixo</th><td>— (nenhum item do catálogo nesta faixa para hebraico/aramaico)</td><td>Comece pelos gratuitos + Anki</td></tr>
                <tr><th scope="row">Médio</th><td><em>Gramática do Hebraico Bíblico</em> (Ross)</td><td>Livro didático de base do currículo</td></tr>
                <tr><th scope="row">Alto</th><td>HALOT (léxico) · Accordance Bible Software</td><td>Investimento de referência acadêmica</td></tr>
                <tr><th scope="row">Muito alto</th><td>Logos Bible Software (com bibliotecas)</td><td>Plataforma + biblioteca digital expandível</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 9. Método vencedor -->
        <section class="prose-section" id="heb-vencedor" aria-labelledby="heb-h9">
          <h2 id="heb-h9">9. O método vencedor: integração híbrida</h2>
          <p><strong>Leitura direta do texto + gramática ativa (parsing) + Anki (repetição espaçada) + coaching textual</strong> com mentor ou grupo.</p>
          <h3>Cinco princípios</h3>
          <ol>
            <li><strong>Texto primeiro, gramática sob demanda</strong> — a página do texto é a aula; a gramática esclarece o que travou.</li>
            <li><strong>Parsing ativo diário</strong> — 10 minutos de classificação de formas valem mais que 30 minutos de leitura passiva no início.</li>
            <li><strong>Memória espaçada</strong> — Anki carrega vocabulário e paradigmas irregulares sem sobrecarga.</li>
            <li><strong>Feedback humano quinzenal</strong> — mentor, professor ou grupo corrige generalizações precipitadas.</li>
            <li><strong>Consistência sobre intensidade</strong> — 30–60 min/dia, 6 dias/semana, em vez de maratonas.</li>
          </ol>
        </section>

        <!-- 10. Currículo -->
        <section class="prose-section" id="heb-curriculo" aria-labelledby="heb-h10">
          <h2 id="heb-h10">10. Currículo em cinco níveis</h2>

          <article class="osa-level" id="heb-nivel-1">
            <span class="osa-level__badge">Nível 1 · Semanas 1–8</span>
            <h3 class="osa-level__titulo">Fundação</h3>
            <p><strong>Objetivos:</strong> reconhecer e escrever o alfabeto; marcar e pronunciar niqqud; ler sílabas; decodificar <bdi lang="he" dir="rtl">בְּרֵאשִׁית אֱלֹהִים</bdi> em <bdi>Gn 1</bdi> com apoio.</p>
            <p><strong>Materiais gratuitos:</strong> Aleph with Beth (primeiras lições), Bible Hub Interlinear, Anki (alfabeto e 100 primeiras raízes), Sefaria.</p>
            <p><strong>Estratégias:</strong> drill curto de letras 2×/dia; leitura em voz alta da página inteira de Gn 1; cartas Anki com raiz + glossa.</p>
            <p><strong>Checkpoint:</strong> soletrar e ler Gn 1:1–5 sem niqqud auxiliar na tela (pode consultar tabela quando travar).</p>
          </article>

          <article class="osa-level" id="heb-nivel-2">
            <span class="osa-level__badge">Nível 2 · Semanas 9–20</span>
            <h3 class="osa-level__titulo">Básico</h3>
            <p><strong>Objetivos:</strong> morfologia de substantivos (sufixos, paragogicos), <strong>Qal perfeito e imperfeito</strong>, <strong>estado construto</strong>; vocabulário de alta frequência em Gênesis.</p>
            <p><strong>Materiais:</strong> Ross (capítulos iniciais), Step Bible, interlinear Bible Hub, Anki de paradigmas.</p>
            <p><strong>Estratégias:</strong> 1 página de texto + 15 formas de parsing; glossário crescente por capítulo.</p>
            <p><strong>Checkpoint:</strong> traduzir Gn 2–3 com dicionário, identificando estado construto e formas Qal básicas.</p>
          </article>

          <article class="osa-level" id="heb-nivel-3">
            <span class="osa-level__badge">Nível 3 · Semanas 21–36</span>
            <h3 class="osa-level__titulo">Intermediário</h3>
            <p><strong>Objetivos:</strong> stems verbais (Niphal, Piel, Hiphil…), sintaxe frasal básica e <strong>leitura de aramaico bíblico</strong>. Passagens de referência para leitura: <bdi>Dt 2:25</bdi>; <bdi>Jr 10:11</bdi>; <bdi>Et 3:15–4:8</bdi> (Daniel/Ester na tradição aramaica — conferir edição).</p>
            <p><strong>Materiais:</strong> Ross (meio), ETCBC/interlineares para conferência, Aleph with Beth avançando.</p>
            <p><strong>Estratégias:</strong> comparar stems na mesma raiz; leitura do bloco aramaico de Daniel com gramática de aramaico bíblico quando disponível.</p>
            <p><strong>Checkpoint:</strong> classificar stems em um parágrafo de Jr 10 e ler um trecho de Dn 2 com apoio.</p>
          </article>

          <article class="osa-level" id="heb-nivel-4">
            <span class="osa-level__badge">Nível 4 · Semanas 37–56</span>
            <h3 class="osa-level__titulo">Avançado</h3>
            <p><strong>Objetivos:</strong> leitura extensiva (Salmos, Gênis, narrativa de Reis), exercícios de exegese curta, contato com aparato textual (ETCBS, DSS digital library).</p>
            <p><strong>Materiais:</strong> HALOT (consulta), ETCBC, Dead Sea Scrolls Digital Library, Accordance/Logos se disponível.</p>
            <p><strong>Estratégias:</strong> projeto de leitura de um livro inteiro; nota exegética semanal de 5 linhas; comparação MT × traduções.</p>
            <p><strong>Checkpoint:</strong> plano de leitura cumprido por 4 semanas seguidas com vocabulário estável.</p>
          </article>

          <article class="osa-level" id="heb-nivel-5">
            <span class="osa-level__badge">Nível 5 · Manutenção</span>
            <h3 class="osa-level__titulo">Fluência e manutenção</h3>
            <p><strong>Objetivos:</strong> manutenção semanal — leitura contínua, revisão Anki enxuta, participação em grupo de estudo do texto.</p>
            <p><strong>Estratégias:</strong> 1 sessão/semana de coaching textual; ler a paráshá ou o texto do culto no original; alternar hebraico e aramaico.</p>
            <p><strong>Checkpoint contínuo:</strong> nunca zerar o Anki por 2 semanas seguidas; 1 nota exegética/mês.</p>
          </article>

          <p class="editorial-note"><strong>Notas de idioma e custo (estimativas editoriais de setembro de 2026):</strong> materiais em <strong>PT</strong> — Ross (Vida) e traduções didáticas; em <strong>ES</strong> — bons manuais de gramática e canais de vídeo (variação de qualidade); em <strong>EN</strong> — maior volume de recursos gratuitos (Step Bible, cursos, léxicos). Custo do caminho gratuito ≈ 0 (web + Anki); caminho com livro ≈ 1 livro didático; caminho com software ≈ investimento recorrente. Faixas qualitativas — não são preços de mercado.</p>
        </section>

        <!-- 12. Anki -->
        <section class="prose-section" id="heb-anki" aria-labelledby="heb-h12">
          <h2 id="heb-h12">12. Configuração prática do Anki</h2>
          <ol>
            <li><strong>Conta:</strong> crie no computador (desktop) primeiro; sincronize para mobile. Conta gratuita padrão basta.</li>
            <li><strong>Baralho:</strong> um baralho “Hebraico OSA” com subbaralhos: Alfabeto · Raízes Gn · Paradigmas Qal · Stems · Conectores.</li>
            <li><strong>Intervalos:</strong> comece com máximo de 20 cartas novas/dia e teto de 100 revisões; suba devagar.</li>
            <li><strong>Niqqud:</strong> cartas de leitura com niqqud completo nas duas faces; depois “subidas” (formas sem niqqud) em subbaralho separado para não poluir o reconhecimento.</li>
            <li><strong>Conectores e partículas:</strong> cartas de contexto (versículo com o conector real), não listas soltas.</li>
            <li><strong>Formato:</strong> frente = forma no contexto (ou raiz), verso = glossa + morfologia + referência do versículo.</li>
          </ol>
        </section>

        <!-- 13. Prompts IA -->
        <section class="prose-section" id="heb-ia" aria-labelledby="heb-h13">
          <h2 id="heb-h13">13. Prompts de IA (copiáveis)</h2>
          <div class="osa-callout osa-callout--warn"><p style="margin:0">Use a IA para <em>praticar</em>, nunca para substituir a leitura do texto. Explicações geradas por IA não são scholarship autoritativo.</p></div>

          <div class="osa-prompt">
            <strong>1. Tutor de hebraico bíblico</strong>
            <pre id="prompt-heb-1">Você é um tutor paciente de hebraico bíblico para estudantes brasileiros de nível inicial. Explique em português claro, preserve o niqqud, nunca invente formas inexistentes e sempre avise quando algo exigir confirmação em gramática (ex.: Ross). Comece perguntando meu nível e meu objetivo desta semana.</pre>
            <button class="osa-btn osa-btn--outline osa-btn--sm" type="button" data-copy-target="#prompt-heb-1">Copiar prompt</button>
          </div>
          <div class="osa-prompt">
            <strong>2. Drilling de vocabulário</strong>
            <pre id="prompt-heb-2">Liste 10 raízes hebraicas de alta frequência do livro de Gênesis. Para cada uma: forma no texto, glossa em português, categoria e um versículo de exemplo. Ao final, gere 10 perguntas de reconhecimento (raiz → sentido) e depois as respostas.</pre>
            <button class="osa-btn osa-btn--outline osa-btn--sm" type="button" data-copy-target="#prompt-heb-2">Copiar prompt</button>
          </div>
          <div class="osa-prompt">
            <strong>3. Revisão de erros de parsing</strong>
            <pre id="prompt-heb-3">Vou descrever como classifiquei formas hebraicas. Aponte erros prováveis, explique a regra (pessoa, tempo/aspecto, stem) e proponha 5 formas similares para eu revisar. Se eu citar um versículo, peça que eu confirme a leitura no texto antes de aceitar qualquer correção.</pre>
            <button class="osa-btn osa-btn--outline osa-btn--sm" type="button" data-copy-target="#prompt-heb-3">Copiar prompt</button>
          </div>
          <div class="osa-prompt">
            <strong>4. Ditado reverso</strong>
            <pre id="prompt-heb-4">Faça ditado reverso de hebraico: envie 8 formas (com niqqud) uma por vez; eu devo escrever raiz, pessoa, tempo/aspecto e stem. Depois me dê nota e explique só os erros. Formas do nível Fundação–Básico.</pre>
            <button class="osa-btn osa-btn--outline osa-btn--sm" type="button" data-copy-target="#prompt-heb-4">Copiar prompt</button>
          </div>
          <div class="osa-prompt">
            <strong>5. Co-mentoria exegética</strong>
            <pre id="prompt-heb-5">Leia comigo o versículo que vou colar. Levante 2–3 hipóteses de análise (lexical, morfológica, sintática) COM as dúvidas explicitadas, indique o que conferir em léxico/gramática e o que um professor deveria validar. Não emitir conclusão dogmática — somente roteiro de verificação.</pre>
            <button class="osa-btn osa-btn--outline osa-btn--sm" type="button" data-copy-target="#prompt-heb-5">Copiar prompt</button>
          </div>
          <div class="osa-prompt">
            <strong>6. Plano de estudo semanal</strong>
            <pre id="prompt-heb-6">Monte um plano de 7 dias, 40 min/dia, para o nível que eu descrever (Fundação, Básico, Intermediário…). Inclua: Anki, drill de formas, leitura de texto e 1 tarefa de produção. Formatado em tabela dia a dia, em português, sem prometer fluência.</pre>
            <button class="osa-btn osa-btn--outline osa-btn--sm" type="button" data-copy-target="#prompt-heb-6">Copiar prompt</button>
          </div>
        </section>

        <!-- 14. Checklist + troubleshooting -->
        <section class="prose-section" id="heb-checklist" aria-labelledby="heb-h14">
          <h2 id="heb-h14">14. Checklist diária e solução de problemas</h2>
          <h3>Checklist do dia (marca o que fizer — fica salvo só neste dispositivo)</h3>
          <ul class="osa-checklist" data-checklist="hebraico">
            <li><label><input type="checkbox" data-check="anki"> Revisar Anki (novos + revisões)</label></li>
            <li><label><input type="checkbox" data-check="formas"> Drill de 10 formas (parsing)</label></li>
            <li><label><input type="checkbox" data-check="texto"> Ler texto autêntico (1 página ou 15 min)</label></li>
            <li><label><input type="checkbox" data-check="gramatica"> Consultar gramática só onde travou</label></li>
            <li><label><input type="checkbox" data-check="nota"> Escrever 3 linhas do que aprendeu</label></li>
          </ul>

          <h3>Tabela de problemas comuns</h3>
          <div class="osa-table-scroll" role="region" tabindex="0" aria-label="Tabela de solução de problemas de estudo">
            <table class="osa-table">
              <caption>Troubleshooting do estudante</caption>
              <thead><tr><th scope="col">Sintoma</th><th scope="col">Causa provável</th><th scope="col">Ação</th></tr></thead>
              <tbody>
                <tr><th scope="row">“Esqueço o alfabeto constantemente”</th><td>Pouca exposição diária, muito espaçada</td><td>Drill de 3 min, 2×/dia, com cartas físicas ou Anki mínimo</td></tr>
                <tr><th scope="row">“Niqqud me confunde”</th><td>Leitura sem voz alta</td><td>LER em voz alta; separar subbaralho de formas sem niqqud</td></tr>
                <tr><th scope="row">“Sei paradigmas mas não leio texto”</th><td>Excesso de gramática, falta de texto</td><td>Inverter a rotina: 60% texto, 40% drill (método híbrido)</td></tr>
                <tr><th scope="row">“Aramaico parece outro idioma”</th><td>Pular a ponte do alfabeto compartilhado</td><td>Revisar semelhanças hebreu-aramaico antes de Dn 2; leitura gradual</td></tr>
                <tr><th scope="row">“Maratona de domingo e nada fixa”</th><td>Interferência por falta de repetição espaçada</td><td>Reduzir para 40 min × 6 dias com Anki obrigatório</td></tr>
                <tr><th scope="row">“IA me dá respostas contraditórias”</th><td>Modelo sem acesso ao texto confiável</td><td>Exigir referência do versículo; conferir em interlinear/gramática; perguntar ao mentor</td></tr>
              </tbody>
            </table>
          </div>
        </section>
'''

# ---------------------------------------------------------------------------
# GREGO KOINÉ (Apêndice C.3)
# ---------------------------------------------------------------------------
grk_main = r'''
        <p class="small" style="letter-spacing:.08em;text-transform:uppercase;color:var(--osa-gold-ink);font-weight:700">Destino 3 de 4</p>
        <div class="osa-page-heading">
          <svg class="osa-page-heading__icon osa-page-heading__icon--wide" viewBox="0 0 300 120" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M22 60 C 78 20, 168 20, 208 60"/><path d="M22 60 C 78 100, 168 100, 208 60"/><path d="M208 60 L 282 22"/><path d="M208 60 L 282 98"/><text x="115" y="77" text-anchor="middle" font-size="42" font-weight="700" font-family="'Noto Serif','Times New Roman',serif" fill="currentColor" stroke="none" textLength="118" lengthAdjust="spacingAndGlyphs">ΙΧΘΥΣ</text></svg>
          <h1 id="grk-h1">Grego Koiné</h1>
        </div>
        <p class="lead">Do alfabeto à sintaxe exegética: um caminho integrado em cinco níveis com <strong>Rega/Mounce</strong> para morfologia e <strong>Wallace</strong> para sintaxe — mais métodos, gráficos, recursos e prompts.</p>

        <div class="osa-scripture-banner" aria-label="Abertura em grego e hebraico">
          <span class="grc" lang="grc">Ἐν ἀρχῇ ἦν ὁ λόγος</span>
          <span class="sep" aria-hidden="true">|</span>
          <span class="he" lang="he" dir="rtl">בְּרֵאשִׁית בָּרֵא אֱלֹהִים</span>
        </div>

        

        <nav class="osa-toc" id="toc" aria-labelledby="toc-title">
          <h2 id="toc-title">Nesta página</h2>
          <ol></ol>
        </nav>

        <section class="prose-section" id="grk-intro" aria-labelledby="grk-h0">
          <h2 id="grk-h0">Introdução e propósito</h2>
          <p>Estudar o grego do Novo Testamento (koiné) é ganhar acesso direto a casos, aspecto e partículas que as traduções resumem. Este destino espelha a estrutura do hebraico: <strong>visão geral → 25 métodos → análise → ranking → gráficos → recursos → método vencedor → currículo → Anki → IA → dores</strong>.</p>
        </section>

        <section class="prose-section" id="grk-visao" aria-labelledby="grk-h1v">
          <h2 id="grk-h1v">1. Visão geral e estatísticas</h2>
          <div class="osa-table-scroll" role="region" tabindex="0" aria-label="Tabela de características do grego koiné">
            <table class="osa-table">
              <caption>Características estruturais do grego koiné (fatos de língua)</caption>
              <thead><tr><th scope="col">Aspecto</th><th scope="col">Descrição</th></tr></thead>
              <tbody>
                <tr><th scope="row">Alfabeto</th><td>24 letras gregas; minúsculas e maiúsculas no manuscrito e nas edições modernas</td></tr>
                <tr><th scope="row">Sistema de casos</th><td>5 casos nominativos, genitivo, dativo, acusativo, vocativo — com funções múltiplas</td></tr>
                <tr><th scope="row">Voz verbal</th><td>Três vozes (ativo, médio, passivo) com padrões de conjugação e nuances de sentido</td></tr>
                <tr><th scope="row">Aspecto</th><td>Sistema verbal por aspecto/perfeito (presente, imperfeito, aoristo, perfeito…) mais tempo morfológico</td></tr>
                <tr><th scope="row">Artigo</th><td>Artigo definido πρόπεριο/τή/τό concordando em caso, número e gênero — chave sintática</td></tr>
                <tr><th scope="row">Direção</th><td>Esquerda-para-direita; acentos polidrônicos preservados (οξεία, βαρεία, περισπωμένη) em citações</td></tr>
                <tr><th scope="row">Estimativa editorial de esforço</th><td>≈ 56 semanas de rotina diária até leitura de períodos com Wallace à mão — <strong>não é estatística oficial</strong></td></tr>
              </tbody>
            </table>
          </div>
          <p class="editorial-note">Fatos linguísticos + estimativa editorial do portal (setembro de 2026). Sem números de “falantes”, “taxas de sucesso” ou métricas fabricadas.</p>
        </section>

        <section class="prose-section" id="grk-metodos" aria-labelledby="grk-h2m">
          <h2 id="grk-h2m">2. Métodos de aprendizado (25 métodos analisados)</h2>
          <p>Mesmo conjunto de 25 métodos reais, com aplicação adaptada ao grego koiné. Eficiência/complexidade/tempo = <strong>estimativas editoriais de setembro de 2026</strong>.
          <p class="small muted">Explore pelos cartões (com barras comparativas) ou abra a tabela completa no fim da seção. Busca, filtros e ordenação agem sobre os 25 métodos e o resumo abaixo é recalculado sobre o que estiver visível.</p>
          <div id="grk-methods-table"></div>
        </section>

        <section class="prose-section" id="grk-analise" aria-labelledby="grk-h3a">
          <h2 id="grk-h3a">3. Análise didática detalhada</h2>
          <details class="osa-accordion" open>
            <summary class="osa-accordion__summary">Centradas no professor</summary>
            <div class="osa-accordion__content"><p><strong>Gramática–Tradução, Direto, Áudio-Lingual, Suggestopedia</strong> entregam paradigmas limpos e correção imediata — ideais para declinações e vozes verbais no início, insuficientes sozinhas para sintaxe exegética. Combine com leitura contínua de períodos paulinos.</p></div>
          </details>
          <details class="osa-accordion">
            <summary class="osa-accordion__summary">Centradas no aluno</summary>
            <div class="osa-accordion__content"><p><strong>Anki, Coaching, Descoberta indutiva, Tradução inversa, TPR adaptado</strong> funcionam bem para autodidatas. Risco: “morte das categorias” sem prática de análise — antidoto é o ciclo traduzir → parsing → Wallace → nota.</p></div>
          </details>
          <details class="osa-accordion">
            <summary class="osa-accordion__summary">Centradas no texto</summary>
            <div class="osa-accordion__content"><p><strong>Leitura direta/extensiva/estreita, Entrada compreensível, Ensino por conteúdo</strong>: leia uma epístola inteira antes de trocar de autor; use o interlinear só ao travar. O texto é o currículo.</p></div>
          </details>
        </section>

        <section class="prose-section" id="grk-ranking" aria-labelledby="grk-h4r">
          <h2 id="grk-h4r">4. Ranking de eficácia</h2>
          <div id="grk-ranking-list" aria-live="polite"></div>
        </section>

        <section class="prose-section" id="grk-graficos" aria-labelledby="grk-h5g">
          <h2 id="grk-h5g">5. Gráficos comparativos</h2>
          <p>Cinco leituras visuais: dispersão, radar (top 4), barras de tempo, comparação híbrido×tradicional e a síntese no infográfico — tudo derivado da tabela de 25 métodos, com resumo + tabela de dados.</p>
          <div id="charts-host"></div>
        </section>

        <section class="prose-section" id="grk-infografico" aria-labelledby="grk-h51">
          <h2 id="grk-h51">5.1 Infográfico do plano</h2>
          <figure class="osa-figure">
            <img src="./downloads/mapa-aceleracao-grego.svg" alt="Infográfico do currículo de grego koiné em cinco níveis — Fundação, Básico, Intermediário, Avançado e Fluência — com os marcos de cada nível e o fluxo Rega/Mounce, parsing, Wallace e nota exegética." width="960" height="540" loading="lazy" decoding="async">
            <figcaption>Cronologia <strong>estimativa editorial de setembro de 2026</strong> — referenciais de estudo, não calendário oficial de editoras.</figcaption>
          </figure>
        </section>

        <section class="prose-section" id="grk-recursos" aria-labelledby="grk-h6">
          <h2 id="grk-h6">6. Recursos gratuitos</h2>
          <ul>
            <li><a href="https://sofiaapp.com/" target="_blank" rel="noopener noreferrer external">Sofia App</a> — técnica, limpa, sem anúncios; Strong, GK, Louw-Nida.</li>
            <li><a href="https://stepbible.org/" target="_blank" rel="noopener noreferrer external">Step Bible</a> — interlinear e dicionários.</li>
            <li><a href="https://dailydoseofgreek.com/" target="_blank" rel="noopener noreferrer external">Daily Dose of Greek</a> — vídeo diário de tradução.</li>
            <li><a href="https://globalbibletools.com/" target="_blank" rel="noopener noreferrer external">Global Bible Tools</a> — grátis, offline, sem anúncios.</li>
            <li><a href="https://sefaria.org/" target="_blank" rel="noopener noreferrer external">Sefaria</a> — Septuaginta e textos com paralelos.</li>
            <li><a href="https://www.academic-bible.com/en/online-bibles/septuagint" target="_blank" rel="noopener noreferrer external">Septuaginta (LXX) online</a> — Rahlfs (catálogo).</li>
            <li>Bible Hub Interlinear — consultas rápidas.</li>
          </ul>
        </section>

        <section class="prose-section" id="grk-pagos" aria-labelledby="grk-h7">
          <h2 id="grk-h7">7. Recursos pagos por faixa</h2>
          <div class="osa-table-scroll" role="region" tabindex="0" aria-label="Faixas de preço de recursos pagos grego">
            <table class="osa-table">
              <caption>Grego — faixa editorial de investimento (sem preços fixos)</caption>
              <thead><tr><th scope="col">Faixa</th><th scope="col">Recursos</th><th scope="col">Observação</th></tr></thead>
              <tbody>
                <tr><th scope="row">Baixo</th><td><em>Noções do Grego Bíblico</em> (Rega) · <em>Gramática do NT Grego</em> (Mounce)</td><td>Livros didáticos de base (nível médio-baixo de investimento em livro)</td></tr>
                <tr><th scope="row">Médio</th><td>NA28 (edição crítica impressa)</td><td>Quando a crítica textual entrar no horizonte</td></tr>
                <tr><th scope="row">Alto</th><td><em>Gramática Grega: Sintaxe Exegética</em> (Wallace) · BDAG</td><td>Referências avançadas</td></tr>
                <tr><th scope="row">Muito alto</th><td>Logos Bible Software · Accordance</td><td>Plataformas + bibliotecas</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="prose-section" id="grk-vencedor" aria-labelledby="grk-h9">
          <h2 id="grk-h9">9. Método vencedor: integração Rega + Wallace</h2>
          <h3>Mounce/Rega versus Wallace (a diferença)</h3>
          <p><strong>Rega/Mounce</strong> respondem “<em>O que é</em> esta forma?” (morfologia nominal e verbal, semanas 1–20). <strong>Wallace</strong> responde “<em>Por que importa teologicamente</em> esta construção?” (sintaxe exegética, semana 21+).</p>
          <h3>Fluxo de trabalho passo a passo</h3>
          <ol>
            <li><strong>Traduzir</strong> o período com Rega/Mounce abertos (significado primeiro);</li>
            <li><strong>Parsing completo</strong> das formas — casos, artigo, pessoa/tempo/aspecto;</li>
            <li><strong>Consultar Wallace</strong> na seção do fenômeno (caso, artigo, verbo);</li>
            <li><strong>Nota exegética</strong> de 3–5 linhas: o que a sintaxe sustenta / o que fica em aberto.</li>
          </ol>
          <p>Repita o ciclo semanalmente em uma perícope; em 8 semanas você terá um caderno sintático próprio.</p>
        </section>

        <section class="prose-section" id="grk-curriculo" aria-labelledby="grk-h10">
          <h2 id="grk-h10">10. Currículo em cinco níveis</h2>

          <article class="osa-level" id="grk-nivel-1">
            <span class="osa-level__badge">Nível 1 · Semanas 1–8</span>
            <h3 class="osa-level__titulo">Fundação</h3>
            <p><strong>Objetivos:</strong> alfabeto grego (maiúsculas/minúsculas), pronúncia, acentuação básica, leitura de frases simples.</p>
            <p><strong>Materiais gratuitos:</strong> Sofia App, Step Bible, séries de vídeo de alfabeto, Anki do alfabeto.</p>
            <p><strong>Checkpoint:</strong> ler <bdi lang="grc">Ἐν ἀρχῇ ἦν ὁ λόγος</bdi> (Jo 1:1) em voz alta com pronúncia estável.</p>
          </article>

          <article class="osa-level" id="grk-nivel-2">
            <span class="osa-level__badge">Nível 2 · Semanas 9–20</span>
            <h3 class="osa-level__titulo">Básico</h3>
            <p><strong>Objetivos:</strong> morfologia nominal (declinações, artigo), primitivos verbais, vocabulário de alta frequência do NT — <strong>com Rega/Mounce</strong>.</p>
            <p><strong>Materiais:</strong> Rega (ou Mounce em português), Daily Dose of Greek (acompanhamento), Anki de paradigmas.</p>
            <p><strong>Checkpoint:</strong> declinar artigo e substantivo nos 5 casos; conjugar verbo em presente ativo indicativo; traduzir Jo 1:1–9 com dicionário.</p>
          </article>

          <article class="osa-level" id="grk-nivel-3">
            <span class="osa-level__badge">Nível 3 · Semanas 21–36</span>
            <h3 class="osa-level__titulo">Intermediário</h3>
            <p><strong>Objetivos:</strong> verbo εἰμί, sistema de aspecto/tempo, partículas δέ/γάρ/οὖν, períodos de Paulo com consulta inicial a <strong>Wallace</strong>.</p>
            <p><strong>Estratégias:</strong> ciclo traduzir → parsing → Wallace → nota; leitura estreita de uma epístola.</p>
            <p><strong>Checkpoint:</strong> traduzir Filipenses 1 com apoio e produzir 2 notas exegéticas.</p>
          </article>

          <article class="osa-level" id="grk-nivel-4">
            <span class="osa-level__badge">Nível 4 · Semanas 37–56</span>
            <h3 class="osa-level__titulo">Avançado</h3>
            <p><strong>Objetivos:</strong> partículas avançadas, artigo nominal, casos em uso raro, construção passiva/média; sincronia com septuaginta quando útil.</p>
            <p><strong>Materiais:</strong> Wallace completo, BDAG, NA28 (se disponível), LXX online.</p>
            <p><strong>Checkpoint:</strong> análise sintática completa de um capítulo com aparato de referência.</p>
          </article>

          <article class="osa-level" id="grk-nivel-5">
            <span class="osa-level__badge">Nível 5 · Manutenção</span>
            <h3 class="osa-level__titulo">Fluência</h3>
            <p><strong>Objetivos:</strong> leitura semanal de texto grego, revisão enxuta de Anki, co-mentoria exegética quinzenal.</p>
            <p><strong>Rotina semanal sugerida (estimativa editorial de setembro de 2026):</strong> seg–sex: 25 min leitura + 15 min Anki; sáb: 45 min de ciclo Wallace; dom: descanso ou leitura leve.</p>
          </article>

          <div class="osa-table-scroll" role="region" tabindex="0" aria-label="Exemplo de cronograma semanal">
            <table class="osa-table">
              <caption>Cronograma semanal de exemplo (estimativa editorial de setembro de 2026 — adapte à sua rotina)</caption>
              <thead><tr><th scope="col">Dia</th><th scope="col">Bloco A (20–25 min)</th><th scope="col">Bloco B (15–20 min)</th></tr></thead>
              <tbody>
                <tr><th scope="row">Seg</th><td>Leitura de período novo</td><td>Anki (declinações)</td></tr>
                <tr><th scope="row">Ter</th><td>Parsing cronometrado</td><td>Wallace — seção do caso</td></tr>
                <tr><th scope="row">Qua</th><td>Leitura extensiva fácil</td><td>Anki (vocabulário)</td></tr>
                <tr><th scope="row">Qui</th><td>Período difícil + interlinear</td><td>Nota exegética</td></tr>
                <tr><th scope="row">Sex</th><td>Releitura sem dicionário</td><td>Anki (mistura)</td></tr>
                <tr><th scope="row">Sáb</th><td>Ciclo completo Rega→Wallace</td><td>Revisão do caderno</td></tr>
                <tr><th scope="row">Dom</th><td>Descanso ou vídeo leve</td><td>—</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="prose-section" id="grk-anki" aria-labelledby="grk-h12">
          <h2 id="grk-h12">12. Anki prático para o grego</h2>
          <ol>
            <li><strong>Baralho:</strong> “Grego OSA” → Alfabeto · Declinações · Artigo · Primitivos · Partículas · Parsing de textos.</li>
            <li><strong>Carta de parsing:</strong> frente = forma no versículo; verso = lema + parsing completo + glosa.</li>
            <li><strong>Carta de caso:</strong> frase com caso alvo → “qual função este caso desempenha aqui?” (resposta com Wallace como referência).</li>
            <li><strong>Novas cartas:</strong> 15–20/dia no início; não misture vocabulário e paradigmas no mesmo dia se atrapalhar a retenção.</li>
            <li><strong>Imagens?</strong> Opcional para mnemônicas; o essencial é texto grego real nas duas faces.</li>
          </ol>
        </section>

        <section class="prose-section" id="grk-ia" aria-labelledby="grk-h13">
          <h2 id="grk-h13">13. Prompts de IA (copiáveis)</h2>
          <div class="osa-callout osa-callout--warn"><p style="margin:0">A IA pratica com você; não substitui leitura, léxico nem mentoria. Não use respostas de IA como citação acadêmica.</p></div>

          <div class="osa-prompt">
            <strong>1. Tutor pessoal de grego koiné</strong>
            <pre id="prompt-grk-1">Você é um tutor pessoal de grego koiné para um estudante brasileiro. Responda em português, mantenha o grego em caracteres originais com acentos, sinalize incertezas e nunca invente lemmas. Estruture cada resposta: (1) forma/letra em foco, (2) explicação curta, (3) exemplo do Novo Testamento, (4) 1 exercício para eu responder.</pre>
            <button class="osa-btn osa-btn--outline osa-btn--sm" type="button" data-copy-target="#prompt-grk-1">Copiar prompt</button>
          </div>
          <div class="osa-prompt">
            <strong>2. Analista de sintaxe e casos gregos (Daniel Wallace)</strong>
            <pre id="prompt-grk-2">Atue como analista de sintaxe grega no espírito de D. B. Wallace (sem copiar texto literal de livros com direitos). Dado um período que eu colar: identifique casos, artigo, relativas e escolhas verbais; para cada item, (a) descreva a construção, (b) liste 2 leituras possíveis, (c) indique a seção CONCEITUAL de sintaxe que eu deveria reler, (d) diga o que precisa de confirmação humana. Não conclua dogmaticamente.</pre>
            <button class="osa-btn osa-btn--outline osa-btn--sm" type="button" data-copy-target="#prompt-grk-2">Copiar prompt</button>
          </div>
        </section>

        <section class="prose-section" id="grk-checklist" aria-labelledby="grk-h14">
          <h2 id="grk-h14">14. Dores comuns e checklist</h2>
          <div class="osa-table-scroll" role="region" tabindex="0" aria-label="Dores comunes no aprendizado do grego">
            <table class="osa-table">
              <caption>Dores do estudante e antídoto</caption>
              <thead><tr><th scope="col">Dor</th><th scope="col">Antídoto</th></tr></thead>
              <tbody>
                <tr><th scope="row">“Morte das categorias” (esqueci casos e vozes)</th><td>Drill cronometrado + cartas Anki de paradigma; sintaxe Wallace como aplicação viva das categorias</td></tr>
                <tr><th scope="row">“Paradigmas que nunca saem da memória”</th><td>Repetição espaçada com frases reais, não listas soltas</td></tr>
                <tr><th scope="row">“Traduzo palavra a palavra e perco o período”</th><td>Leitura da frase inteira primeiro; interlinear só depois; markup de partículas</td></tr>
                <tr><th scope="row">“Wallace é denso demais”</th><td>Consultar sob demanda a partir do texto; nunca ler de capa a capa no início</td></tr>
                <tr><th scope="row">“Grego do NT e LXX parecem mundos diferentes”</th><td>Boa base comum; introduzir LXX no nível 4 como leitura comparada (MT × LXX)</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Checklist diária</h3>
          <ul class="osa-checklist" data-checklist="grego">
            <li><label><input type="checkbox" data-check="anki"> Revisar Anki</label></li>
            <li><label><input type="checkbox" data-check="periodo"> Ler 1 período + parsing</label></li>
            <li><label><input type="checkbox" data-check="wallace"> Consultar Wallace no fenômeno do dia</label></li>
            <li><label><input type="checkbox" data-check="nota"> Escrever nota exegética curta</label></li>
            <li><label><input type="checkbox" data-check="voz"> Ler o texto em voz alta</label></li>
          </ul>
        </section>
'''

# ---------------------------------------------------------------------------
# CAIXA DE FERRAMENTAS
# ---------------------------------------------------------------------------
tools_main = r'''
        <p class="small" style="letter-spacing:.08em;text-transform:uppercase;color:var(--osa-gold-ink);font-weight:700">Destino 4 de 4</p>
        <div class="osa-page-heading">
          <svg class="osa-page-heading__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5z"/><path d="M15 4.5 19.5 9"/><path d="M18 3l3 3"/></svg>
          <h1 id="cat-h1">Caixa de Ferramentas Bíblicas</h1>
        </div>
        <p class="lead">Catálogo pesquisável com <strong>20 recursos canônicos</strong> + os que você adicionar. Tudo fica <strong>apenas neste dispositivo</strong> — sem contas, sem nuvem, sem sincronização.</p>

        <nav class="osa-toc" id="toc" aria-labelledby="toc-title">
          <h2 id="toc-title">Nesta página</h2>
          <ol></ol>
        </nav>

        <div class="osa-callout" role="note">
          <p style="margin:0"><strong>Privacidade:</strong> favoritos, recursos criados por você, preferências e posição de leitura usam o <em>localStorage</em> deste navegador. Limpar dados do site apaga a coleção — exporte em JSON de vez em quando.</p>
        </div>

        <section class="prose-section" id="cat-busca" aria-labelledby="cat-h-busca">
          <h2 id="cat-h-busca">Busca e filtros</h2>

          <div class="osa-filters" role="search" aria-label="Filtros do catálogo">
            <div class="osa-field">
              <label for="filter-q">Buscar recursos</label>
              <input class="osa-input" type="search" id="filter-q" placeholder="Título, autor ou descrição (sem diferenciar acentos)" autocomplete="off">
              <span class="osa-hint">Ex.: “lexico”, “rega”, “interlinear” — a busca ignora acentos e caixa.</span>
            </div>

            <div class="osa-external-search" role="group" aria-label="Buscar o termo digitado fora do site">
              <p class="osa-external-search__label">
                Buscar <strong data-external-term>o termo do campo acima</strong> fora do site
                <span class="small muted">— abre em nova aba, sem sair do catálogo</span>
              </p>
              <div class="osa-external-search__row">
                <a class="osa-btn osa-btn--outline osa-btn--sm" href="https://www.google.com/search?q=" target="_blank" rel="noopener noreferrer external" data-external-search="google" aria-label="Buscar o termo no Google em nova aba">Google ↗</a>
                <a class="osa-btn osa-btn--outline osa-btn--sm" href="https://www.bing.com/search?q=" target="_blank" rel="noopener noreferrer external" data-external-search="bing" aria-label="Buscar o termo no Bing em nova aba">Bing ↗</a>
                <a class="osa-btn osa-btn--outline osa-btn--sm" href="https://duckduckgo.com/?q=" target="_blank" rel="noopener noreferrer external" data-external-search="duckduckgo" aria-label="Buscar o termo no DuckDuckGo em nova aba">DuckDuckGo ↗</a>
                <a class="osa-btn osa-btn--outline osa-btn--sm" href="https://scholar.google.com/scholar?q=" target="_blank" rel="noopener noreferrer external" data-external-search="scholar" aria-label="Buscar o termo no Google Acadêmico em nova aba">Google Acadêmico ↗</a>
              </div>
              <p class="osa-hint" data-external-hint>Digite um termo em “Buscar recursos” para habilitar a busca externa.</p>
              <p class="osa-hint" data-external-ready hidden>Consulta pronta: os botões usam exatamente o termo digitado. Nenhuma busca é executada por este site.</p>
            </div>

            <div class="osa-field">
              <span class="osa-label" id="chips-label">Categorias</span>
              <div class="osa-chips" id="filter-chips" role="group" aria-labelledby="chips-label"></div>
            </div>

            <div class="osa-filters__row">
              <div class="osa-field" style="margin-bottom:0">
                <label for="filter-idioma">Idioma</label>
                <select class="osa-select" id="filter-idioma">
                  <option value="">Todos os idiomas</option>
                  <option value="hebraico">Hebraico</option>
                  <option value="aramaico">Aramaico</option>
                  <option value="grego">Grego</option>
                  <option value="todos">Todos / multilíngue</option>
                </select>
              </div>
              <div class="osa-field" style="margin-bottom:0">
                <label for="filter-nivel">Nível</label>
                <select class="osa-select" id="filter-nivel">
                  <option value="">Todos os níveis</option>
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                  <option value="todos">Todos os níveis</option>
                </select>
              </div>
            </div>

            <div class="osa-switch-row" style="margin-top:.75rem">
              <label class="osa-check" for="filter-fav" style="margin:0">
                <input type="checkbox" id="filter-fav">
                <span>Somente favoritos</span>
              </label>
              <button class="osa-btn osa-btn--outline osa-btn--sm" type="button" data-clear-filters>Limpar filtros</button>
            </div>
          </div>

          <div class="row" style="margin-bottom:.75rem" role="tablist" aria-label="Catálogo ou coleção">
            <button class="osa-chip is-active" type="button" role="tab" aria-selected="true" data-catalog-tab="catalogo">Catálogo completo</button>
            <button class="osa-chip" type="button" role="tab" aria-selected="false" data-catalog-tab="colecao">Minha coleção</button>
          </div>

          <p class="osa-result-count" id="result-count" role="status" aria-live="polite">Carregando…</p>

          <div id="panel-catalogo">
            <div id="resource-results"></div>
          </div>
          <div id="panel-colecao" hidden>
            <p class="small" id="colecao-count"></p>
            <p class="editorial-note"><strong>Minha coleção</strong> reúne favoritos + recursos que você criou. Os dados são <strong>locais deste dispositivo/navegador</strong> e não sincronizam entre aparelhos.</p>
            <div id="colecao-list"></div>
          </div>

          <p id="pdf-note" class="osa-callout osa-callout--gold" hidden>
            <strong>Exportação PDF:</strong> este site estático não embute um motor de renderização de PDF com shaping confiável de hebraico/grego. Usamos a <strong>folha de impressão</strong> do navegador — no diálogo, escolha “Salvar como PDF”. É um fallback transparente, não um PDF gerado em servidor.
          </p>
        </section>

        <section class="prose-section" id="cat-adicionar" aria-labelledby="cat-h-add">
          <h2 id="cat-h-add">Adicionar recurso à coleção</h2>
          <p>Crie fichas próprias (estudos, blogs, decks). O link aceita apenas <code>http://</code> e <code>https://</code>.</p>
          <button class="osa-btn osa-btn--primary" type="button" data-add-resource>+ Adicionar recurso</button>
        </section>

        <section class="prose-section" id="cat-import" aria-labelledby="cat-h-imp">
          <h2 id="cat-h-imp">Importar / exportar</h2>
          <div class="osa-grid osa-grid--2">
            <div class="osa-card">
              <h3 style="margin-top:0;font-size:1.05rem">Exportar JSON</h3>
              <p class="small">Arquivo versionado (<code>osa-colecao</code>, schema v1) com favoritos + recursos do usuário. Use para backup ou transferir entre navegadores no mesmo aparelho.</p>
              <button class="osa-btn osa-btn--outline" type="button" data-export-json>Exportar coleção (.json)</button>
            </div>
            <div class="osa-card">
              <h3 style="margin-top:0;font-size:1.05rem">Importar JSON</h3>
              <p class="osa-field">
                <label for="import-file">Arquivo de coleção</label>
                <input class="osa-input" type="file" id="import-file" accept="application/json,.json">
                <span class="osa-hint">Limite 512 KB · validação de schema · protocolos http/https</span>
              </p>
              <p class="osa-field">
                <label for="import-policy">Política de duplicatas</label>
                <select class="osa-select" id="import-policy">
                  <option value="keep-existing" selected>Manter existente (padrão)</option>
                  <option value="replace">Substituir pelo importado</option>
                </select>
              </p>
              <p class="small muted">JSON corrompido ou inválido não altera nada — você recebe erro e mantém a coleção atual.</p>
            </div>
          </div>
          <div class="osa-download-item" style="margin-top:1rem">
            <div><strong>Exportar / imprimir seleção em PDF</strong><br><span class="small osa-unavailable">Fallback: impressão do navegador (ver aviso acima).</span></div>
            <button class="osa-btn osa-btn--outline osa-btn--sm" type="button" data-export-pdf>Imprimir / Salvar PDF</button>
          </div>
        </section>

        <section class="prose-section" id="cat-externa" aria-labelledby="cat-h-ext">
          <h2 id="cat-h-ext">Descoberta externa</h2>
          <div class="osa-callout osa-callout--warn">
            <p style="margin:0">Os botões abaixo <strong>somente ABREM páginas de busca externas em nova aba</strong> (Google, Bing, DuckDuckGo, Google Acadêmico e STEP Bible). Este site <strong>não</strong> faz mineração web autônoma, <strong>não</strong> chama APIs de busca e <strong>não</strong> contém chaves de API no código do cliente.</p>
          </div>
          <p style="margin-top:1rem">Termo atual: <strong data-external-term>o termo do campo acima</strong></p>
          <div class="osa-field" style="max-width:32rem">
            <label for="external-q">Termo para a busca externa</label>
            <input class="osa-input" type="search" id="external-q" placeholder="Digite aqui ou use o campo “Buscar recursos”" autocomplete="off">
            <span class="osa-hint">Este campo acompanha o de cima: o que você digitar em qualquer um dos dois vale para os dois.</span>
          </div>
          <div class="row" style="margin-top:.75rem">
            <a class="osa-btn osa-btn--outline" href="https://www.google.com/search?q=" target="_blank" rel="noopener noreferrer external" data-external-search="google" aria-label="Buscar o termo no Google em nova aba">Abrir busca no Google ↗</a>
            <a class="osa-btn osa-btn--outline" href="https://www.bing.com/search?q=" target="_blank" rel="noopener noreferrer external" data-external-search="bing" aria-label="Buscar o termo no Bing em nova aba">Abrir busca no Bing ↗</a>
            <a class="osa-btn osa-btn--outline" href="https://duckduckgo.com/?q=" target="_blank" rel="noopener noreferrer external" data-external-search="duckduckgo" aria-label="Buscar o termo no DuckDuckGo em nova aba">Abrir busca no DuckDuckGo ↗</a>
            <a class="osa-btn osa-btn--outline" href="https://scholar.google.com/scholar?q=" target="_blank" rel="noopener noreferrer external" data-external-search="scholar" aria-label="Buscar o termo no Google Acadêmico em nova aba">Abrir busca no Google Acadêmico ↗</a>
            <a class="osa-btn osa-btn--outline" href="https://stepbible.org/?q=" target="_blank" rel="noopener noreferrer external" data-external-search="stepbible" aria-label="Buscar o termo no STEP Bible em nova aba">Abrir STEP Bible ↗</a>
          </div>
          <p class="osa-hint" data-external-hint>Digite um termo para habilitar os botões.</p>
        </section>

        <!-- Diálogo: formulário de recurso -->
        <dialog class="osa-dialog" id="dialog-recurso" aria-labelledby="recurso-dialog-title">
          <div class="osa-dialog__body">
            <h2 id="recurso-dialog-title" style="margin-top:0">Adicionar recurso</h2>
            <p id="recurso-form-errors" class="osa-error" role="alert" tabindex="-1"></p>
            <form id="form-recurso" novalidate>
              <div class="osa-field">
                <label for="f-title">Título *</label>
                <input class="osa-input" id="f-title" name="title" required minlength="2" maxlength="120">
              </div>
              <div class="osa-field">
                <label for="f-author">Autor / origem</label>
                <input class="osa-input" id="f-author" name="author" maxlength="120">
              </div>
              <div class="osa-filters__row">
                <div class="osa-field">
                  <label for="f-category">Categoria</label>
                  <select class="osa-select" id="f-category" name="category">
                    <option value="gramatica">Gramática</option>
                    <option value="lexico">Léxico</option>
                    <option value="manuscritologia">Manuscritologia</option>
                    <option value="critica-textual">Crítica Textual</option>
                    <option value="exegese">Exegese</option>
                    <option value="software">Software</option>
                    <option value="app">Aplicativo</option>
                    <option value="midia">Mídia</option>
                    <option value="mapas">Mapas</option>
                    <option value="texto-biblico">Texto Bíblico</option>
                  </select>
                </div>
                <div class="osa-field">
                  <label for="f-language">Idioma</label>
                  <select class="osa-select" id="f-language" name="language">
                    <option value="hebraico">Hebraico</option>
                    <option value="aramaico">Aramaico</option>
                    <option value="grego" selected>Grego</option>
                    <option value="todos">Todos</option>
                  </select>
                </div>
              </div>
              <div class="osa-filters__row">
                <div class="osa-field">
                  <label for="f-level">Nível</label>
                  <select class="osa-select" id="f-level" name="level">
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                    <option value="todos" selected>Todos</option>
                  </select>
                </div>
                <div class="osa-field">
                  <label for="f-type">Tipo</label>
                  <input class="osa-input" id="f-type" name="type" placeholder="Livro, Web App…" maxlength="40">
                </div>
              </div>
              <div class="osa-field">
                <label for="f-link">Link (http/https apenas)</label>
                <input class="osa-input" id="f-link" name="link" type="url" inputmode="url" placeholder="https://…" maxlength="300">
              </div>
              <div class="osa-field">
                <label for="f-description">Descrição * (mín. 10 caracteres)</label>
                <textarea class="osa-textarea" id="f-description" name="description" required minlength="10" maxlength="800"></textarea>
              </div>
              <label class="osa-check" for="f-free">
                <input type="checkbox" id="f-free" name="free">
                <span>Recurso gratuito</span>
              </label>
            </form>
          </div>
          <div class="osa-dialog__actions">
            <button class="osa-btn osa-btn--primary" type="submit" form="form-recurso">Salvar recurso</button>
            <button class="osa-btn osa-btn--outline" type="button" id="recurso-cancel">Cancelar</button>
          </div>
        </dialog>

        <!-- Diálogo: confirmação de exclusão -->
        <dialog class="osa-dialog" id="dialog-confirmar" aria-labelledby="confirmar-title" style="max-width:min(420px,calc(100vw - 24px))">
          <div class="osa-dialog__body">
            <h2 id="confirmar-title" style="margin-top:0;font-size:1.2rem">Confirmar exclusão</h2>
            <p id="confirmar-msg" class="small"></p>
          </div>
          <div class="osa-dialog__actions">
            <button class="osa-btn osa-btn--danger" type="button" id="confirmar-ok">Excluir</button>
            <button class="osa-btn osa-btn--outline" type="button" id="confirmar-cancel">Cancelar</button>
          </div>
        </dialog>
'''

# ---------------------------------------------------------------------------
pages = [
    ('hebraico-aramaico.html', heb_main,
     'hebraico-aramaico.html',
     'Hebraico e Aramaico — O Sentido Autêntico',
     'Currículo de 5 níveis de hebraico bíblico e aramaico bíblico, 25 métodos analisados, gráficos, Anki e prompts de IA em pt-BR.'),
    ('grego-koine.html', grk_main,
     'grego-koine.html',
     'Grego Koiné — O Sentido Autêntico',
     'Estudo de grego koiné em 5 níveis: Rega e Mounce para morfologia, Wallace para sintaxe, métodos, gráficos e recursos em pt-BR.'),
    ('caixa-de-ferramentas.html', tools_main,
     'caixa-de-ferramentas.html',
     'Caixa de Ferramentas Bíblicas — O Sentido Autêntico',
     'Catálogo pesquisável de 20 recursos de línguas bíblicas com filtros, favoritos, coleção pessoal, importação/exportação JSON e descoberta externa.'),
]

for filename, main, nav, title, desc in pages:
    page_ids = {
        'hebraico-aramaico.html': 'hebraico',
        'grego-koine.html': 'grego',
        'caixa-de-ferramentas.html': 'ferramentas',
    }
    html = chrome(page_id=page_ids[filename], lang_nav_file=nav,
                  title=title, description=desc, main_html=main)
    (ROOT / filename).write_text(html, encoding='utf-8')
    print('wrote', filename, len(html), 'bytes')
