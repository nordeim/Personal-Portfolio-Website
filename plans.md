# PRD.md

Version: 1.0 — Date: 2025-09-10 — Author: AI Agent
Assumptions:

* Host: GitHub Pages (static hosting only).
* No backend allowed; contact form will use a forms-as-a-service provider (e.g., Formspree).
* Accessibility target: WCAG 2.1 Level AA.
* Design intent = attached screenshot `/mnt/data/6afa7ff2-bd8d-48da-b299-90168b74f85f.png` (treated as authoritative).

---

## How I researched this

I prioritized standards and up-to-date, authoritative sources for accessibility, performance, static hosting, and form handling. Main references: W3C WCAG guidance, Google / web.dev performance guidance (Core Web Vitals), GitHub Pages docs, Formspree docs for static-site form handling, and MDN for color-scheme / dark-mode best practices. Key claims below cite those sources. ([W3C][1], [web.dev][2], [GitHub Docs][3], [Formspree][4], [MDN Web Docs][5])

---

## 1. Project summary & vision

Build a lightweight, accessible, responsive personal portfolio site (static) that showcases projects, supports a dark-mode toggle, includes a contact form (no server-side code), and meets WCAG AA and Core Web Vitals targets for performance. The UI will follow the attached design intent (hero, nav, project cards, contact form) and be easy to maintain, testable, and deployable via GitHub Pages.

---

## 2. Goals & success metrics (KPIs)

* **Performance**: LCP (Largest Contentful Paint) ≤ 2.5s (75th percentile, mobile). ([web.dev][2])
* **Accessibility**: Achieve WCAG 2.1 Level AA on critical flows (Home, Projects, Contact). ([W3C][1])
* **Responsiveness**: Layout breaks maintain readable/perceivable content on 320px–1920px viewports.
* **Form reliability**: Contact form submissions received and recorded by chosen provider (100% success in smoke tests).
* **Bundle budgets**: JS bundle ≤ 100 KB gzipped (target), Images ≤ 300 KB total above-the-fold resources. (Set as measurable budget to enforce via CI).
* **SEO basics**: All pages have appropriate meta tags, titles, structured data for projects (JSON-LD) and achieve basic crawlability.

Definition of Done (DoD): passes the acceptance checklist in section 13 (below).

---

## 3. Target users & personas

1. **Hiring Manager — "Alex"**

   * Motivation: Quickly evaluate projects and skills.
   * Acceptance scenario: Visits Home, quickly sees hero + top 3 projects, navigates to Project details, and clicks Contact.

2. **Peer Developer — "Sam"**

   * Motivation: Inspect technical details or code samples.
   * Acceptance scenario: Finds a Projects section with clear descriptions, links to GitHub/CodeSandbox and tech stack tags.

3. **Recruiter/Client — "Priya"**

   * Motivation: Reach out for work.
   * Acceptance scenario: Uses Contact form (mobile or desktop) and receives confirmation (and owner receives submission).

---

## 4. User journeys & key flows

* **Primary flow (Conversion):** Entry → Hero (value + CTA) → Projects → Project Detail modal/page → Contact → Form Submit → Confirmation.

  * Mobile notes: sticky header collapses on scroll, hero height reduced to avoid pushing project cards off-screen.
* **Secondary flow (Exploration):** Entry → About → Scroll project cards → external links (GitHub, live demos).
* **Accessibility flow:** Keyboard-only navigation test: Tab/Shift-Tab cycles through Nav → CTA → Project cards → Contact form with visible focus outlines and ARIA labels.

---

## 5. Core features

* Responsive navbar linking Home / Projects / About / Contact (collapsible on mobile).
* Hero section: heading ("Welcome to My Portfolio"), short intro, CTA to Projects/Contact.
* Projects grid: at least 3 project cards (title, short description, placeholder image). Click opens detail modal or single project page.
* Contact form: name, email, message, client-side validation, spam protection hints (honeypot + optional CAPTCHA via form provider). No server backend — use service (Formspree / Netlify Forms / Formspark). ([Formspree][4], [Netlify Docs][6])
* Dark mode toggle: respects `prefers-color-scheme` and stores user setting in `localStorage`. Provide both CSS `prefers-color-scheme` and a JS toggle to override. ([MDN Web Docs][5])
* Accessibility: keyboard navigation, focus states, semantic markup, ARIA where necessary. Follow WCAG AA requirements. ([W3C][1])
* SEO/metadata: meta title/description, Open Graph tags, JSON-LD for projects.
* Performance: optimized images (AVIF/WebP fallbacks recommended), critical CSS inline (small) and lazy-load non-critical assets. (See image format guidance). ([RUMvision \[Real User Monitoring\]][7])

