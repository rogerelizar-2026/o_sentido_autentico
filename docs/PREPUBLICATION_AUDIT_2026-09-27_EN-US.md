# Pre-publication Audit — O Sentido Autêntico + Integrated Exegesis Guide

**Audit date:** September 27, 2026  
**Scope:** the `o_sentido_autentico_integrado` package, rebuilt from the public `rogerelizar-2026/o_sentido_autentico` repository and extended with the Integrated Exegesis Guide.  
**Audit type:** static-code review, front-end/PWA architecture, security, accessibility, UI/UX, editorial consistency, journalism, philology, hermeneutics, and theology.  
**Limitations:** this was not a penetration test, legal opinion, Brazilian Ministry of Education accreditation review, formal academic peer review, or exhaustive cross-browser/device test. Institutional status, publisher catalogs, and external-resource availability are time-sensitive and must be confirmed by the owner before release.

---

## 1. Executive assessment

The project has a solid foundation: a static architecture well suited to GitHub Pages, an established PWA, local assets, responsive navigation, meaningful accessibility work, substantial bibliography, and a responsible educational purpose. Adding the Exegesis Guide significantly increases the portal’s value by connecting language study with hermeneutics, textual criticism, syntax, discourse, and application.

**The integrated package should not be published without a corrective pass.** There is a confirmed runtime error in the Guide’s installation flow, stale production URLs, an invalid institutional link, a legacy page that expands the attack surface, and incomplete visual/functional integration between the Guide and the portal’s design system.

### Overall rating

| Area | Rating | Note |
|---|---|---|
| Static architecture | Good | Appropriate for GitHub Pages |
| PWA/offline | Good foundation; corrections required | Cache integration exists, but Guide installation/update behavior is inconsistent |
| Security | Moderate | No production npm advisories; legacy page and missing content policy require attention |
| Accessibility | Moderate | The main portal is stronger than the Guide page |
| UI/UX | Good but inconsistent | The Guide still behaves like a microsite inside the portal |
| Theological/philological content | Good introductory level | Requires editorial qualifications and specialist review |
| Journalistic/bibliographic rigor | Moderate | Promotional absolutes, links, and time-sensitive claims require verification |
| Release readiness | **Not approved until P0/P1 remediation** | Address the priorities below |

---

# 2. Priority risks — P0 (fix before upload)

## P0.1 — JavaScript error after accepting PWA installation

**Location:** `guia-exegese.html`, `openInstall()`, approximately line 506.  
**Defect:** after `deferredInstall.userChoice`, the code executes `installBtn.hidden=true`, but `installBtn` was removed from the header and is no longer declared.

```js
installBtn.hidden = true;
```

**Impact:** a `ReferenceError` occurs immediately after the installation flow. The browser may still accept installation, but the UI ends in an error and the dialog state may remain inconsistent.

**Correction:** remove the reference or update the remaining installation controls:

```js
document.querySelectorAll('[data-install-action], [data-install-menu]')
  .forEach((button) => { button.hidden = true; });
```

Preferably, the Guide should not maintain a second PWA manager. It should reuse the centralized `js/pwa.js` module and the portal’s standard update/install UI.

**Acceptance test:** install through Android Chrome or Brave with no console error; test both cancellation and acceptance; reopen in standalone mode.

---

## P0.2 — Invalid “Seminários Nacional AIBREB” link

**Location:** `guia-exegese.html`, approximately line 82.  
**Current URL:** `http://seminariosnacionalaibreb.org.br`  
**Problem:** this domain does not match the verified official directory. The institutional directory is available at:

```text
https://aibreb.org.br/instituicoes_seminarios.html
```

**Impact:** broken trust, likely dead destination, and potential future third-party domain risk; editorial and pastoral credibility are affected.

**Correction:** replace the URL, enforce HTTPS, and label it:

> AIBREB — Directory of institutions, colleges, and seminaries

**Editorial qualification:** AIBREB listing indicates denominational relationship or recognition; it does not, by itself, establish government academic accreditation.

---

## P0.3 — Stale production URLs in Open Graph metadata and operational documentation

**Primary locations:**

- `hebraico-aramaico.html`, `og:url`;
- `grego-koine.html`, `og:url`;
- `caixa-de-ferramentas.html`, `og:url`;
- `README.md`;
- `docs/AUDITORIA-2026-09-24.md`;
- `docs/LIMITACOES-PERGUNTAS.md`;
- `docs/PLANO-IMPLEMENTACAO.md`;
- `docs/PUBLICAR-GITHUB.md`.

**Stale base:**

```text
https://rogerelizar-2026.github.io/AutenticSense-Free/
```

