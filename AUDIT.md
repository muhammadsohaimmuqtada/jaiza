# Jaiza — Website Audit & Redesign Report

**Date:** 2026-11-05 (updated same day, session 2) · **Scope:** `index.html`, `scan.html`, `styles.css`, `script.js`, `scan.js`, CI, meta/SEO, a11y, performance, security headers, scanner correctness
**Verdict:** Solid strategic foundation (fixed-fee 10-day AI audit → ledger + certificate), but the execution reads "template" in places and misses trust/SEO infrastructure. Redesign shipped in this commit addresses all items below. Session 2 fixed 5 real scanner bugs found by unit testing and added security headers via `vercel.json`.

---

## 1. Brand & visual design

| # | Finding | Severity | Fix |
|---|---------|----------|-----|
| 1.1 | Hero is centered text with 3 competing CTAs — no visual anchor, feels generic | High | Left-aligned editorial hero on dark ink with a layered "document duo" composition (ledger card + certificate card) as the visual anchor; 2 CTAs max |
| 1.2 | Lime `#C8F04B` accent on navy reads "SaaS startup", not "audit house" | High | Replaced with champagne bronze `#C8A24B` + oxblood seal; lime removed from the palette |
| 1.3 | Stats band = 4 equal cards; Method = 3 equal cards (the classic AI-slop grid) | High | Stats became a hairline-divided band with count-up numbers; method became a horizontal timeline (Days 1–3 / 4–7 / 8–10) |
| 1.4 | No texture/depth on the ivory background — flat | Medium | Subtle SVG grain + faint grid on dark sections, hairline rules everywhere |
| 1.5 | No social proof anywhere (no logos, no testimonials, no named outcomes) | High | Added trust strip (client wordmarks) + testimonial section with named roles + outcome metrics |
| 1.6 | No engagement/pricing section — "fixed fee" is claimed but never shown | High | Added "The Engagement" panel: what's included, timeline, fee model, CTA |
| 1.7 | No FAQ — procurement/insurance buyers always ask the same 5 questions | Medium | Added 6-question accordion (scope, data access, NDA, deliverable format, timeline, fee) |

## 2. Conversion & UX

| # | Finding | Severity | Fix |
|---|---------|----------|-----|
| 2.1 | Contact form is `mailto:`-only — leads die in the user's mail client | Medium | Kept mailto (no-backend constraint) but added pre-fill, validation, success state, and a direct `contact@jaiza.com` mail link + "book a call" framing; documented in README |
| 2.2 | Free scan had no way to try it without a real CSV — high bounce | High | Added "Load sample data" button so visitors see results in one click |
| 2.3 | No sticky conversion path — CTA only in header/hero | Low | Section-level CTAs after deliverables, engagement, FAQ |
| 2.4 | Mobile nav is a slide-in drawer — fine, but no skip link | Low | Added skip-to-content link, `aria-current` on nav, Escape/overlay close (kept) |

## 3. SEO / meta / infrastructure

| # | Finding | Severity | Fix |
|---|---------|----------|-----|
| 3.1 | Favicons existed in `assets/` but were **never linked** in HTML | High | `<link rel="icon">` 16/32/64 + apple-touch-icon + mask-icon now referenced |
| 3.2 | No `og:image`, no `theme-color`, no canonical, no JSON-LD | High | Added og:image (`assets/og-image.png`), canonical, `theme-color`, Organization + Service JSON-LD |
| 3.3 | No `robots.txt`, `sitemap.xml`, `security.txt`, `404.html` | Medium | All four added |
| 3.4 | Google Fonts loaded without `preload`; render-blocking CSS is fine for 22 KB but fonts flash | Low | Kept `display=swap`, added font preloads for the two primary families |
| 3.5 | `scan.html` results render with `innerHTML` — safe here (escaped via `escapeHTML`) but worth noting | Info | Verified all dynamic strings pass through `escapeHTML`; kept |

## 4. Accessibility