---

## 6. Functional requirements (detailed)

* **Navbar**

  * Inputs: clicks/keyboard Enter on items.
  * Outputs: scroll to section (smooth scroll) or open mobile menu.
  * Error states: none; fallback to full-page navigation if smooth scroll unsupported.

* **Hero CTA**

  * Inputs: click → scroll to Projects or Contact section.
  * Outputs: visible focus ring; no JS dependency required for basic functionality.

* **Project cards**

  * Inputs: click/Enter → open modal (accessible), show title, description, tech tags, placeholder image, link to repo/demo.
  * Outputs: modal close by Escape and close button; trap focus while modal open.

* **Contact form**

  * Fields: name (required), email (required, RFC-like validation), subject (optional), message (required).
  * Client-side validation: HTML5 + JS. Show inline error messages and ARIA `aria-invalid` attributes.
  * Submit: POST to Formspree endpoint (or provider chosen). Show success/failure message. Use honeypot hidden input to reduce spam.
  * Error states: network errors show retry guidance; provider errors show provider-specific guidance.

---

## 7. Non-functional requirements

* **Performance budgets**

  * LCP: ≤ 2.5s (good). ([web.dev][2])
  * JS: target ≤ 100 KB gzipped (prefer vanilla JS).
  * Initial payload: ≤ 500 KB total for first paint (images + CSS + JS).

* **Accessibility**

  * WCAG 2.1 Level AA conformance for critical pages. Use automated tests (axe) + manual audits. ([W3C][1])

* **SEO**

  * Proper meta tags, canonical link, structured data for Projects (JSON-LD) and Sitemap generation optional.

* **Security & privacy**

  * Content Security Policy (recommended basic header example in ExecutionPlan). No inline `eval` or `dangerous` JS. Form provider must comply with data handling rules; include privacy note on Contact form.
  * If collecting personal data: provide link to privacy statement and instructions for data deletion (GDPR awareness).

---

## 8. UI/UX Design specs (summary)

* **Grid & breakpoints**

  * Mobile-first; breakpoints: 320–599px (mobile), 600–899px (tablet), 900–1279px (desktop), 1280px+ (wide).
* **Typography**

  * Scale example: h1 2rem, h2 1.5rem, body 1rem (16px). System font stack with optional Google Font fallback.
* **Spacing**

  * 4px base, spacing scale: 4, 8, 16, 24, 32, 48.
* **Color palette** (example tokens)

  * Light: background `--bg: #ffffff`, surface `--card: #f7f7f8`, text `--text: #0b0b0b`.
  * Dark: background `--bg: #0b0c10`, surface `--card: #111214`, text `--text: #e6e6e6`.
  * Accent: `--accent: #0066ff`. (These are placeholders; designer can replace.)
* **Components**: details for nav, hero card, project card, modal, form controls with focus outlines (2px solid accent), touch targets >= 44x44px.

**Interactions**

* All interactive controls must have visible focus; modals must trap focus and be dismissible with Escape. Respect `prefers-reduced-motion`. Provide high contrast states for accessibility.

---

## 9. Technical architecture & stack recommendations

**Recommended minimal stack (trade-offs):**

* **Static** site using plain HTML/CSS/vanilla JS (fast, minimal dependencies) — best for performance and GitHub Pages.
* **Optional SPA** using a lightweight framework (Vite + Preact) — trade-off: more JS bundle, faster dev DX. Use only if dynamic features or client routing required.

**Hosting / deployment**: GitHub Pages (free, Git-based deployment) — suitable for static portfolio; keep repo <1 GB and adhere to Pages limits. ([GitHub Docs][3])

**Form handling**: Formspree or Netlify Forms (if hosting on Netlify). Formspree is simple to integrate with pure HTML forms for static sites. ([Formspree][4], [Netlify Docs][6])

