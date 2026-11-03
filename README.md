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

## Repository structure

```text
jaiza/
├── index.html
├── styles.css
├── script.js
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

CI validates that the HTML parses, all local asset references exist, and the required files are present.

## Status

Jaiza is under active development. The engagement model and site will evolve as the methodology matures.