**Correct base:**

```text
https://rogerelizar-2026.github.io/o_sentido_autentico/
```

**Impact:** social sharing points to the wrong path; documentation can direct the owner to the wrong repository; older tests may validate obsolete values.

**Correction:** perform a repository-wide search for `AutenticSense-Free`; update all three page-level `og:url` values, the README, operational docs, and any tests that compare canonical URL, sitemap, and `package.json.homepage`.

**Acceptance criterion:** no operational occurrence remains, except historical notes explicitly labeled obsolete.

---

## P0.4 — Publicly reachable legacy page with injection exposure and external dependencies

**Location:** `ferramentas-biblicas.html`.

**Findings:**

- production use of `cdn.tailwindcss.com`;
- Font Awesome, jsPDF, and AutoTable loaded from CDNs without Subresource Integrity;
- multiple `innerHTML` templates interpolating `res.titulo`, `res.descricao`, `res.url`, `res.tipo`, and related fields;
- dynamically generated `target="_blank"` links without `rel="noopener noreferrer"`;
- duplicated code and theming relative to the official `caixa-de-ferramentas.html`.

**Risk:** if resource data can be imported, edited, or otherwise manipulated, the `innerHTML` templates may enable persistent DOM XSS. Even if no current exploit path exists, the page expands attack surface, payload size, and maintenance debt.

**Recommended remediation:**

1. remove the page from the public package; or
2. move it under `arquivomorto/`, add `noindex`, and redirect to `caixa-de-ferramentas.html`; and
3. do not precache it; and
4. if retained, replace interpolation with safe DOM APIs/`textContent`, validate URLs, and add safe `rel` values.

**Acceptance criterion:** only one official catalog/toolbox remains publicly accessible.

---

# 3. High risks — P1 (fix before public promotion)

## P1.1 — Integration is linked, but not truly native

**Condition:** `guia-exegese.html` retains its own design system, header, sidebar, bottom navigation, dialogs, theme logic, and monolithic JavaScript. The portal uses the `osa-*` shell, local fonts, a shared drawer, accessibility controls, terms, and ES modules.

**UX impact:** entering the Guide feels like switching applications. Theme, navigation, accessibility, menu behavior, and installation are inconsistent. Two systems must be maintained.

**Correction:** migrate the Guide into the portal shell:

- `osa-shell`, `osa-sidebar`, `osa-header`, `osa-drawer`, `osa-bottomnav`;
- load `css/main.css` plus a focused `css/guia-exegese.css`;
- move logic to `js/guia-exegese.js`;
- reuse `js/main.js`, `theme.js`, `sidebar.js`, `a11y.js`, and `pwa.js`;
- preserve the Guide’s module numbering, diagrams, and internal color coding.

**Acceptance criterion:** moving between Portal, Greek, and Guide does not change the header, bottom navigation, accessibility controls, or theme behavior.

---

## P1.2 — PWA update flow is not shared by the Guide

The portal uses `js/pwa.js`, including a waiting-worker strategy and a visible “New version available” prompt. The Guide registers `sw.js` directly and does not implement the same update flow.

**Impact:** users who primarily remain in the Guide may stay on an old version; update behavior varies by page.

**Correction:** remove the Guide’s inline Service Worker registration and initialize PWA behavior through the central module. Maintain one install/update flow.

---

## P1.3 — Progress is marked complete without meaningful learner action

**Location:** `guia-exegese.html`, `IntersectionObserver`, approximately line 491.

A module is marked completed when it reaches 45% intersection while scrolling.

**Impact:** rapid scrolling creates false completion and reduces the pedagogical meaning of progress.

**Remediation options:**

- rename the state to “visited”; or
- require a “Mark complete” action; or
- require minimum engagement plus a checklist; or
- maintain separate visited and completed states.

**Recommendation:** explicit learner-controlled completion.

---

## P1.4 — Incomplete accessibility for tabs, accordions, and custom dialogs

### Tabs

- the container declares `role="tablist"`, but controls lack `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`, and arrow-key navigation.

### Accordions

- `aria-expanded` is assigned only after the first click;
- `aria-controls` and linked panel IDs are missing.

### Custom dialogs

- focus is not trapped;
- initial focus and focus restoration are not guaranteed;
- background content may remain keyboard-accessible.

### Auto-hiding header

- controls may disappear during zoom, keyboard use, or assistive-technology interaction;
- test at 200% and 400% zoom.

**Correction:** implement WAI-ARIA tab, accordion, and dialog patterns; prefer the portal’s `<dialog>` approach; integrate `a11y.js`.