**CDN / image hosting**: Use GitHub Pages for static assets; consider an image CDN (Cloudinary/Imgix/Cloudflare Images) if you serve many large images or want automatic format negotiation (AVIF/WebP). Use `<picture>` with AVIF/WebP fallback to maximize compression. ([RUMvision \[Real User Monitoring\]][7])

---

## 10. Data & file model

* `content/projects.json` (array of projects: id, title, description, image, tags, repoUrl, liveUrl)
* `assets/images/` (optimized AVIF/WebP + fallback JPEG)
* `index.html`, `about.html` (optional), `styles.css`, `script.js`
* `manifest.json` (if PWA), `sitemap.xml` (generated at build time)

Example project item (JSON):

```json
{
  "id": "proj-1",
  "title": "Sales Dashboard",
  "description": "Interactive dashboard built with D3 and Excel exports.",
  "image": "assets/images/proj-1.avif",
  "tags": ["D3","Dashboard","Excel"],
  "repoUrl": "https://github.com/username/sales-dashboard",
  "liveUrl": "https://username.github.io/sales-dashboard"
}
```

---

## 11. Testing & QA plan

* **Automated**

  * Run `axe` accessibility CLI on deployed pages (axe-core). ([npm][8])
  * Lighthouse audits for Performance/Accessibility/SEO (CI).
  * Basic E2E smoke tests (Playwright) to confirm navigation and form submission flows.
* **Manual**

  * Keyboard-only navigation, screen reader spot checks (NVDA/VoiceOver), mobile manual checks on real devices.

---

## 12. Release & rollout plan

* Branches: `main` (production), `develop` (staging), feature branches `feat/*`.
* CI: On `develop` push → run tests → deploy to staging (e.g., GitHub Pages preview via action or Netlify preview); on `main` push → run tests → deploy to production.
* Rollout: immediate (single-release). Use feature branch PR reviews, run automated checks before merge.

---

## 13. Acceptance Criteria & Definition of Done (DoD)

Each DoD item must be verified before marking done.

**Site general**

* [ ] HTML semantic structure present.
* [ ] Mobile & desktop layouts visually match wireframe intent (basic check).
* [ ] Github Pages deployment succeeds and site loads over HTTPS. ([GitHub Docs][3])

**Performance**

* [ ] Lighthouse Performance score ≥ 90 (or LCP ≤ 2.5s). ([web.dev][2])
* [ ] JS <= 100 KB gzipped.

**Accessibility**

* [ ] axe-core automated run: zero critical violations on core pages. ([npm][8])
* [ ] WCAG AA manual spot checks for keyboard/focus/contrast: pass.

**Functionality**

* [ ] Contact form submits and provider shows submission in inbox. ([Formspree][4])
* [ ] Dark mode works via `prefers-color-scheme` and toggle persists with `localStorage`. ([MDN Web Docs][5])

---

## 14. Risks & mitigations

* **Risk**: Form provider requires account/config; user hasn't created one.

  * Mitigation: Provide instructions and placeholder form markup; require user to insert provider `form-id`.
* **Risk**: Large images slow LCP.

  * Mitigation: Use AVIF/WebP, `<picture>`, responsive `srcset`, lazy-loading, and image CDN if needed. ([RUMvision \[Real User Monitoring\]][7])
* **Risk**: GitHub Pages limits (repo size).

  * Mitigation: Keep repo small; store large assets in external CDN. ([GitHub Docs][3])

---

## 15. Appendix: file manifest (suggested)

| Path                       |                                  Purpose | Notes                                       |
| -------------------------- | ---------------------------------------: | ------------------------------------------- |
| `index.html`               |                Landing + hero + projects | Semantic markup                             |
| `styles.css`               |                          All site styles | CSS variables, dark theme tokens            |
| `script.js`                | Dark toggle, nav toggle, form validation | Minimal vanilla JS                          |
| `content/projects.json`    |                             Project data | Used to generate cards (or hard-coded HTML) |
| `assets/images/*`          |                 AVIF/WebP/JPEG fallbacks | Optimized, responsive sizes                 |
| `README.md`                |                          Developer guide | Build & deploy instructions                 |
| `.github/workflows/ci.yml` |                              CI pipeline | Lint/tests/deploy steps                     |

