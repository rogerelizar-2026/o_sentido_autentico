# O Sentido Autêntico v.1.0
## "Tecnologia e profundidade histórica para conectar você ao 'sopro' original de Deus."
### Curadoria Acadêmica  por **Rogério Ramão Lopes** (`rogerelizar@gmail.com`)
*Desenvolvido em Setembro de 2026*

---

## 📖 Sobre o Projeto

O **O Sentido Autêntico** é uma plataforma educacional e um ecossistema digital de código aberto (*open-source*) projetado especificamente para guiar estudantes de teologia, pastores e autodidatas brasileiros no aprendizado profundo do **Hebraico Bíblico, Aramaico e Grego Koiné**. 

O projeto preenche a lacuna clássica entre a memorização morfológica mecânica e a verdadeira exegese teológica. Integrando o que há de melhor nas gramáticas de referência nacional e internacional (como **Allen Ross** para o Hebraico, **Lourenço Stelio Rega e William Mounce** para a morfologia de Grego, e **Daniel B. Wallace** para a sintaxe exegética do Novo Testamento), a plataforma propõe um **caminho de aprendizado econômico (R$ 0,00)** impulsionado pela consistência diária e potencializado pelo uso inteligente de inteligência artificial.

---

## 🎨 Principais Recursos & Engenharia de UX/UI

O portal foi desenvolvido utilizando padrões modernos de desenvolvimento web e focado em uma experiência móvel fluida (*mobile-first*):

*   **Navegação Lateral Inteligente (Desktop & Mobile):** Uma sidebar estilizada com ocultação automática após 4 segundos de inatividade e botão flutuante dourado (**FAB**) para reabertura, otimizando 100% da largura útil da tela para a leitura focada dos textos.
*   **Acessibilidade Universal Integrada (A11y Panel):**
    *   *Leitor de Voz (Text-to-Speech):* Síntese de fala integrada que lê em voz alta a introdução acadêmica do portal diretamente pelo navegador.
    *   *Fonte Amigável para Dislexia:* Alternador dinâmico de fonte que melhora o espaçamento de caracteres e linhas, reduzindo a fadiga visual.
    *   *Alto Contraste:* Controles de contraste absoluto para pessoas com baixa visão ou daltonismo.
    *   *Ajuste Dinâmico de Fontes:* Botões dedicados para aumentar, diminuir ou restaurar a escala tipográfica de todo o conteúdo útil.
*   **Player de Áudio Premium:** Um reprodutor de áudio customizado integrado para a escuta da palestra-curadoria *Línguas Bíblicas e Tecnologia* (22m24s), com barra de progresso responsiva, controle de volume fino e animação pulsante circular em ouro no ícone do microfone durante a reprodução.
*   **Transformação de Tabelas Responsivas:** Engenharia CSS que transforma tabelas densas em cartões verticais independentes em telas de celulares, mantendo as capas dos livros grandes, centralizadas e com as descrições fluindo confortavelmente logo abaixo da imagem, eliminando o incômodo zoom horizontal.
*   **Disclaimer e Termo de Consentimento:** Um modal de abertura de duas colunas (Welcome Modal) com o manifesto teológico do projeto, assinatura de curadoria, isenções de responsabilidade acadêmica e um checkbox interativo que habilita o botão de entrada somente após o consentimento do propósito do estudo.
*   **Seção Flat de Apoio Financeiro:** Um card estático estilizado com bordas douradas tracejadas posicionado no encerramento da página principal, contendo um botão de clique único para cópia instantânea da chave PIX oficial.

---

## 🛠️ Catálogo Integrado: "Ferramentas Bíblicas"

Incluído como um aplicativo de apoio direto, o **`ferramentas-biblicas.html`** funciona como um mini cofre digital pessoal onde o estudante pode:
*   **Minerar Recursos:** Interface no estilo de cards deslizáveis (*swipe*) para avaliar, descartar ou salvar links acadêmicos úteis de exegese, dicionários e softwares (Sefaria, STEP Bible, Blue Letter Bible).
*   **Favoritar e Catalogar:** Banco de dados offline local (*localStorage*) para guardar recursos essenciais de pesquisa exegética.
*   **Exportar para PDF:** Geração de um catálogo de recursos em tamanho A4 estruturado de forma acadêmica para impressão ou backup físico.
*   **Sobre & Instituições:** Modal em formato de manuscrito clássico em papel pergaminho detalhando o propósito do projeto e recomendando as grandes faculdades e seminários brasileiros de rigor teológico (Faculdade Batista Logos, ISBC e SBRS).

---

## 📂 Estrutura do Repositório