---

## P1.5 — Academic accreditation and denominational recognition are not adequately distinguished

**Location:** Guide introduction, approximately lines 78–82.

The text recommends study at an “accredited educational institution” and immediately lists Faculdade Batista Logos and the AIBREB directory. Readers may infer that every listed institution holds government-recognized academic accreditation.

**Suggested editorial correction:**

> Free courses, ecclesiastical training, and government-recognized degree programs operate under different criteria. Verify higher-education status directly in Brazil’s e-MEC system and ask each institution about the legal nature of its certificates. AIBREB listing indicates denominational reference or relationship, not automatic government accreditation.

**Owner action:** confirm the exact status of each cited course and institution with e-MEC and the institution itself.

---

## P1.6 — HTTP links inside an HTTPS application

**Locations:** Guide and institutional list.

- `http://faculdadebatistalogos.edu.br` should use HTTPS;
- AIBREB should use `https://aibreb.org.br/instituicoes_seminarios.html`.

**Impact:** unnecessary redirects, possible mixed-content warnings, and lower user trust.

---

## P1.7 — Five-item mobile bottom navigation requires small-screen validation

**Location:** `css/components.css`, approximately lines 276–300.

The grid was expanded from four to five items. At 320 px, labels such as “Ferramentas” may be too compressed or too small.

**Correction:** test at 320, 360, 375, and 412 px; consider shortening the label to “Recursos”; maintain a minimum 44×44 px touch target and readable text. If navigation grows again, introduce a “More” destination.

---

# 4. Medium risks — P2

## P2.1 — Inline CSS and JavaScript reduce maintainability and block a strict content policy

The Guide contains a large inline `<style>` block and monolithic inline script. This prevents a strict Content Security Policy without `'unsafe-inline'`, weakens granular caching, and makes testing harder.

**Correction:** extract to:

```text
css/guia-exegese.css
js/guia-exegese.js
```

Then evaluate a restrictive CSP using a `<meta http-equiv>` policy compatible with GitHub Pages. GitHub Pages does not provide custom response headers by default.

---

## P2.2 — Structural redundancy and legacy files

Overlapping generations include:

- `manifest.json` and `manifest.webmanifest`;
- `styles.css` and `css/*`;
- `script.js` and `js/*`;
- `ferramentas-biblicas.html` and `caixa-de-ferramentas.html`.

**Impact:** unclear source of truth, risk of modifying the wrong file, and unnecessary payload.

**Correction:** declare canonical files and archive/remove obsolete ones. Document the decision in the README.

---

## P2.3 — Relative canonical metadata

Main pages use relative canonical URLs. Browsers resolve them, but absolute canonicals are clearer to crawlers and automated audits.

**Correction:** use absolute canonical URLs with the verified GitHub Pages base.

---

## P2.4 — Missing social-preview image for the Guide

The Guide has Open Graph title and description but no `og:image` or matching Twitter Card metadata.

**Suggestion:** create a 1200×630 image featuring the open-book mark, title, and portal identity; add `og:image`, `twitter:card`, `twitter:title`, and `twitter:description`.

---

## P2.5 — Existing automated tests do not fully cover the Guide

The current tests predate the integration.

**Add coverage for:**

- Guide links in sidebar, drawer, and bottom navigation;
- offline loading of `guia-exegese.html`;
- manifest shortcut;
- PWA installation/update;
- keyboard operation of tabs and accordions;
- persistence of `osa:exegese:state`;
- no overflow at 320 px;
- shared theme behavior;
- all canonical URLs;
- scheduled external-link checking.

---

## P2.6 — Service Worker silently tolerates incomplete precaching

`Promise.allSettled` prevents one missing file from breaking installation, which is resilient, but it can produce a partially fulfilled offline promise.

**Correction:** retain runtime tolerance, but make CI fail when any `CORE_ASSETS` item does not return HTTP 200. Display app/cache version in an About screen.

---

# 5. Content audit — theology, philology, and hermeneutics

## T1 — State the confessional standpoint explicitly

The portal uses evangelical language and recommends Regular Baptist institutions. This is legitimate, but editorially it should be explicit.

**Suggested statement:**

> This project is produced from a confessional evangelical Christian perspective. It seeks to present academic tools honestly while distinguishing textual data, methodological decisions, and theological convictions.

This is more transparent than implying complete neutrality.

---

## T2 — Refine “original intention” language

Do not promise direct access to the author’s psychology. Prefer:

> the communicative intention historically accessible through the final form of the text, its context, and its first audiences.

Where relevant, distinguish historical author, narrator, implied author, final redaction, and canonical function.

---

