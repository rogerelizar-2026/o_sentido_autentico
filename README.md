# O Sentido Autênticos v.1.0

### Tecnologia e profundidade histórica para conectar você ao sopro original de Deus.
### Curadoria Acadêmica e Teológica por **Rogério Ramão Lopes** (`rogerelizar@gmail.com`)
*Desenvolvido em Setembro de 2026*

Este é o repositório oficial do **Portal de Estudos de Línguas Bíblicas (Hebraico, Aramaico e Grego Koiné)**, um ambiente web interativo, responsivo e offline-first projetado sob medida para seminaristas, pastores, líderes cristãos e autodidatas brasileiros. 

O portal foi estruturado para ser uma **esteira de estudos progressiva de 5 níveis** (da Fundação à Fluência), combinando rigor acadêmico clássico com a inteligência artificial do **Notebook Gemini** para triplicar a velocidade de aprendizado e retenção dos textos bíblicos originais.

---

## 📂 Estrutura do Repositório (Pronto para GitHub Pages)

Para hospedar o projeto no GitHub Pages e torná-lo instalável no celular/computador como aplicativo (PWA), organize sua pasta raiz exatamente assim:

```
linguas-biblicas/
├── index.html                 ← Portal central (HTML5 semântico)
├── ferramentas-biblicas.html  ← Catálogo de Hermenêutica e Mineração (opcional)
├── línguas_bíblicas_e_tecnologia.m4a ← Palestra de áudio-curadoria (22 min 24 seg)
├── styles.css                 ← Folha de estilos premium com Modo Escuro
├── script.js                  ← Lógica das abas, Chart.js, player e modal
├── manifest.json              ← Configurações PWA (Instalação e Ícones)
├── sw.js                      ← Service Worker (Suporte 100% Offline e Cache)
├── processar_imagens.py       ← Utilitário em Python para processamento de capas
├── README.md                  ← Este arquivo descritivo
└── imagens/                   ← Pasta local de ativos de imagem
    ├── infografico-hebraico.png  ← Roteiro estruturado de Hebraico/Aramaico
    ├── infografico-grego.png     ← Roteiro estruturado de Grego Koiné
    ├── infografico-gemini.png    ← Esteira de aceleração com Notebook Gemini
    ├── infografico-notebook.png  ← Guia de softwares e ferramentas
    ├── capa-ross.png             ← Capa da gramática de Allen P. Ross (.png ou .jpg)
    ├── capa-rega.png             ← Capa da gramática de Lourenço Stelio Rega
    ├── capa-mounce.png           ← Capa da gramática de William Mounce
    └── capa-wallace.png          ← Capa da gramática de Daniel B. Wallace
```

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