---

## Sources & References

* WCAG 2.1 (W3C). ([W3C][1])
* Largest Contentful Paint — target ≤ 2.5s (web.dev). ([web.dev][2])
* GitHub Pages overview & limits (GitHub Docs). ([GitHub Docs][3])
* Formspree: forms-as-a-service for static sites (Formspree docs). ([Formspree][4])
* prefers-color-scheme / dark mode (MDN). ([MDN Web Docs][5])
* AVIF / WebP guidance for modern images. ([RUMvision \[Real User Monitoring\]][7])
* axe-core CLI (accessibility testing). ([npm][8])

---

# ExecutionPlan.md

Version: 1.0 — Date: 2025-09-10 — Author: AI Agent
Assumptions:

* Host: GitHub Pages (push to `gh-pages` or use pages action). ([GitHub Docs][3])
* Contact form will use Formspree (developer will supply form ID later). ([Formspree][4])
* WCAG 2.1 AA is target standard. ([W3C][1])

---

## How I researched this

Plan and tooling choices were informed by official hosting docs (GitHub Pages), accessibility guidance (WCAG), performance guidance (web.dev Core Web Vitals), and static-site form provider docs (Formspree). Commands and automation steps are typical patterns for static sites and accessibility/performance tooling. ([GitHub Docs][3], [W3C][1], [web.dev][2], [Formspree][4])

---

## Phase 0 — Kickoff & research (Independent Execution Recipe)

**Inputs:** `/mnt/data/6afa7ff2-bd8d-48da-b299-90168b74f85f.png`, project assumptions (above).
**Tasks:** validate assets, extract key UI elements from screenshot, confirm hosting & provider assumptions.
**Outputs:** `ASSUMPTIONS.md`, prioritized backlog `backlog.json`.
**Time estimate:** Low (0.5–1 hour).
**Success criteria:** `ASSUMPTIONS.md` exists and backlog contains prioritized components.

**Independent execution commands (AI agent):**

```bash
mkdir -p project && cd project
# Save assumptions file
cat > ASSUMPTIONS.md <<'MD'
Host: GitHub Pages
Form provider: Formspree (placeholder)
Accessibility target: WCAG 2.1 AA
Design intent: /mnt/data/6afa7ff2-bd8d-48da-b299-90168b74f85f.png
MD

# Create a minimal backlog
cat > backlog.json <<'JSON'
{"priority":["hero","projects","contact","dark-mode","seo"],"notes":"auto-generated"}
JSON
```

**Rollback:** `rm -rf project` or reset git to previous commit.

---

## Phase 1 — Design & Prototyping

**Inputs:** `ASSUMPTIONS.md`, `backlog.json`, screenshot.
**Tasks:** produce low-fidelity HTML prototypes for hero, nav, cards; define design tokens (CSS variables).
**Outputs:** `design/wireframes/` folder (HTML snippets), `design/tokens.css` (variables).
**Time estimate:** Medium (2–4 hours).
**Success criteria:** Prototype components render correctly on mobile & desktop snapshots.

**Independent execution recipe:**

```bash
mkdir -p design/wireframes && cd design
# Create tokens file
cat > tokens.css <<'CSS'
:root{
  --bg:#ffffff;--text:#0b0b0b;--accent:#0066ff;
  --card:#f7f7f8;--radius:12px;
}
[data-theme="dark"]{
  --bg:#0b0c10;--text:#e6e6e6;--card:#111214;
}
CSS

# create a simple hero snippet
cat > wireframes/hero.html <<'HTML'
<section class="hero">
  <h1>Welcome to My Portfolio</h1>
  <p>Short intro — built for clarity and performance.</p>
  <a href="#projects" class="cta">View Projects</a>
</section>
HTML
```

**File manifest changes:** `design/tokens.css`, `design/wireframes/hero.html`, etc.

**Acceptance tests:** Visual check on mobile width (320px) and desktop (1280px).
**Rollback:** remove `design/` folder or revert commit.

---

## Phase 2 — Static markup & styles (skeleton)