## T3 — Do not present an exegetical workflow as infallibly linear

The Guide’s flow is pedagogically useful, but exegesis is iterative. Textual criticism, lexicon, syntax, genre, context, and biblical theology often require returning to earlier stages.

**Correction:** visualize the workflow as a revisable spiral or cycle, not only a one-way pipeline.

---

## T4 — Update textual-criticism framing

Paroschi remains historically useful but works mainly with NA26/UBS3 and categories now treated more cautiously.

**Add:**

- NA28/UBS5;
- ECM where relevant;
- the Coherence-Based Genealogical Method as an important development, without presenting it as an automatic solution;
- distinctions among “original text,” “initial text,” and “earliest recoverable form,” according to the chosen scope.

---

## T5 — Greek verbal aspect and the Hebrew verbal system

The Guide includes useful warnings, but it should explicitly acknowledge active debates concerning:

- tense, aspect, and modality in Greek;
- discourse function and Aktionsart;
- the Greek perfect;
- qatal/yiqtol and sequential forms in Hebrew;
- differences between traditional pedagogical models and current linguistics.

Complex controversies should not be resolved by a single introductory chart.

---

## T6 — Typology, allegory, and New Testament use of the Old Testament

The presentation follows a classic evangelical framework. It should acknowledge differing approaches to:

- sensus plenior;
- canonical reading;
- intertextuality;
- retrospective typology;
- Second Temple Jewish interpretive practices.

**Suggestion:** add a short “approaches under discussion” note and contrasting bibliography without turning the introductory guide into a monograph.

---

## T7 — Distinguish academic description from doctrinal endorsement

Phrases such as “great faithfulness to Scripture” are the curator’s judgment, not universally measurable facts.

**Suggested rewrite:**

> The following are two recommendations from the curator, selected for their confessional orientation, educational seriousness, and personal formation experience. Students should verify program type, faculty, curriculum, and applicable recognition.

---

# 6. Philological and bibliographic audit

## F1 — Rega described as “inductive”

The portal describes Rega/Bergmann as using an “inductive approach.” Descriptions of the work also characterize its method as deductive with progressive substitution. Verify the terminology against the methodology section of the edition actually used.

**Safer wording:** “a progressive approach combining paradigm explanation with graduated exercises.”

---

## F2 — Mounce publisher/title inconsistency

The home page uses “Mounce — Vida” in one place and “Mounce — Vida Nova” in the table. Confirm the exact Brazilian title, publisher, edition, and ISBN. Avoid alternating between:

- *Fundamentos do grego bíblico*;
- “Gramática do NT Grego.”

Use the official bibliographic title consistently.

---

## F3 — “Definitive guide” is excessive promotional language

The portal calls Wallace “the definitive guide.” No grammar should be presented as definitive, particularly in light of later linguistic debate.

**Suggested rewrite:**

> One of the most influential and widely used intermediate-to-advanced exegetical syntax grammars of New Testament Greek.

---

## F4 — Availability statements for Paroschi and LaSor are time-sensitive

The statement that they are no longer published or sold should include a verification date:

> Status checked in September 2026; availability may change, and used copies may remain available.

LaSor appears as out of stock in catalogs and available through used-book markets. Do not imply absolute nonexistence.

---

## F5 — Bibliography needs one style standard

Select ABNT, Chicago, or SBL and normalize:

- author names;
- italics;
- edition;
- translator;
- city/publisher/year;
- optional ISBN;
- page references where relevant;
- access dates for online materials.

SBL or Chicago Notes-Bibliography fits biblical studies; ABNT is more familiar in Brazilian academic settings.

---

# 7. Journalism and editorial audit

## J1 — Time-sensitive and commercial claims need dates and sources

Examples:

- “100% ad-free”;
- “best recommendation for students”;
- publisher availability;
- method counts;
- institutional/program status.

**Correction:** add “verified September 2026,” explain evaluation criteria, and provide a source. Replace “best” with “the curator’s editorial recommendation.”

---

## J2 — Separate editorial judgment from third-party claims

Introduce labels such as:

- **Curator assessment**;
- **Publisher-provided information**;
- **Institution-provided information**;
- **Editorial estimate**;
- **Status verified [date]**.

This prevents readers from confusing fact, vendor marketing, and editorial judgment.

---

## J3 — Corrections and transparency policy

The email invitation is positive. Add an “Editorial Policy” section or page that covers:

- how to submit corrections;
- content version/date;
- changelog;
- resource inclusion criteria;
- conflict-of-interest disclosure;
- affiliate-link or financial-support policy;
- target response time for critical corrections.

---

