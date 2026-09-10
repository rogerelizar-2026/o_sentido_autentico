# Caixa de Ferramentas - Prompt de Engenharia (Versão 2.0)

## Role
Act as a Senior Front-End Architect and UI/UX Designer specializing in Academic Theological Software. You are tasked with building a standalone, high-fidelity Single Page Application (SPA) named "Caixa de Ferramentas" (Toolbox).

## Context & Design Philosophy
This tool is the companion "Workshop" to the main content platform "O Sentido Autêntico". 
- **Visual Continuity:** It must share the exact same design system (CSS variables, typography, dark/light modes, accessibility features) as the main site. Use the 'Portal Emerald/Teal' and 'Gold' palette.
- **Distinct Identity:** While the main site is for *reading*, this tool is for *working*. The UI should feel like a precision instrument or a scholar's desk. Use subtle textures (paper grain, faint grid lines) in the background of the workspace areas.
- **Tech Stack:** Single HTML file. Vanilla JavaScript (ES6+). No external frameworks. Fonts: Cinzel, Lora, Inter, SBL Hebrew/Greek.

## Core Objective
Create a dynamic "Resource Discovery & Curation Engine" for Biblical Languages (Hebrew, Aramaic, Koine Greek). Unlike a simple list, this tool must help the user *find*, *validate*, *contextualize*, and *export* resources.

## Key Functional Requirements

### 1. The "Scholar's Dashboard" (Home)
- **Dynamic Stats:** Real-time counters for Total Resources, Verified/Academic Grade, Open Access vs. Paid, and Languages Covered.
- **Quick Filters:** Chips for "Immediate Need" (e.g., "Parsing Help", "Lexicon", "Manuscript View").
- **Discovery Feed:** A section showing "Recently Added" or "Hidden Gems" to encourage exploration.

### 2. Advanced Resource Card System
Each resource card must display rich metadata:
- **Academic Rigor Score:** Visual indicator (Stars/Grade).
- **Textual Base:** Tags (BHS, NA28, LXX, UBS5).
- **Theological Bias Indicator:** Tags (Evangelical, Critical, Catholic, Neutral).
- **Cost Model:** Badges (Free, Freemium, Subscription).
- **Action Buttons:** "Save to Toolbox", "Open Link", "Read Review".

### 3. The "Deep Dive" Modal
- **Exegetical Use Case:** Specific example of application.
- **Pros/Cons Analysis:** Curated bullet points.
- **Integration Snippets:** Copy-paste citations (Zotero/BibTeX).

### 4. Smart Collection Management
- **Project-Based Grouping:** Tag resources into projects (e.g., "Thesis on Romans").
- **Gap Analysis:** Visual hints for missing resource types.

### 5. Internationalization (i18n)
- **Default Language:** Portuguese (BR).
- **Supported Languages:** English, Spanish.
- **Persistence:** Save language preference in localStorage, shared with the main site context.
- **UI Toggle:** Accessible via settings menu.

## Data Structure (Simulated)
Include a robust initial dataset of at least 8-10 diverse resources covering Hebrew, Aramaic, Greek, and General Hermeneutics. Descriptions must be theologically rich.

## Output Format
Provide a single, complete, production-ready `caixa-de-ferramentas.html` file. 
- All CSS internal but organized.
- All JS internal, modular, and commented.
- Ready to run without build steps.

## Tone of Voice
Professional, encouraging, academically rigorous, yet accessible (humility in learning). Avoid childish gamification; aim for "professional mastery."
