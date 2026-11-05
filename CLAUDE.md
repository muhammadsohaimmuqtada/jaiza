# Jaiza — persistent project context (loaded every session in this repo)

You are working on **Jaiza**, a bootstrapped student startup in Pakistan. Read this first every session.

## What Jaiza is
Fixed-fee **10-day AI audit** for companies (PK MSMEs → enterprises with US/UK/Gulf clients).
Deliverables: **(1) spend ledger for the CFO**, **(2) signed certificate of review** for vendor
questionnaires / cyber-insurance / RFPs. Free client-side CSV **AI spend scan** (`scan.html`) = lead gen.
Live site: https://jaiza-chi.vercel.app/ · Repo remote: github.com/muhammadsohaimmuqtada/jaiza (branch `main`).

## Source-of-truth docs (read these before planning)
- `AUDIT.md` — full website audit + fixes shipped
- `PRODUCT-ROADMAP.md` — product phases, laws (PK: Companies Act/SECP, PSEB, FBR, PECA, ETO 2002;
  intl: GDPR/UK DPA, UAE+Saudi PDPL, PCI DSS, EU AI Act), frameworks (OWASP ASVS, NIST SSDF/CSF/AI RMF,
  ISO 27001/27701/42001, SOC 2 Type II, CIS v8), category standards (FinOps FOCUS, CSA CCM/CAIQ, SIG)
- `BOOTSTRAP-PLAN.md` — free stack (~₨15–30k total), 90-day GTM, pricing (audit ₨150–400k, cert pack
  ₨50–100k, never % of savings), 6-month metrics, risks

## Working rules
1. **Service first, product second.** Sell audits; build product with audit revenue. Zero-build static
   site stays zero-build until MVP (then Supabase free tier).
2. **Commit + push every meaningful change** to `main` — Vercel auto-deploys; git history IS the state.
3. **Budget = free tiers only** (GitHub Student Pack, Vercel, Supabase, Calendly, Zoho, Payoneer/Wise,
   Dependabot/CodeQL/gitleaks, OWASP ZAP). Only spend: SECP registration, .pk domain, one lawyer review.
4. **CI must pass**: HTML validation + all local refs resolve + required files exist (see `.github/workflows/ci.yml`).
   Run the same python check locally before pushing.
5. Design system: near-black `#0B0D12`, ivory `#F6F3EC`, bronze `#C8A24B`, oxblood `#7A1E2D`;
   Fraunces (serif) + Inter + IBM Plex Mono. Keep it premium/editorial — no lime, no card-grid slop.
6. Privacy posture: scan.js parses **entirely client-side**, no uploads, no tracking — never break this.

## Queued next actions (pick up where we left off)
1. Add Calendly link as primary "Book the audit" CTA (keep mailto fallback)
2. Create redacted sample deliverable PDFs (ledger 1-pager + certificate) and link on site
3. Write cold-DM script for LinkedIn outreach to Pakistani exporter founders
4. Apply GitHub Student Developer Pack; join PASHA + NIC cohort
5. Write 3 SEO articles (AI vendor questionnaire answers, AI spend audit Pakistan, SOC 2 questionnaire guide)
6. 20 cold DMs/week; target first 2 audits at 50% for testimonials

## Done in session 2 (2026-11-05, continued assessment)
- **scan.js bug fixes** (63 unit tests in /tmp/jaiza-test/scan-test.mjs, all passing):
  - `parseAmount` no longer parses dates as numbers (`2026-01-01` → was 20260101)
  - `₨ 5,600` no longer parses as 5.6 (comma-as-decimal bug when currency symbol present)
  - `matchVendor`: word-boundary matching for all keys ≤6 chars; `midjourne` (truncated merchant) added; Azure OpenAI ordered before generic `openai` key
  - headerless CSV column detection no longer picks the date column as the amount column
- **Security headers**: added `vercel.json` (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, immutable asset caching); CI now requires it
- **Verified**: no secrets in repo, no network calls in scan.js/script.js, no storage/cookies, all innerHTML values escaped or numeric, live site matches local, HSTS present

## Session continuity
- All decisions/progress go into the repo docs above + git commits (pushed).
- Knowledge-graph memory holds a "Jaiza startup project" entity with the same summary.
- If resuming after a gap: `git log --oneline -10`, read the 3 docs, check queued actions.