## J4 — Portuguese-language copyediting

Conduct a full human copyedit. Recurring points to verify:

- double spaces;
- agreement in lists;
- consistent “coinê/koiné” usage;
- “Novo Testamento” versus “NT”;
- “Greek exegesis” versus “exegesis of the Greek text”;
- title capitalization;
- italicization of English terms: *arcing*, *phrasing*, *display-mode*;
- hyphens, em dashes, and quotation marks.

---

# 8. Security and privacy

## S1 — Dependency audit result

`npm audit --omit=dev` reported no known production dependency vulnerabilities at the time of this audit. This does not cover CDN assets, inline code, DOM logic, or future advisories.

## S2 — `localStorage`

No sensitive data is stored, but progress, preferences, and the user’s collection can be lost when browser data is cleared. The toolbox already warns about export. Extend a similar notice to Guide progress.

## S3 — External links

Standardize every `target="_blank"` link with:

```html
rel="noopener noreferrer external"
```

The legacy page contains unprotected links.

## S4 — Content Security Policy

After removing inline scripts, consider a restrictive CSP. On GitHub Pages, use a carefully tested `<meta http-equiv="Content-Security-Policy">`; custom HTTP response headers are not natively available.

## S5 — External dependency integrity

Avoid CDNs when local assets already exist. If a CDN is unavoidable, pin versions and use SRI where supported.

---

# 9. Recommended remediation plan

## Phase 1 — Release blockers

1. Fix the missing `installBtn` reference.
2. Correct Faculdade Batista Logos/AIBREB links to HTTPS and the official destination.
3. Replace all operational `AutenticSense-Free` URLs.
4. Remove, redirect, or neutralize `ferramentas-biblicas.html`.
5. Perform hosted HTTPS testing on GitHub Pages, not only `file://` testing.

## Phase 2 — Product consistency

6. Migrate the Guide to the `osa-*` shell, or at minimum reuse central PWA, accessibility, and drawer modules.
7. Unify PWA installation and update handling.
8. Correct automatic progress semantics.
9. Implement accessible tabs, accordions, and dialogs.
10. Validate bottom navigation at 320–412 px.

## Phase 3 — Academic/editorial review

11. Verify accreditation/program type and add an e-MEC qualification.
12. Verify Rega, Mounce, Wallace, Paroschi, and LaSor against the actual editions/catalogs.
13. Remove promotional absolutes.
14. State confessional standpoint and editorial policy.
15. Normalize bibliography and add access/verification dates.

## Phase 4 — Technical sustainability

16. Extract Guide CSS/JS.
17. Remove legacy files and duplicate manifests.
18. Extend Playwright/axe/PWA tests.
19. Add automated link checking and Lighthouse auditing.
20. Establish a changelog and release/version process.

---

# 10. Publication approval checklist

- [ ] PWA installation tested without error in Android Brave or Chrome.
- [ ] Service Worker update tested from v1.0 to v1.1.
- [ ] Guide loads offline after the first visit.
- [ ] No operational URL contains `AutenticSense-Free`.
- [ ] AIBREB and Faculdade Batista Logos use verified HTTPS destinations.
- [ ] Legacy toolbox page is removed or redirected.
- [ ] Navigation works at 320 px with no critical truncation.
- [ ] Tabs, accordions, and dialogs operate by keyboard.
- [ ] Contrast and 200% zoom checks pass.
- [ ] Institutional and bibliographic facts are owner-verified.
- [ ] At least one qualified instructor performs theological/philological review.
- [ ] Portuguese copyediting is complete.
- [ ] A backup of the current public repository exists.

---

# 11. Conclusion

The project is promising and educationally valuable, but the current package should be treated as a **release candidate**, not a final build. P0 items are few but materially affect trust, installation, and security. P1 remediation will determine whether the Guide truly feels like part of “O Sentido Autêntico” rather than an attached page.

After P0 and P1 corrections, perform HTTPS acceptance testing with at least:

- Android Brave or Chrome;
- iPhone Safari, if available;
- desktop Chrome/Edge/Firefox;
- keyboard-only use or a screen reader;
- offline mode and version update.

**Final recommendation:** do not replace the public repository until release blockers are fixed and a new audited package is generated.

---

## External references verified during this audit

- AIBREB official site: https://aibreb.org.br/
- AIBREB institutions, colleges, and seminaries: https://aibreb.org.br/instituicoes_seminarios.html
- Pinto & Dias, second edition, ISBN 9788527509909: catalog checked September 2026.
- LaSor Brazilian edition, ISBN 9788527500869; catalog availability shown as out of stock when checked in September 2026.