```bash
o-sentido-autentico/
├── index.html                   # Página principal (Portal, Hebraico e Grego)
├── ferramentas-biblicas.html    # Aplicativo de mineração, favoritos e PDF
├── styles.css                   # Folha de estilos responsiva com Modo Escuro e A11y
├── script.js                   # Lógicas de navegação, player de áudio e acessibilidade
├── sw.js                        # Service Worker para caching offline completo (PWA)
├── manifest.json                # Manifesto de instalação do aplicativo no celular/PC
├── README.md                    # Documentação do projeto
├── processar_imagens.py         # Script Python utilitário para otimização de capas
└── imagens/                     # Direpório local contendo as capas de livros e infográficos
🚀 Como Executar e Instalar
O portal foi construído como um aplicativo web progressivo (PWA), o que significa que ele pode ser executado offline diretamente no seu dispositivo:
Acesse o link oficial do portal: https://seu-usuario.github.io/o-sentido-autentico/
Instale como Aplicativo: No seu navegador (Chrome, Edge ou Safari), clique no ícone de instalação localizado na barra lateral ou no menu de opções para adicionar O Sentido Autêntico à tela de início do seu smartphone ou computador.
Aproveite Offline: Uma vez instalado, o Service Worker garante que você possa acessar os roteiros de 5 níveis, cronogramas, deques do Anki e prompts de IA mesmo sem conexão com a internet.
📜 Licença e Direitos Autorais
Este projeto foi idealizado e desenvolvido sob a curadoria teológica e acadêmica de Rogério Ramão Lopes em Setembro de 2026.
Todos os direitos reservados. Licenciado sob os termos da licença internacional Creative Commons Atribuição-NãoComercial-CompartilhaIgual 4.0 (CC BY-NC-SA 4.0). Você está livre para compartilhar e adaptar o material, desde que atribua o crédito apropriado ao autor, não o utilize para fins comerciais e distribua suas contribuições sob a mesma licença.

---

## 🌟 Principais Recursos e Diferenciais Técnicos

### 📱 1. PWA Integrado (Progressive Web App)
O site é totalmente compatível com os padrões de PWAs modernos:
*   **Instalação nativa:** Os botões "Instalar Aplicativo" aparecem de forma sutil e automatizada caso o navegador detecte compatibilidade no celular ou computador.
*   **Acesso 100% Offline:** O arquivo `sw.js` cacheia de forma inteligente as páginas, gráficos, imagens e até mesmo a palestra completa em áudio de 22 minutos, permitindo que você estude em locais sem rede.

### ⏱️ 2. Barra Lateral Inteligente e Autoocultável
*   **Modo de Concentração Exegética:** Para manter suas vistas focadas unicamente na Palavra de Deus, a barra lateral se recolhe automaticamente após **4 segundos de inatividade**.
*   **Acesso Rápido:** Basta passar o mouse ou clicar no botão de menu flutuante dourado (**FAB**) para reexpandir a barra de forma instantânea.

### 🎭 3. Visual Premium e Zero "Flicker" no Modal
*   O modal de boas-vindas foi redesenhado em **duas colunas no desktop**, apresentando o manifesto de Rogério Ramão Lopes e as orientações iniciais sem necessidade de qualquer rolagem vertical.
*   **Correção de Flicker (FOUC):** Através de um script síncrono e inline, o modal permanece oculto por padrão no CSS para quem já o dispensou, eliminando qualquer "piscada" rápida em carregamentos sucessivos.

### 🛠️ 4. Mobile App Hub (Abaixo do Portal)
Traz as indicações e reviews de ferramentas para smartphones baseadas na curadoria de Rogério Lopes:
*   **Sofia App (Sem Anúncios):** Ferramenta essencial de exegese móvel com integração Strong + GK, domínios semânticos de Louw-Nida e tipografia de escala avançada.
*   **Ginoskos:** Excelente sistema de repetição espaçada (curva do esquecimento) para fixação de gramática de múltiplos idiomas antigos.
*   **Global Bible Tools:** Desenvolvido em parceria com a equipe do *Aleph with Beth*, 100% gratuito e focado em leitura bíblica fluente com áudios locais.

---

## 🚀 Como Publicar no GitHub Pages pelo Navegador

1.  Crie um repositório **público** no GitHub chamado `linguas-biblicas`.
2.  Arraste e solte o conteúdo descompactado do arquivo `linguas-biblicas-zip.txt` (renomeado para `.zip`) diretamente no navegador.
3.  Vá em **Settings -> Pages** no seu repositório.
4.  Selecione a branch **`main`** (ou `master`), mantenha a pasta como **`/(root)`** e clique em **Save**.
5.  Em 1-2 minutos, seu link oficial de estudos e instalação estará no ar!

---

*“A consistência transforma informação em conhecimento, conhecimento em habilidade, e habilidade em sabedoria.” — Rogério Ramão Lopes*