**Inputs:** design tokens, wireframes.
**Tasks:** build `index.html`, `styles.css`, minimal `assets/` and link `projects.json`. Use semantic HTML. No JS behavior yet.
**Outputs:** static site skeleton that renders content.
**Time estimate:** Medium (3–6 hours).
**Success criteria:** Page loads locally, accessible semantic markup present, passes basic accessibility checks (no missing alt attributes, forms present with labels).

**Independent execution recipe (files created exactly):**

```bash
# from project root
mkdir -p site assets images content && cd site
git init
cat > index.html <<'HTML'
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Portfolio — [Your Name]</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<header>
  <nav>
    <a href="#home">Home</a>
    <a href="#projects">Projects</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
    <button id="theme-toggle" aria-pressed="false">Toggle theme</button>
  </nav>
</header>
<main id="home">
  <section class="hero" aria-labelledby="hero-heading">
    <h1 id="hero-heading">Welcome to My Portfolio</h1>
    <p>Short intro copied from design intent.</p>
  </section>
  <section id="projects" aria-labelledby="projects-heading">
    <h2 id="projects-heading">Projects</h2>
    <div id="projects-grid"></div>
  </section>
  <section id="contact" aria-labelledby="contact-heading">
    <h2 id="contact-heading">Contact</h2>
    <!-- Contact form placeholder -->
  </section>
</main>
<script src="script.js" defer></script>
</body>
</html>
HTML

cat > styles.css <<'CSS'
/* import design tokens */
@import "../design/tokens.css";
html{box-sizing:border-box;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
body{background:var(--bg);color:var(--text);margin:0;padding:16px}
nav a{margin-right:12px}
.hero{padding:24px 0}
#projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
CSS
```

**Accessibility baseline tests (automated):**

```bash
# Install axe CLI (if not installed)
npm init -y
npm i -D @axe-core/cli
# Run later against deployed or local server
```

**Rollback:** revert commit / delete `site/`.

---

## Phase 3 — Interactive behavior & progressive enhancement

**Inputs:** static site skeleton.
**Tasks:** implement JavaScript for:

* Dark-mode toggle (`prefers-color-scheme` fallback + localStorage override). ([MDN Web Docs][5])
* Mobile nav toggle (aria-expanded), smooth scrolling, accessible modal for project details, client-side form validation, and contact form action to Formspree placeholder.

**Outputs:** `script.js` with documented functions and comments; progressive enhancement strategy documented.
**Time estimate:** Medium (4–8 hours).
**Success criteria:** All interactive features work with JS enabled and degrade gracefully without JS.

**Independent execution recipe (exact file write):**

```bash
# add script.js
cat > script.js <<'JS'
/* Dark-mode toggle + persist */
(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  function applyTheme(t){
    if(t==='dark'){ document.documentElement.setAttribute('data-theme','dark'); toggle.setAttribute('aria-pressed','true');}
    else { document.documentElement.removeAttribute('data-theme'); toggle.setAttribute('aria-pressed','false');}
  }
  applyTheme(stored || (prefersDark ? 'dark' : 'light'));
  toggle.addEventListener('click', ()=>{
    const now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(now);
    localStorage.setItem('theme', now);
  });
})();
JS
```

**Contact form snippet (to place inside `index.html` contact section):**

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" id="contact-form" novalidate>
  <label for="name">Name</label><input id="name" name="name" required>
  <label for="email">Email</label><input id="email" name="email" type="email" required>
  <label for="message">Message</label><textarea id="message" name="message" required></textarea>
  <!-- Honeypot -->
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">
  <button type="submit">Send</button>
</form>
```

(Replace `YOUR_FORM_ID` with Formspree-provided ID.) ([Formspree][4])

**Acceptance tests:**

* Dark toggle persists across reloads; `localStorage.theme` reflects user choice.
* Modal traps focus; Escape closes it.
* Form submits to Formspree and a success state is shown (test with curl or test form).

**Rollback:** revert JS changes in git.

---

## Phase 4 — Build tools & automation

**Inputs:** completed static + interactive code.
**Tasks:** Configure linters, Prettier, basic npm scripts, image optimization pipeline, and CI to run linters and tests. Optionally configure Vite for local dev server only (still output static files).
**Outputs:** `package.json`, `.eslintrc.json`, `.prettierrc`, `.github/workflows/ci.yml`.
**Time estimate:** Medium (3–6 hours).
**Success criteria:** `npm run lint` and `npm run test` succeed in CI.

**Independent execution recipe (commands):**

```bash
# from project root
npm init -y
npm i -D eslint prettier lint-staged husky
# create basic eslint config
cat > .eslintrc.json <<'JSON'
{"env":{"browser":true,"es2021":true},"extends":"eslint:recommended","parserOptions":{"ecmaVersion":12}}
JSON