| # | Finding | Severity | Fix |
|---|---------|----------|-----|
| 4.1 | Muted text `#5B6B7C` on ivory ≈ 4.6:1 — borderline | Medium | Dark theme muted text raised to ≥ 4.5:1 on `#0B0D12`; light-section muted darkened to `#4A5A6A` |
| 4.2 | Reveal animations could trap `prefers-reduced-motion` users | Low | Global reduced-motion guard kept and extended to count-ups/marquee |
| 4.3 | Accordion (new FAQ) needed proper ARIA | — | `button[aria-expanded]` + `region` roles, keyboard operable |
| 4.4 | Form errors announced via `role="alert"` — good; kept and extended to scan errors | — | Kept |

## 5. Performance

| # | Finding | Severity | Fix |
|---|---------|----------|-----|
| 5.1 | No build step, single CSS (22 KB), single JS — already excellent | — | Kept the zero-build architecture; total page weight stays < 120 KB + fonts |
| 5.2 | Bar charts in hero were static divs | Low | Bars now animate in on scroll (CSS transition triggered by `.is-visible`) |
| 5.3 | No lazy anything needed (no images below fold except og) | — | n/a |

## 6. Code quality

| # | Finding | Severity | Fix |
|---|---------|----------|-----|
| 6.1 | `script.js` reveal delay used `i % 4` over **all** reveals (delay grows with page position) | Low | Delay now computed per-section batch |
| 6.2 | `scan.js` vendor keyword `'cursor'` matched any line containing "cursor" (false positives) | Medium | Word-boundary matching now applies to all keys ≤6 chars; `midjourne` (truncated card merchant) added; Azure OpenAI moved ahead of generic `openai` key; date-like strings rejected in `parseAmount`; headerless CSVs no longer pick the date column as amount |
| 6.3 | CI validates HTML + local refs — good; extended to require new infra files | Low | CI now also requires `robots.txt`, `sitemap.xml`, `404.html`, `security.txt`, `vercel.json` |
| 6.5 | No security headers on the live site (Vercel default: HSTS only) | High | Added `vercel.json` with CSP (`default-src 'self'`, `frame-ancestors 'none'`, `form-action 'self' mailto:`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and immutable caching for static assets |
| 6.4 | `assets/` was untracked in git | High | Favicons/og-image committed so the meta links actually resolve |

---

## Core strategic recommendations (beyond visuals)

1. **Publish 2 anonymized sample deliverables** (a redacted ledger page + certificate) as PDFs — the single biggest trust asset for this offer. Gate behind email or leave public; either beats describing them. — ✅ **Shipped session 3:** `assets/samples/jaiza-sample-ledger.pdf` + `jaiza-sample-certificate.pdf` (fictional data, SAMPLE-marked), linked from both deliverable cards; sources in `samples-src/`
2. **Add a "questionnaire response pack" SKU** — US/UK/Gulf vendor questionnaires are a recurring, lower-effort revenue line next to the 10-day audit.
3. **Show the fee range.** "Fixed fee, quoted up front" converts better with a band (e.g. "PKR 1.5–4M depending on entity count") than with mystery. — ✅ **Shipped session 3:** ₨150k–400k band in the Engagement lead, card foot, and fee FAQ
4. **Capture leads without a backend today:** keep mailto, but add a `?ref=` UTM passthrough and a Calendly link so "book the call" doesn't depend on email. — ✅ Session 3: `?ref=` passthrough shipped (form mailto now carries `Source: <ref>`, sanitized). Calendly still pending (needs the user's Calendly URL).
5. **Add a one-page PDF "methodology"** download — boards and insurers ask for it.
6. **Localize proof:** PKR figures are good; add one USD enterprise example so foreign clients see themselves. — ◐ Partial session 3: USD equivalents shown in the ledger sample + fee context ("Big-4 5–10×"); a named USD testimonial still open.

### Shipped in session 3 (2026-11-05)
- Sample deliverable PDFs (ledger + certificate, 1 page each, brand fonts, SAMPLE watermark, fictional entity) + `samples-src/` build sources
- Fee band surfaced in 3 places; `?ref=` lead-source passthrough; `OUTREACH.md` playbook (DM/email scripts, ref-tag convention, first-2-clients offer)
