# Jaiza

Jaiza runs **one fixed-fee, 10-day AI audit** for companies that cannot afford guesswork — from Pakistani MSMEs to multi-department enterprises with foreign clients.

The audit ends in **two documents**:

1. **The ledger** — a line-by-line map of AI spend (seats, API tokens, subscriptions, infrastructure) with exact cuts, ranked by amount. Built for the CFO.
2. **The certificate of review** — a signed attestation of how AI and data are handled inside the company, built for US / UK / Gulf vendor questionnaires, cyber-insurance underwriters, and enterprise RFPs.

## What the audit covers

- Subscriptions & seats — utilization per team, idle licenses
- API keys & tokens — spend per model and project, routing recommendations
- Shadow tools & vendor terms — unsanctioned tools, retention / training / contractual review
- Network flows & egress — what leaves the network, and where sensitive data is at risk

## Method

Three movements, ten days: **Discover** (interviews, expense lines, network flows) → **Assess** (cost reconciliation + vendor terms) → **Deliver** (ledger + certificate + prioritized remediation plan).

## Free AI Spend Scan (`scan.html`)

A client-side lead-gen tool: the visitor drops a CSV of expenses/card statements (or pastes lines), and `scan.js` parses it **entirely in the browser** — no upload, no network call, no storage. It matches lines against a list of known AI vendors, totals monthly spend per tool (converting currencies), flags tools running in parallel within a category, applies an idle-seat estimate to seat-based tools, and shows a ledger preview with a CSV export and a CTA to book the audit. The paid audit remains the step that reconciles this against admin consoles, invoices, and network flows.

## Repository structure

```text
jaiza/
├── index.html          # landing page
├── scan.html           # free client-side spend scan
├── styles.css
├── script.js           # nav, reveals, contact form (mailto)
├── scan.js             # the scanner (browser-only)
├── .github/workflows/ci.yml
├── README.md
├── LICENSE
└── SECURITY.md
```

The site is intentionally lightweight: plain HTML, CSS, and JavaScript — no build step. The contact form works without a backend: it validates input and opens a pre-filled `mailto:` to contact@jaiza.com.

## Website

Public site: https://jaiza-chi.vercel.app/

## Development

Open `index.html` directly, or serve locally:

```sh
python3 -m http.server 8000
# → http://127.0.0.1:8000
```

CI validates that the HTML parses, all local asset references exist, and the required files are present. It also fails the build if any page references a third-party resource: **all fonts, styles, scripts and images load from this site itself** (fonts are self-hosted in `assets/fonts/`, fetched once via the `fetch-fonts` GitHub Action). Loading fonts from fonts.googleapis.com would transmit every visitor's IP address to Google without consent — a documented GDPR violation (Landgericht München, 3 O 17493/20) — and would contradict the privacy claims on every page.

## Privacy & legal pages

- `privacy.html` — what the site collects (nothing), how the client-side scan works, email/engagement data handling, rights.
- `terms.html` — scope wording required by law: independent spend assessment, not a statutory audit (chartered accountants only under the Companies Act 2017), not a legal certification; engagement/limitation terms.
- `vercel.json` CSP allows only `'self'` font/style sources. The scan page advises removing full card numbers before pasting (PCI hygiene).
- Deeper compliance analysis lives in `LEGAL-BASIS.md` (working doc, not part of the site).

## Status

Jaiza is under active development. The engagement model and site will evolve as the methodology matures.