# Add simple CI workflow
mkdir -p .github/workflows
cat > .github/workflows/ci.yml <<'YML'
name: CI
on: [push,pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node
      uses: actions/setup-node@v4
      with: {node-version: '18'}
    - run: npm ci
    - run: npm run lint
    - run: npm run test || true
YML
```

**Rollback:** revert commit.

---

## Phase 5 — Testing & QA

**Inputs:** CI + site deployed on a preview environment or local server.
**Tasks:** run Lighthouse, run axe-core CLI, run E2E smoke tests, manual accessibility checks.
**Outputs:** `qa/lighthouse-report.json`, `qa/axe-report.json`, E2E log.
**Time estimate:** Medium (3–6 hours).
**Success criteria:** Lighthouse LCP ≤ 2.5s; axe reports no critical violations. ([web.dev][2], [npm][8])

**Independent execution recipe (commands):**

```bash
# Lighthouse (requires npm install -g lighthouse or use npx)
npx -y lighthouse http://localhost:5000 --only-categories=performance,accessibility,seo --output=json --output-path=qa/lighthouse.json

# axe-core CLI
npx -y @axe-core/cli https://localhost:5000 --save=qa/axe-report.json
```

**Rollback:** address issues listed in reports; re-run tests.

---

## Phase 6 — Deployment & Monitoring

**Inputs:** passing QA artifacts and repo (public).
**Tasks:** configure GitHub Pages deployment (push to `gh-pages` branch or use pages action), set up basic analytics (e.g., Plausible or Google Analytics), configure uptime monitoring and simple alerting (optional). ([GitHub Docs][3])
**Outputs:** live site URL, deployment checklist, rollback commands.
**Time estimate:** Low (1–2 hours).

**Independent execution recipe (deploy via gh-pages branch using actions):**

```bash
# Create production build (if any build step)
# For static files:
git add -A && git commit -m "deploy: prepare site" || true
git push origin main

# (CI) or manually create gh-pages branch:
git checkout --orphan gh-pages
git --work-tree=./site add --all
git --work-tree=./site commit -m "Deploy site"
git push origin HEAD:gh-pages --force
git checkout - # back to previous branch
```

**Rollback:** `git push origin --delete gh-pages` then redeploy previous commit or revert `main`.

---

## Phase 7 — Documentation & handover

**Inputs:** final codebase.
**Tasks:** create `README.md` (setup, test, deploy), `DEVELOPER.md` (component guide), and `CHANGELOG.md`. Add issue and PR templates.
**Outputs:** documentation files in root.
**Time estimate:** Low (1–3 hours).

**Independent execution recipe:**

```bash
cat > README.md <<'MD'
# Portfolio
## Dev
npm install && npm run dev
## Deploy
Push to main or use gh-pages branch; see .github workflows.
MD
```

---

## Phase 8 — Optional enhancements & future work

* PWA support (manifest, service worker).
* CMS integration (Netlify CMS, Contentful) for non-dev updates.
* Analytics event schema for interactions (click on project, contact submit).

---

## Engineering rules & standards (applies to all phases)

* **Git workflow**: feature branches, PRs, conventional commits.
* **Linters**: ESLint for JS, Stylelint for CSS (optional).
* **Accessibility**: Automated axe runs + manual checks. ([npm][8])
* **Performance**: enforce Lighthouse budget (LCP ≤ 2.5s). ([web.dev][2])
* **Security**: Example CSP header:

```http
Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline';
```

* **Observability**: record page views and contact-form events; log failed form submissions to analytics for monitoring.

---

## Acceptance tests (concrete)

1. **Nav keyboard order**: Tab sequence Home → Projects → About → Contact → Theme toggle. Press Enter activates item. (Manual + E2E)
2. **Project modal**: Open with Enter/Click; focus trapped; Escape closes. (Playwright)
3. **Form**: Submit with valid data; provider shows a record in inbox; network error returns appropriate error UI. (Manual + curl test)
4. **Performance**: `npx lighthouse` performance LCP ≤ 2.5s. ([web.dev][2])
5. **Accessibility**: `npx @axe-core/cli https://localhost:5000` no critical violations. ([npm][8])

---

## Debugging & Recovery (common failure modes)

* **Form doesn't submit**: Confirm `action` attribute is correct and provider form ID active; test with `curl -v -F 'name=Test' -F 'email=test@example.com' https://formspree.io/f/YOUR_FORM_ID`.
* **LCP too slow**: Check large hero image; replace with optimized AVIF/WebP and use `loading="eager"` only for critical small images; defer non-critical JS. ([RUMvision \[Real User Monitoring\]][7])
* **Accessibility violations**: Run axe, fix reported issues (missing labels, color contrast, focusable elements without ARIA roles).

---

## File manifests & sample snippets (what to create)

* `site/index.html` — main entry. (See Phase 2 snippet)
* `site/styles.css` — main styles (tokens + layout).
* `site/script.js` — dark mode + nav behaviour (Phase 3 snippet).
* `content/projects.json` — project dataset.
* `.github/workflows/ci.yml` — CI pipeline (Phase 4).
* `ASSUMPTIONS.md`, `backlog.json`, `README.md`.

---

## Final checklist before execution

* [ ] Confirm Formspree account & obtain `FORM_ID`.
* [ ] Provide brand colors / fonts (or accept placeholders).
* [ ] Confirm any analytics choice (Plausible/GA).
* [ ] Confirm whether a build tool (Vite) is desired or plain static preferred.

Ready-to-execute? Yes

Remaining assumptions to resolve if you want exact deploy:

* Replace `YOUR_FORM_ID` in contact `action`. ([Formspree][4])
* Supply brand assets (logo/photos) or accept placeholders.
* If you prefer Netlify hosting (instead of GitHub Pages), we’ll swap form approach (Netlify Forms) and CI steps accordingly. ([Netlify Docs][6])

---

## Sources & References

* WCAG 2.1 (W3C). ([W3C][1])
* Largest Contentful Paint (good target 2.5s) — web.dev. ([web.dev][2])
* GitHub Pages docs / overview. ([GitHub Docs][3])
* Formspree docs (forms for static sites). ([Formspree][4])
* prefers-color-scheme / dark mode (MDN). ([MDN Web Docs][5])
* AVIF / WebP guidance for modern images. ([RUMvision \[Real User Monitoring\]][7])
* axe-core CLI (accessibility automation). ([npm][8])

---

If you want, I can now:

* generate the initial repository structure and files (Phase 0–3) here (I will produce full `index.html`, `styles.css`, `script.js`, and a `projects.json` sample), or
* proceed to implement Phase 4 CI and a GitHub Actions workflow ready to deploy to GitHub Pages.

Which do you want me to execute next?

[1]: https://www.w3.org/TR/WCAG21/?utm_source=chatgpt.com "Web Content Accessibility Guidelines (WCAG) 2.1"
[2]: https://web.dev/articles/lcp?utm_source=chatgpt.com "Largest Contentful Paint (LCP) | Articles"
[3]: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages?utm_source=chatgpt.com "What is GitHub Pages?"
[4]: https://formspree.io/?utm_source=chatgpt.com "Custom Forms with No Server Code | Formspree | Formspree"
[5]: https://developer.mozilla.org/en-US/docs/Web/CSS/%40media/prefers-color-scheme?utm_source=chatgpt.com "prefers-color-scheme - CSS | MDN - Mozilla"
[6]: https://docs.netlify.com/manage/forms/setup/?utm_source=chatgpt.com "Forms setup | Netlify Docs"
[7]: https://www.rumvision.com/blog/modern-image-formats-webp-avif-browser-support/?utm_source=chatgpt.com "Modern Image Formats: WebP vs AVIF and its browser ..."
[8]: https://www.npmjs.com/package/%40axe-core/cli?utm_source=chatgpt.com "axe-core/cli"

---
https://chatgpt.com/share/68c19202-3b48-8007-b99b-c09149b96ed6
